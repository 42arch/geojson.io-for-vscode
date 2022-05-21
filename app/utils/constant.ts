import * as L from "leaflet"

export const ASSET_URL = `https://a.tiles.mapbox.com/v4/marker`
// mapbox token
export const TOKEN = `pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A`
// esri api key
export const API_KEY = 'AAPK1241ad7e316e4489976f61c0af02491bYPPiBRS49FnRYvOBlFotefdVTVHZr2CddbDhLyqPrADa-lrrFLP0-e96rtW1vpSP'

export const LAYER_LIST = [
  "ArcGIS:Imagery",
  "ArcGIS:Imagery:Standard",
  "ArcGIS:LightGray",
  "ArcGIS:LightGray:Base",
  "ArcGIS:DarkGray",
  "ArcGIS:DarkGray:Base",
  "ArcGIS:Navigation",
  "ArcGIS:NavigationNight",
  "ArcGIS:Streets",
  "ArcGIS:StreetsNight",
  "ArcGIS:StreetsRelief",
  "ArcGIS:StreetsRelief:Base",
  "ArcGIS:Topographic",
  "ArcGIS:Topographic:Base",
  "ArcGIS:Oceans",
  "ArcGIS:Oceans:Base",
  "OSM:Standard",
  "OSM:StandardRelief",
  "OSM:StandardRelief:Base",
  "OSM:Streets",
  "OSM:StreetsRelief",
  "OSM:StreetsRelief:Base",
  "OSM:LightGray",
  "OSM:LightGray:Base",
  "OSM:DarkGray",
  "OSM-DarkGray:Base",
  "ArcGIS:Terrain",
  "ArcGIS:Terrain:Base",
  "ArcGIS:Terrain:Detail",
  "ArcGIS:Community",
  "ArcGIS:ChartedTerritory",
  "ArcGIS:ChartedTerritory:Base",
  "ArcGIS:ColoredPencil",
  "ArcGIS:Nova",
  "ArcGIS:ModernAntique",
  "ArcGIS:ModernAntique:Base",
  "ArcGIS:Midcentury",
  "ArcGIS:Newspaper",
  "ArcGIS:Hillshade:Light",
  "ArcGIS:Hillshade:Dark"
]

export const SYMBOL_LIST = [
  { label: '', url: 'pin-m' },
  { label: 'circle', url: 'pin-m-circle' },
  { label: 'circle-stroked', url: 'pin-m-circle-stroked' },
  { label: 'square', url: 'pin-m-square' },
  { label: 'square-stroked', url: 'pin-m-square-stroked' },
  { label: 'star', url: 'pin-m-star' },
  { label: 'star-stroked', url: 'pin-m-star-stroked' },
  { label: 'cross', url: 'pin-m-cross' },
  { label: 'marker', url: 'pin-m-marker' },
  { label: 'marker-stroked', url: 'pin-m-marker-stroked' },
  { label: 'cemetery', url: 'pin-m-cemetery' },
  { label: 'rocket', url: 'pin-m-rocket' },
  { label: 'airport', url: 'pin-m-airport' },
  { label: 'heliport', url: 'pin-m-heliport' },
  { label: 'rail', url: 'pin-m-rail' },
  { label: 'rail-metro', url: 'pin-m-rail-metro' },
  { label: 'bus', url: 'pin-m-bus' },
  { label: 'fuel', url: 'pin-m-fuel' },
  { label: 'parking', url: 'pin-m-parking' },
  { label: 'parking-garage', url: 'pin-m-parking-garage' },
  { label: 'airfield', url: 'pin-m-airfield' },
  { label: 'roadblock', url: 'pin-m-roadblock' },
  { label: 'harbor', url: 'pin-m-harbor' },

]

export const SYMBOL_SIZE_LIST = [
  { label: 'large', value: 'pin-l', size: [25, 58] },
  { label: 'medium', value: 'pin-m', size: [20, 46.5] },
  { label: 'small', value: 'pin-s', size: [15, 37.5] },
]

export const genMarkerIcon = (symbol: string, size: string, color: string) => {
  const symbolSize = SYMBOL_SIZE_LIST.find(i => (i.label === size))
  const iconSize = symbolSize?.size ? symbolSize?.size : [20, 46.5]
  const colorCode = (color && color.startsWith('#')) ? color.replace('#', '') : color
  const iconUrl = `${ ASSET_URL }/${ symbolSize?.value ? symbolSize?.value : 'pin-m' }${symbol ? '-'+ symbol : '' }+${colorCode ? colorCode: '7e7e7e'}.png?access_token=${TOKEN}`
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: L.point(iconSize[0], iconSize[1]),
  })
  return icon
}