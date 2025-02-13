import { IControl, Map } from 'mapbox-gl'

export class EditControl implements IControl {
  private map: Map | undefined
  private container: HTMLElement | undefined

  onAdd(map: Map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className =
      'mapboxgl-ctrl-group mapboxgl-ctrl edit-control hidden'

    this.container.innerHTML = `
            <button class="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_edit" title="Edit geometries" >
            </button>
          `

    return this.container
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container)
    this.map = undefined
  }

  open() {
    this.container?.style.setProperty('display', 'block')
  }

  close() {
    this.container?.style.setProperty('display', 'none')
  }

  onClick(cb: () => void) {
    this.container?.addEventListener('click', cb)
  }
}

export class SaveCancelControl {
  private map: mapboxgl.Map | undefined
  private container: HTMLElement | undefined

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className = 'save-cancel-control '
    this.container.style.setProperty('display', 'none')
    this.container.innerHTML = `
            <div class='label'>Editing Geometries</div>
            <div class="buttons">
              <button id="mapboxgl-draw-actions-btn_save" class='mapboxgl-draw-actions-btn' title="Save changes.">
                Save
              </button>
              <button id="mapboxgl-draw-actions-btn_cancel" class='mapboxgl-draw-actions-btn' title="Cancel editing, discards all changes.">
                Cancel
              </button>
            </div>
          `

    return this.container
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container)
    this.map = undefined
  }

  open() {
    this.container?.style.setProperty('display', 'block')
  }

  close() {
    this.container?.style.setProperty('display', 'none')
  }

  onSaveClick(cb: () => void) {
    document
      .getElementById('mapboxgl-draw-actions-btn_save')
      ?.addEventListener('click', cb)
  }

  onCancelClick(cb: () => void) {
    document
      .getElementById('mapboxgl-draw-actions-btn_cancel')
      ?.addEventListener('click', cb)
  }
}

export class TrashControl {
  private map: mapboxgl.Map | undefined
  private container: HTMLElement | undefined

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl trash-control'
    this.container.style.setProperty('display', 'none')
    this.container.innerHTML = `
        <button class="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash" title="Delete">
        </button>
      `
    return this.container
  }

  open() {
    this.container?.style.setProperty('display', 'block')
  }

  close() {
    this.container?.style.setProperty('display', 'none')
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container)
    this.map = undefined
  }

  onClick(cb: () => void) {
    this.container?.addEventListener('click', cb)
  }
}
