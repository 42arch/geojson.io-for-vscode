import React, { FunctionComponent, useEffect, useRef } from "react"
import * as L from "leaflet"
import 'leaflet-draw'
import { Layer, FeatureGroup, Map, GeoJSON } from "leaflet"
import getBbox from "@turf/bbox"
interface IProps {
  geojson: string
}

const MapCon: FunctionComponent<IProps> = ({ geojson }) => {
  const map = useRef<Map | null>(null)
  const geojsonLayer = useRef<GeoJSON | null>(null)
  const editLayer = useRef<FeatureGroup>(new L.FeatureGroup())
  const pointIcon = L.icon({
    iconUrl: 'https://a.tiles.mapbox.com/v4/marker/pin-m+7e7e7e.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A',
    iconSize: [15, 35],
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
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A`, {
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
        switch (feature?.geometry.type) {
          case 'Polygon':
          case 'MultiPolygon':
            return { fillColor: '#555555', fillOpacity: 0.5, stroke: true, color: '#555555', weight: 2 }
          case 'LineString':
          case 'MultiLineString':
            return { color: '#555555', weight: 2 }
          case 'Point':
          case 'MultiPoint':
            return { }
          default:
            return { }
        }
      },
      pointToLayer: function(geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: pointIcon
        })
      },
      onEachFeature: function(feature, layer) {
        editLayer.current.addLayer(layer)
      }
    })
    map.current?.addLayer(editLayer.current)
  }

  return (
    <div id="map" className="map">
    </div>
  )
}

export default MapCon