import {
  round,
  area as getArea,
  length as getLength,
  center as getCenter
} from '@turf/turf'
import { Feature } from 'geojson'

export default function measure(feature: Feature) {
  switch (feature.geometry.type) {
    case 'Polygon':
    case 'MultiPolygon': {
      const areaSqMeters = getArea(feature)
      return {
        'Sq. Meters': round(areaSqMeters, 2),
        'Sq. Kilometers': round(areaSqMeters / 1000 / 1000, 2),
        Acres: round(areaSqMeters / 666.666666667, 2),
        'Sq. Feet': round(areaSqMeters * 10.7639, 2),
        'Sq. Miles': round(areaSqMeters / 2589988.11034, 2)
      }
    }
    case 'LineString':
    case 'MultiLineString': {
      const lengthKiloMeters = getLength(feature)
      return {
        Meters: round(lengthKiloMeters * 1000, 2),
        Kilometers: round(lengthKiloMeters, 2),
        Feet: round(lengthKiloMeters * 3280.84),
        Yards: round(lengthKiloMeters * 1093.61, 2),
        Miles: round(lengthKiloMeters * 0.6213712, 2)
      }
    }
    case 'Point':
    case 'MultiPoint': {
      const center = getCenter(feature.geometry)
      return {
        Longitude: round(center.geometry.coordinates[0], 4),
        Latitude: round(center.geometry.coordinates[1], 4)
      }
    }
    default:
      return {}
  }
}
