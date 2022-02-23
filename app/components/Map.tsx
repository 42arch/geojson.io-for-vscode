import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import mapboxgl, { Map, GeoJSONSource, LngLatBoundsLike } from "mapbox-gl"
import getBbox from "@turf/bbox"

interface IProps {
  geojson: string
}

const MapCon: FunctionComponent<IProps> = ({geojson}) => {

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const [zoom, setZoom] = useState(9)


  // console.log(666, geojson)
  map.current?.on('load', () => {
    addGeojsonLayer(geojson)
  })

  useEffect(() => {
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
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
  })

  function addGeojsonLayer(geojson: string) {
    if(!geojson) {
      return
    }
    const geojsonObj = JSON.parse(geojson)
    const [minX, minY, maxX, maxY] = getBbox(geojsonObj)
    const bounds: LngLatBoundsLike = [[minX, minY], [maxX, maxY]]
    map.current?.addSource('geojson', {
      type: 'geojson',
      data: geojsonObj
    })
    map.current?.addLayer({
      'id': 'geojson-layer',
      'type': 'fill',
      source: 'geojson',
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.7
      }
    })
    map.current?.fitBounds(bounds)
  }


  return (
    <div ref={ mapContainer } className="map-container">
    </div>
  )
}

export default MapCon