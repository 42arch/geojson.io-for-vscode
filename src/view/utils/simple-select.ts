import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw'

const SimpleSelect: DrawCustomMode = {
  ...MapboxDraw.modes.simple_select,
  onDrag: function (state, e) {
    const selectedFeatures = this.getSelected()
    const soloPointSelected =
      selectedFeatures.length === 1 && selectedFeatures[0].type === 'Point'

    // if the selected feature is a single point, allow dragging it without holding shift
    // shift is required for multiple features, or single linestrings and polygons
    if (state.canDragMove && (e.originalEvent.shiftKey || soloPointSelected)) {
      // @ts-expect-error this
      return this.dragMove(state, e)
    }
    if (this.drawConfig.boxSelect && state.canBoxSelect) {
      // @ts-expect-error this
      return this.whileBoxSelect(state, e)
    }
  }
}

export default SimpleSelect
