import * as L from "leaflet"

export const ASSETURL = `https://a.tiles.mapbox.com/v4/marker`
export const TOKEN = `pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A`


export const SYMBOLLIST = [
	{ label: '', url: 'pin-m' },
	{ label: 'circle', url: 'pin-m-circle' },
	{ label: 'circle-stroked', url: 'pin-m-circle-stroked' },
	{ label: 'square', url: 'pin-m-square' },
	{ label: 'square-stroked', url: 'pin-m-square-stroked' },
	{ label: 'star', url: 'pin-m-star' },
	{ label: 'star-stroked', url: 'pin-m-star-stroked' },
	{ label: 'cross', url: 'pin-m-cross' }
]

export const SYMBOLSIZELIST = [
  { label: 'large', value: 'pin-l', size: [21, 54] },
  { label: 'medium', value: 'pin-m', size: [18, 42] },
  { label: 'small', value: 'pin-s', size: [15, 37.5] },
]

export const genMarkerIcon = (symbol: string, size: string, color: string) => {
  const symbolSize = SYMBOLSIZELIST.find(i => (i.label === size))
  const iconSize = symbolSize?.size ? symbolSize?.size : [15, 37.5]
  const colorCode = (color && color.startsWith('#')) ? color.replace('#', '') : color
  const iconUrl = `${ ASSETURL }/${ symbolSize?.value ? symbolSize?.value : 'pin-m' }${symbol ? '-'+ symbol : '' }+${colorCode ? colorCode: '7e7e7e'}.png?access_token=${TOKEN}`
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: L.point(iconSize[0], iconSize[1]),
  })
  return icon
}