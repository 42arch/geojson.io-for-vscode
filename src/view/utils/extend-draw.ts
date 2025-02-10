import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { IControl, Map } from 'mapbox-gl'

type Button = {
  on: string
  action: () => void
  classes: string[]
  title: string
  elButton?: HTMLButtonElement
}

interface Options {
  draw: MapboxDraw
  buttons: Omit<Button, 'elButton'>[]
}

export default class ExtendDraw implements IControl {
  private map: Map | undefined
  private container: HTMLElement | undefined
  private draw: MapboxDraw | undefined
  private buttons: Button[]
  private onAddOrig: typeof MapboxDraw.prototype.onAdd
  private onRemoveOrig: typeof MapboxDraw.prototype.onRemove

  constructor({ draw, buttons }: Options) {
    this.draw = draw
    this.buttons = buttons
    this.onAddOrig = this.draw.onAdd
    this.onRemoveOrig = this.draw.onRemove
  }

  onAdd(map: Map) {
    this.map = map
    this.container = this.onAddOrig(map)
    this.buttons.forEach((b) => {
      this.addButton(b)
    })
    return this.container
  }

  onRemove(map: Map) {
    this.buttons.forEach((b) => {
      this.removeButton(b)
    })
    this.onRemoveOrig(map)
  }

  addButton(opt: Button) {
    const elButton = document.createElement('button')
    elButton.className = 'mapbox-gl-draw_ctrl-draw-btn'
    if (opt.classes instanceof Array) {
      opt.classes.forEach((c) => {
        elButton.classList.add(c)
      })
    }
    elButton.addEventListener(opt.on, opt.action)
    elButton.title = opt.title
    this.container?.appendChild(elButton)
    opt.elButton = elButton
  }

  removeButton(opt: Button) {
    opt.elButton?.removeEventListener(opt.on, opt.action)
    opt.elButton?.remove()
  }
}
