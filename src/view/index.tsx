import { useCallback, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import MapContainer from './components/map-container'
import { StoreProvider, useStore } from './components/store'
import { featureCollection } from '@turf/turf'
import { FeatureCollection } from 'geojson'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './index.less'
import { nanoid } from 'nanoid'
import ProjectionSwitch from './components/projection-switch'
import LayerSwitch from './components/layer-switch'

function App() {
  const { setGeojson } = useStore()

  const handleMessagesFromExtension = useCallback(
    (event: MessageEvent<string>) => {
      if (event.data === '') {
        const empty = featureCollection([])
        setGeojson(empty)
        return
      }
      const json = JSON.parse(event.data) as FeatureCollection
      json.features.forEach((feature) => {
        feature.properties = {
          ...feature.properties,
          _id: nanoid()
        }
      })
      setGeojson(json)
    },
    [setGeojson]
  )

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<string>) => {
      handleMessagesFromExtension(event)
    })
    return () => {
      window.removeEventListener('message', handleMessagesFromExtension)
    }
  }, [handleMessagesFromExtension])

  return (
    <div className="app">
      <MapContainer />
      <ProjectionSwitch />
      <LayerSwitch />
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <StoreProvider>
    <App />
  </StoreProvider>
)
