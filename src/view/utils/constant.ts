import { ProjectionSpecification } from 'mapbox-gl'
import { LayerStyle, Row } from './types'

export const ACCESS_TOKEN =
  'pk.eyJ1IjoiaW5nZW40MiIsImEiOiJjazlsMnliMXoyMWoxM2tudm1hajRmaHZ6In0.rWx_wAz2cAeMIzxQQfPDPA'
export const DEFAULT_FILL_COLOR = '#555555'
export const DEFAULT_STROKE_COLOR = '#555555'
export const DEFAULT_STROKE_WIDTH = 2
export const DEFAULT_STROKE_OPACITY = 0.8
export const DEFAULT_FILL_OPACITY = 0.5

export const DEFAULT_FILL_STYLE_ROWS: Row[] = [
  {
    field: 'fill',
    value: DEFAULT_FILL_COLOR
  },
  {
    field: 'fill-opacity',
    value: DEFAULT_FILL_OPACITY
  },
  {
    field: 'stroke',
    value: DEFAULT_STROKE_COLOR
  },
  {
    field: 'stroke-width',
    value: DEFAULT_STROKE_WIDTH
  },
  {
    field: 'stroke-opacity',
    value: DEFAULT_STROKE_OPACITY
  }
]

export const DEFAULT_LINE_STYLE_ROWS: Row[] = [
  {
    field: 'stroke',
    value: DEFAULT_STROKE_COLOR
  },
  {
    field: 'stroke-width',
    value: DEFAULT_STROKE_WIDTH
  },
  {
    field: 'stroke-opacity',
    value: DEFAULT_STROKE_OPACITY
  }
]

export const DEFAULT_POINT_STYLE_ROWS: Row[] = [
  {
    field: 'fill',
    value: DEFAULT_FILL_COLOR
  },
  {
    field: 'fill-opacity',
    value: DEFAULT_FILL_OPACITY
  },
  {
    field: 'stroke',
    value: DEFAULT_STROKE_COLOR
  },
  {
    field: 'stroke-width',
    value: DEFAULT_STROKE_WIDTH
  },
  {
    field: 'stroke-opacity',
    value: DEFAULT_STROKE_OPACITY
  }
]

export const STYLE_FIELDS = [
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'fill',
  'fill-opacity'
]

export const LAYER_STYLES: LayerStyle[] = [
  {
    label: 'Standard',
    style: 'mapbox://styles/mapbox/standard'
  },
  {
    label: 'Satellite Streets',
    style: 'mapbox://styles/mapbox/satellite-streets-v12'
  },
  {
    label: 'Outdoors',
    style: 'mapbox://styles/mapbox/outdoors-v12'
  },
  {
    label: 'Light',
    style: 'mapbox://styles/mapbox/light-v11'
  },
  {
    label: 'Dark',
    style: 'mapbox://styles/mapbox/dark-v11'
  },
  {
    label: 'OSM',
    style: {
      name: 'osm',
      version: 8,
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
      sources: {
        'osm-raster-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
      },
      layers: [
        {
          id: 'osm-raster-layer',
          type: 'raster',
          source: 'osm-raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    }
  }
]

export const PROJECTIONS: {
  label: string
  value: ProjectionSpecification['name']
}[] = [
  {
    label: 'Globe',
    value: 'globe'
  },
  {
    label: 'Mercator',
    value: 'mercator'
  }
]
