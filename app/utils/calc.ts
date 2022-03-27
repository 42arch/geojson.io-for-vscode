import getArea from '@turf/area'
import getLength from '@turf/length'
import getCenter from '@turf/center'
import { round } from '@turf/helpers'
import { Feature } from "geojson"

export default function calcFeature(feature: Feature) {
  switch (feature.geometry.type) {
    case 'Polygon':
    case 'MultiPolygon':
      const areaSqMeters = round(getArea(feature), 4)
      return {
        'Sq. Meters': areaSqMeters,
        'Sq. Kilometers': round(areaSqMeters / 1000 / 1000, 2),
        'Acres': round(areaSqMeters / 666.666666667, 2),
        'Sq. Miles': round(areaSqMeters / 2589988.11034, 2)
      }
    case 'LineString':
    case 'MultiLineString':
      const lengthKiloMeters = getLength(feature)
      return {
        'Meters': round(lengthKiloMeters * 1000, 2),
        'Kilometers': round(getLength(feature), 4),
        'Yards': round(lengthKiloMeters * 1093.6132983, 2),
        'Miles': round(lengthKiloMeters * 0.6213712, 2), 
      }

    case 'Point':
    case 'MultiPoint':
      const center = getCenter(feature.geometry)
      return {
        'Longitude': center.geometry.coordinates[0],
        'Latitude': center.geometry.coordinates[1]
      }
    default:
      return {}
  }
}
