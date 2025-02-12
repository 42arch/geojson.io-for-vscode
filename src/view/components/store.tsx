import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { FeatureCollection } from 'geojson'
import { MapOptions, ProjectionSpecification } from 'mapbox-gl'
import { LayerStyle } from '../utils/types'
import { LAYER_STYLES } from '../utils/constant'

interface StoreProps {
  geojson: FeatureCollection | null
  setGeojson: (geojson: FeatureCollection) => void
  projection: ProjectionSpecification['name']
  setProjection: (projection: ProjectionSpecification['name']) => void
  layerStyle: LayerStyle
  setLayerStyle: (style: LayerStyle) => void
}

const Store = createContext<StoreProps>({} as StoreProps)

export function StoreProvider({ children }: PropsWithChildren) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null)
  const [projection, setProjection] =
    useState<ProjectionSpecification['name']>('globe')
  const [layerStyle, setLayerStyle] = useState<LayerStyle>(LAYER_STYLES[0])

  return (
    <Store.Provider
      value={{
        geojson,
        setGeojson,
        projection,
        setProjection,
        layerStyle,
        setLayerStyle
      }}>
      {children}
    </Store.Provider>
  )
}

export function useStore() {
  return useContext(Store)
}
