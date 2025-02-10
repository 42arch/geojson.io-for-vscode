import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { FeatureCollection } from 'geojson'

interface StoreProps {
  geojson: FeatureCollection | null
  setGeojson: (geojson: FeatureCollection) => void
}

const Store = createContext<StoreProps>({} as StoreProps)

export function StoreProvider({ children }: PropsWithChildren) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null)

  return (
    <Store.Provider
      value={{
        geojson,
        setGeojson
      }}>
      {children}
    </Store.Provider>
  )
}

export function useStore() {
  return useContext(Store)
}
