import Ajv from "ajv"
import schema from './schema.json'

export function validate(geojsonStr: string) {
  // allow empty string
  if(geojsonStr === '') {
    return true
  }
  try {
    let geojson = JSON.parse(geojsonStr)
    const ajv = new Ajv()
    const isValid = ajv.compile(schema)
    const res = isValid(geojson)
    return res
  } catch (error) {
    return false
  }
}