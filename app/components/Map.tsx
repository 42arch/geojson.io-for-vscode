import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import mapboxgl, { Map, LngLatBoundsLike, FillLayer, CircleLayer, LineLayer } from "mapbox-gl"
import MapBoxDraw from "@mapbox/mapbox-gl-draw"
import getBbox from "@turf/bbox"
interface IProps {
  geojson: string
}

const SOURCE_NAME = 'geojson-data'
const POLYGON_LAYER_NAME = 'fill-layer'
const POLYLINE_LAYER_NAME = 'line-layer'
const POINT_LAYER_NAME = 'circle-layer'

const MapCon: FunctionComponent<IProps> = ({geojson}) => {

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if(!map.current?.isStyleLoaded()) {
      map.current?.on('load', () => {
        addGeojsonLayer(geojson)
      })
    } else {
      addGeojsonLayer(geojson)
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiaW5nZW40MiIsImEiOiJjazlsMnliMXoyMWoxM2tudm1hajRmaHZ6In0.rWx_wAz2cAeMIzxQQfPDPA'
    if(map.current) {
      return
    } 
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current || '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.9, 42.3],
      attributionControl: false,
      zoom: zoom
    })
    const draw = new MapBoxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    })

    // map.current.addControl(draw)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')

  }, [geojson])

  function addGeojsonLayer(geojson: string) {
    map.current?.getLayer(POLYGON_LAYER_NAME) && map.current?.removeLayer(POLYGON_LAYER_NAME)
    map.current?.getLayer(POLYLINE_LAYER_NAME) && map.current?.removeLayer(POLYLINE_LAYER_NAME)
    map.current?.getLayer(POINT_LAYER_NAME) && map.current?.removeLayer(POINT_LAYER_NAME)
    if(map.current?.getSource(SOURCE_NAME)) {
      map.current?.removeSource(SOURCE_NAME)
    } 

    const polygonLayer: FillLayer = {
      id: POLYGON_LAYER_NAME,
      type: 'fill',
      source: SOURCE_NAME,
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.7
      },
      filter: ['==', '$type', 'Polygon']
    }

    const polylineLayer: LineLayer = {
      id: POLYLINE_LAYER_NAME,
      type: 'line',
      source: SOURCE_NAME,
      paint: {
        'line-color': '#0080ff',
        'line-opacity': 0.7,
        'line-width': 2.5
      },
      filter: ['==', '$type', 'LineString']
    }

    const pointLayer: CircleLayer = {
      id: POINT_LAYER_NAME,
      type: 'circle',
      source: SOURCE_NAME,
      paint: {
        'circle-radius': 6,
        'circle-color': '#0080ff',
        "circle-opacity": 0.7
      },
      filter: ['==', '$type', 'Point']
    }

    if(!geojson) {
      return
    }
    const geojsonObj = JSON.parse(geojson)
    const [minX, minY, maxX, maxY] = getBbox(geojsonObj)
    const bounds: LngLatBoundsLike = [[minX, minY], [maxX, maxY]]
    map.current?.addSource(SOURCE_NAME, {
      type: 'geojson',
      data: geojsonObj
    })
    map.current?.addLayer(polygonLayer)
    map.current?.addLayer(pointLayer)
    map.current?.addLayer(polylineLayer)
    map.current?.fitBounds(bounds)
  }

  return (
    <div ref={ mapContainer } className="map-container">
    </div>
  )
}

export default MapCon