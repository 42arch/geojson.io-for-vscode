import { MapOptions } from 'mapbox-gl'

export type Row = { field: string; value: string | number }

export type LayerStyle = {
  label: string
  style: Exclude<MapOptions['style'], undefined>
}
