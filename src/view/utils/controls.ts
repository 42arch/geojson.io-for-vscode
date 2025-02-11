import { IControl, Map } from 'mapbox-gl'
import edit from '../../assets/edit.svg'

export class EditControl implements IControl {
  private map: Map | undefined
  private _container: HTMLElement | undefined

  onAdd(map: Map) {
    this.map = map
    this._container = document.createElement('div')
    this._container.className =
      'mapboxgl-ctrl-group mapboxgl-ctrl edit-control hidden'

    this._container.innerHTML = `
            <button class="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_edit" title="Edit geometries" style="background-image: url(${edit}); background-size: 13px 13px;">
              <img src=${edit} width=13 height=13 />
            </button>
          `

    return this._container
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container)
    this.map = undefined
  }

  open() {
    this._container?.style.setProperty('display', 'block')
  }

  close() {
    this._container?.style.setProperty('display', 'none')
  }

  onClick(cb: () => void) {
    this._container?.addEventListener('click', cb)
  }
}

export class SaveCancelControl {
  private map: mapboxgl.Map | undefined
  private _container: HTMLElement | undefined

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this._container = document.createElement('div')
    this._container.className = 'save-cancel-control '
    this._container.style.setProperty('display', 'none')
    this._container.innerHTML = `
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

    return this._container
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container)
    this.map = undefined
  }

  open() {
    this._container?.style.setProperty('display', 'block')
  }

  close() {
    this._container?.style.setProperty('display', 'none')
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
  private _container: HTMLElement | undefined

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this._container = document.createElement('div')
    this._container.className =
      'mapboxgl-ctrl-group mapboxgl-ctrl trash-control'
    this._container.style.setProperty('display', 'none')
    this._container.innerHTML = `
        <button class="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash" title="Delete">
        </button>
      `
    return this._container
  }

  open() {
    this._container?.style.setProperty('display', 'block')
  }

  close() {
    this._container?.style.setProperty('display', 'none')
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container)
    this.map = undefined
  }

  onClick(cb: () => void) {
    this._container?.addEventListener('click', cb)
  }
}
