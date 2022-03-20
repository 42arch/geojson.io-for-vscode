import React, { FunctionComponent, useEffect, useRef } from "react"
import * as L from "leaflet"
import 'leaflet-draw'
import { Layer, FeatureGroup, Map, GeoJSON } from "leaflet"
import getBbox from "@turf/bbox"
import PropsPopup from "./PropsPopup"
import { Feature, GeoJsonProperties } from "geojson"
import ReactDOM from "react-dom"

const assetUrl = `https://a.tiles.mapbox.com/v4/marker`
const accessToken = `pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A`

interface IProps {
  geojson: string
}

const SYMBOLSIZELIST = [
  { label: 'large', value: 'pin-l', size: [21, 54] },
  { label: 'medium', value: 'pin-m', size: [18, 42] },
  { label: 'small', value: 'pin-s', size: [15, 37.5] },
]

const genIcon = (symbol: string, size: string, color: string) => {
  const symbolSize = SYMBOLSIZELIST.find(i => (i.label === size))
  const iconSize = symbolSize?.size ? symbolSize?.size : [15, 37.5]
  const colorCode = (color && color.startsWith('#')) ? color.replace('#', '') : color
  const iconUrl = `${ assetUrl }/${ symbolSize?.value ? symbolSize?.value : 'pin-m' }${symbol ? '-'+ symbol : '' }+${colorCode ? colorCode: '7e7e7e'}.png?access_token=${accessToken}`
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: L.point(iconSize[0], iconSize[1]),
  })
  return icon
}

const MapCon: FunctionComponent<IProps> = ({ geojson }) => {
  const map = useRef<Map | null>(null)
  const geojsonLayer = useRef<GeoJSON | null>(null)
  const editLayer = useRef<FeatureGroup>(new L.FeatureGroup())
  const pointIcon = L.icon({
    iconUrl: `${assetUrl}/pin-m+7e7e7e.png?access_token=${accessToken}`
  })

  useEffect(() => {
    if(geojson) {
      createGeoJSONLayer(geojson)
    }

    if(map.current) {
      return
    }
    map.current = L.map('map')
    map.current.setView([45, 120], 7)
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A'
    }).addTo(map.current)

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
      vscode.postMessage(JSON.stringify(curGeoJSONData))
      createGeoJSONLayer(JSON.stringify(curGeoJSONData))
    })

    map.current.on('draw:edited', (e) => {
      const curGeoJSONData = editLayer.current.toGeoJSON()
      vscode.postMessage(JSON.stringify(curGeoJSONData))
    })

    map.current.on('draw:deleted', (e) => {
      const curGeoJSONData = editLayer.current.toGeoJSON()
      vscode.postMessage(JSON.stringify(curGeoJSONData))
    })

  }, [geojson])


  function createGeoJSONLayer(geojsonStr: string) {
    if(editLayer.current) {
      map.current?.removeLayer(editLayer.current)
      editLayer.current.clearLayers()
    }
    const geojsonData = JSON.parse(geojsonStr)
    const [minX, minY, maxX, maxY] = getBbox(geojsonData)
    if(![minX, minY, maxX, maxY].includes(Infinity) || ![minX, minY, maxX, maxY].includes(-Infinity)) {
      let bounds = L.latLngBounds(L.latLng(minY, minX), L.latLng(maxY, maxX))
      map.current && map.current.flyToBounds(bounds)
    }

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
        const pointIcon = genIcon(props['marker-symbol'], props['marker-size'], props['marker-color'])
        return L.marker(latlng, {
          icon: pointIcon
        })
      },
      onEachFeature: function(feature: Feature, layer: L.Layer) {
        editLayer.current.addLayer(layer)
        const popupNode = document.createElement("div")
        const popup = L.popup().setContent(popupNode)
        layer.bindPopup(popup)

        ReactDOM.render(
          <PropsPopup type={feature.geometry.type} properties={feature.properties} updateFeature={(p:GeoJsonProperties) => {updateFeature(feature, p)}} cancel={() => { popup.closePopup() }}/>,
          popupNode
        )
      }
    })
    map.current?.addLayer(editLayer.current)
  }

  const updateFeature = (feature: Feature, properties: GeoJsonProperties) => {
    feature.properties = properties
    // console.log('feature updated', feature)
    const curGeoJSONData = editLayer.current.toGeoJSON()
    createGeoJSONLayer(JSON.stringify(curGeoJSONData))
    vscode.postMessage(JSON.stringify(curGeoJSONData))
  }

  return (
    <div id="map" className="map">
    </div>
  )
}

export default MapCon