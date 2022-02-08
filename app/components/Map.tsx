import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import mapboxgl, { Map } from "mapbox-gl"

interface IProps {
  geojson: string
}

const MapCon: FunctionComponent<IProps> = ({geojson}) => {

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const [zoom, setZoom] = useState(9)

  console.log(666, geojson)

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


  return (
    <div ref={ mapContainer } className="map-container">
    </div>
  )
}

export default MapCon