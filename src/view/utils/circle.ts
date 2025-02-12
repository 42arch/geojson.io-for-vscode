// custom mapbopx-gl-draw mode that extends draw_line_string
// shows a center point, radius line, and circle polygon while drawing

import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw'
import { circle, length } from '@turf/turf'

// forces draw.create on creation of second vertex
// const circle = require('@turf/circle').default
// const length = require('@turf/length').default
// const MapboxDraw = require('@mapbox/mapbox-gl-draw').default

// const { getDisplayMeasurements } = require('./util.js')

function circleFromTwoVertexLineString(geojson: any) {
  const center = geojson.geometry.coordinates[0]
  const radiusInKm = length(geojson)

  return circle(center, radiusInKm)
}

const DrawCircle: DrawCustomMode = {
  ...MapboxDraw.modes.draw_line_string,

  onClick: function (state: any, e: any) {
    // this ends the drawing after the user creates a second point, triggering this.onStop
    if (state.currentVertexPosition === 1) {
      state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
      return this.changeMode('simple_select', { featureIds: [state.line.id] })
    }

    state.line.updateCoordinate(
      state.currentVertexPosition,
      e.lngLat.lng,
      e.lngLat.lat
    )
    if (state.direction === 'forward') {
      state.currentVertexPosition += 1
      state.line.updateCoordinate(
        state.currentVertexPosition,
        e.lngLat.lng,
        e.lngLat.lat
      )
    } else {
      state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
    }

    return null
  },

  onStop: function (state) {
    this.activateUIButton()

    // check to see if we've deleted this feature
    if (this.getFeature(state.line.id) === undefined) return

    // remove last added coordinate
    state.line.removeCoordinate('0')
    if (state.line.isValid()) {
      const lineGeoJson = state.line.toGeoJSON()
      const circleFeature = circleFromTwoVertexLineString(lineGeoJson)

      this.map.fire('draw.create', {
        features: [circleFeature]
      })
    } else {
      this.deleteFeature(state.line.id, { silent: true })
      this.changeMode('simple_select', {}, { silent: true })
    }
  },

  toDisplayFeatures: function (state, geojson: any, display: any) {
    // Only render the line if it has at least one real coordinate
    if (geojson.geometry.coordinates.length < 2) return null

    display({
      type: 'Feature',
      properties: {
        active: 'true'
      },
      geometry: {
        type: 'Point',
        coordinates: geojson.geometry.coordinates[0]
      }
    })

    // displays the line as it is drawn
    geojson.properties.active = 'true'
    display(geojson)

    // const displayMeasurements = getDisplayMeasurements(geojson)

    // create custom feature for the current pointer position
    const currentVertex = {
      type: 'Feature',
      properties: {
        meta: 'currentPosition',
        // radius: `${displayMeasurements.metric} ${displayMeasurements.standard}`,
        parent: state.line.id
      },
      geometry: {
        type: 'Point',
        coordinates: geojson.geometry.coordinates[1]
      }
    }

    display(currentVertex)

    const circleFeature = circleFromTwoVertexLineString(geojson)

    circleFeature.properties = {
      active: 'true'
    }

    display(circleFeature)

    return null
  }
}

export default DrawCircle
