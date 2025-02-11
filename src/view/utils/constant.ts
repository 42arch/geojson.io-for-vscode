import { Row } from './types'

export const DEFAULT_FILL_COLOR = '#000000'
export const DEFAULT_STROKE_COLOR = '#000000'
export const DEFAULT_STROKE_WIDTH = 2
export const DEFAULT_STROKE_OPACITY = 0.8
export const DEFAULT_FILL_OPACITY = 0.5
export const DEFAULT_DARK_FEATURE_COLOR = '#555'

// export const DEFAULT_FILL_STYLES = {
//   fill: DEFAULT_FILL_COLOR,
//   'fill-opacity': DEFAULT_FILL_OPACITY,
//   stroke: DEFAULT_STROKE_COLOR,
//   'stroke-width': DEFAULT_STROKE_WIDTH,
//   'stroke-opacity': DEFAULT_STROKE_OPACITY
// }

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

// export const DEFAULT_LINE_STYLES = {
//   stroke: DEFAULT_STROKE_COLOR,
//   'stroke-width': DEFAULT_STROKE_WIDTH,
//   'stroke-opacity': DEFAULT_STROKE_OPACITY
// }

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

// export const DEFAULT_POINT_STYLES = {
//   fill: DEFAULT_FILL_COLOR,
//   'fill-opacity': DEFAULT_FILL_OPACITY,
//   stroke: DEFAULT_STROKE_COLOR,
//   'stroke-width': DEFAULT_STROKE_WIDTH,
//   'stroke-opacity': DEFAULT_STROKE_OPACITY
// }

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
