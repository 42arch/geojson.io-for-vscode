import { LayerSpecification } from 'mapbox-gl'

const styles: Omit<LayerSpecification, 'source'>[] = [
  // points selected
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'true']
    ],
    paint: {
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  // points not selected
  {
    id: 'gl-draw-point',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'false']
    ],
    paint: {
      'circle-radius': 5,
      'circle-color': ['coalesce', ['get', 'user_fill-color'], '#555555'],
      'circle-opacity': ['coalesce', ['get', 'user_fill-opacity'], 1],
      'circle-stroke-color': ['coalesce', ['get', 'user_stroke'], '#ffffff'],
      'circle-stroke-width': ['coalesce', ['get', 'user_stroke-width'], 2],
      'circle-stroke-opacity': ['coalesce', ['get', 'user_fill-opacity'], 1]
    }
  },
  // lines selected
  // {
  //   id: 'gl-draw-line-active',
  //   type: 'line',
  //   filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
  //   layout: {
  //     'line-cap': 'round',
  //     'line-join': 'round'
  //   },
  //   paint: {
  //     'line-color': '#fbb03b',
  //     'line-dasharray': [1, 2],
  //     'line-width': 2
  //   }
  // },
  // lines not selected
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['coalesce', ['get', 'user_stroke'], '#555555'],
      'line-width': ['coalesce', ['get', 'user_stroke-width'], 2],
      'line-opacity': ['coalesce', ['get', 'user_stroke-opacity'], 1]
      // 'line-dasharray': [0.2, 2]
    }
  },
  // polygons selected
  // {
  //   id: 'gl-draw-polygon-fill-active',
  //   type: 'fill',
  //   filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
  //   paint: {
  //     'fill-color': ['coalesce', ['get', 'user_fill'], '#555555'],
  //     'fill-opacity': ['coalesce', ['get', 'user_fill-opacity'], 0.5]
  //   }
  // },
  // polygons outline selected
  // {
  //   id: 'gl-draw-polygon-outline-active',
  //   type: 'line',
  //   filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
  //   paint: {
  //     'line-color': '#999222',
  //     'line-width': 2,
  //     'line-opacity': 1
  //   }
  // },
  // polygons not selected
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': ['coalesce', ['get', 'user_fill'], '#555555'],
      'fill-opacity': ['coalesce', ['get', 'user_fill-opacity'], 0.5]
    }
  },
  // polygons outline not selected
  {
    id: 'gl-draw-polygon-outline',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'line-color': ['coalesce', ['get', 'user_stroke'], '#555555'],
      'line-width': ['coalesce', ['get', 'user_stroke-width'], 2],
      'line-opacity': ['coalesce', ['get', 'user_stroke-opacity'], 1]
    }
  },
  // mid points
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  // vertex points not selected
  {
    id: 'gl-draw-polygon-and-line-vertex',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['==', 'active', 'false']
    ],
    paint: {
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  // vertex points selected
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['==', 'active', 'true']
    ],
    paint: {
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-radius': 6,
      'circle-color': '#fbb03b'
    }
  }
]

export default styles
