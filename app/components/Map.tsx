import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import * as L from "leaflet"
import { FeatureGroup, Map, GeoJSON, Layer } from "leaflet"
import 'leaflet-draw'
import 'esri-leaflet'
import { vectorBasemapLayer } from 'esri-leaflet-vector'
import getBbox from "@turf/bbox"
import PropsPopup from "./PropsPopup"
import { Feature, GeoJsonProperties } from "geojson"
import calcFeature from "../utils/calc"
import { ASSET_URL, genMarkerIcon, TOKEN, API_KEY, LAYER_LIST } from "../utils/constant"

interface IProps {
  geojson: string
}

const pointIcon = L.icon({
  iconUrl: `${ASSET_URL}/pin-m+7e7e7e.png?access_token=${TOKEN}`,
})

const vectorTiles: { [name: string]: Layer } = {}

const MapCon: FunctionComponent<IProps> = ({ geojson }) => {
  const map = useRef<Map | null>(null)
  const geojsonLayer = useRef<GeoJSON | null>(null)
  const editLayer = useRef<FeatureGroup>(new L.FeatureGroup())

  useEffect(() => {
    if(geojson) {
      createGeoJSONLayer(geojson, true)
    }
    if(map.current) {
      return
    }
    map.current = L.map('map', {
      center: [0, 0],
      zoom: 2,
    })

    vectorTiles['Default'] = vectorBasemapLayer(null, {
      apiKey: API_KEY
    })
    LAYER_LIST.forEach((layerStr) => {
      vectorTiles[layerStr] = vectorBasemapLayer(layerStr, {
        apiKey: API_KEY
      })
    })

    L.control.layers(vectorTiles).addTo(map.current)
    vectorTiles.Default.addTo(map.current)

    const option: L.Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        circle: false,
        circlemarker: false,
        polyline: {
          shapeOptions: {
            color: '#555555', opacity: 1
          }
        },
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Oh snap!<strong> you can\'t draw that!'
          },
          shapeOptions: {
            fillColor: '#555555', fillOpacity: 0.5, stroke: true, color: '#555555', opacity: 1, weight: 2
          }
        },
        marker: {
          icon: pointIcon
        },
        rectangle: {
          shapeOptions: {
            fillColor: '#555555', fillOpacity: 0.5, stroke: true, color: '#555555', opacity: 1, weight: 2
          }
        }
      },
      edit: {
        featureGroup: editLayer.current, //REQUIRED!!
        remove: true
      }
    }
    const drawControl = new L.Control.Draw(option)
    map.current && map.current.addControl(drawControl)

    map.current.on('draw:created', (e) => {
      editLayer.current.addLayer(e.layer)
      const curGeoJSONData = editLayer.current.toGeoJSON()
      const s = JSON.stringify(curGeoJSONData)
      vscode.postMessage({ type: 'data', data: s })
      createGeoJSONLayer(s)
    })

    map.current.on('draw:edited', (e) => {
      const curGeoJSONData = editLayer.current.toGeoJSON()
      vscode.postMessage({ type: 'data', data: JSON.stringify(curGeoJSONData) })
    })

    map.current.on('draw:deleted', (e) => {
      const curGeoJSONData = editLayer.current.toGeoJSON()
      vscode.postMessage({ type: 'data', data: JSON.stringify(curGeoJSONData) })
    })

  }, [geojson])


  function createGeoJSONLayer(geojsonStr: string, zoom: boolean = false) {
    if(editLayer.current) {
      map.current?.removeLayer(editLayer.current)
      editLayer.current.clearLayers()
    }
    const geojsonData = JSON.parse(geojsonStr)
    if (zoom) {
      const [minX, minY, maxX, maxY] = getBbox(geojsonData)
      if(![minX, minY, maxX, maxY].includes(Infinity) || ![minX, minY, maxX, maxY].includes(-Infinity)) {
        let bounds = L.latLngBounds(L.latLng(minY, minX), L.latLng(maxY, maxX))
        map.current && map.current.flyToBounds(bounds)
      }
    }

    try {
      geojsonLayer.current = L.geoJSON(geojsonData, {
        style: function(feature) {
          const props = feature?.properties
          switch (feature?.geometry.type) {
            case 'Polygon':
            case 'MultiPolygon':
              return {
                fillColor: props['fill'] ? props['fill'] : '#555555',
                fillOpacity: props['fill-opacity'] ? props['fill-opacity'] : 0.5,
                stroke: true,
                color: props['stroke'] ? props['stroke'] : '#555555',
                opacity: props['stroke-opacity'] ? props['stroke-opacity'] : 1,
                weight: props['stroke-width'] ? props['stroke-width'] : 2
              }
            case 'LineString':
            case 'MultiLineString':
              return {
                color: props['stroke'] ? props['stroke'] : '#555555',
                opacity: props['stroke-opacity'] ? props['stroke-opacity'] : 1,
                weight: props['stroke-width'] ? props['stroke-width'] : 2
              }
            case 'Point':
            case 'MultiPoint':
              return { }
            default:
              return { }
          }
        },
        pointToLayer: function(geoJsonPoint, latlng) {
          const props = geoJsonPoint?.properties
          const pointIcon = genMarkerIcon(props['marker-symbol'], props['marker-size'], props['marker-color'])
          return L.marker(latlng, {
            icon: pointIcon
          })
        },
        onEachFeature: function(feature: Feature, layer: L.Layer) {
          editLayer.current.addLayer(layer)
          const popupNode = document.createElement("div")
          const popup = L.popup().setContent(popupNode)
          layer.bindPopup(popup)
          
          const featureInfo = calcFeature(feature)
  
          ReactDOM.render(
            <PropsPopup type={feature.geometry.type} properties={feature.properties} info={featureInfo} updateFeature={(p: GeoJsonProperties , isSave : boolean = true) => {updateFeature(feature, p , isSave , layer)}} cancel={() => { popup.closePopup() }}/>,
            popupNode
          )
        }
      })
      map.current?.addLayer(editLayer.current)
    } catch (error) {
      console.log(2222, { type: 'error', data: String(error) })
      vscode.postMessage({ type: 'error', data: String(error) })
    }
  }
  function getLeafStyleFromGeoJsonStyle(type : string,properties : GeoJsonProperties){
      const props = properties
      if(props === null) return {}
      switch (type) {
        case 'Polygon':
        case 'MultiPolygon':
          return {
            fillColor: props['fill'] ? props['fill'] : '#555555',
            fillOpacity: props['fill-opacity'] ? props['fill-opacity'] : 0.5,
            stroke: true,
            color: props['stroke'] ? props['stroke'] : '#555555',
            opacity: props['stroke-opacity'] ? props['stroke-opacity'] : 1,
            weight: props['stroke-width'] ? props['stroke-width'] : 2
          }
        case 'LineString':
        case 'MultiLineString':
          return {
            color: props['stroke'] ? props['stroke'] : '#555555',
            opacity: props['stroke-opacity'] ? props['stroke-opacity'] : 1,
            weight: props['stroke-width'] ? props['stroke-width'] : 2
          }
        case 'Point':
          return genMarkerIcon(props['marker-symbol'], props['marker-size'], props['marker-color'])
        case 'MultiPoint':
          return { }
        default:
          return { }
      }
  }
  function upadteStyle(feature : Feature, properties : GeoJsonProperties , layer : L.Layer){
    if(editLayer.current) {
      const style = getLeafStyleFromGeoJsonStyle(feature.geometry.type,properties)
      if(!style) return
      if(layer instanceof L.Marker) {
        layer.setIcon(style as L.Icon)
        return
      }
      if(layer instanceof L.Polyline || layer instanceof L.Polygon){
        layer.setStyle(style as L.PathOptions)
        return
      }
      
    }
  }

  const updateFeature = (feature: Feature, properties: GeoJsonProperties , isSave : boolean , layer : L.Layer) => {
    feature.properties = properties
    const curGeoJSONData = editLayer.current.toGeoJSON()
    const s = JSON.stringify(curGeoJSONData)
    // when isSave is true update style and update files false update style not update files
    if(isSave) {
      createGeoJSONLayer(s)
      vscode.postMessage({ type: 'data', data: s })
      return
    }
    upadteStyle(feature , properties , layer)
   
  }

  return (
    <>
      <div id="map" className="map"></div>
    </>
  )
}

export default MapCon