import * as vscode from 'vscode'
import Ajv from "ajv"
import schema from './schema.json'

export function validate(geojsonStr: string): boolean {
   vscode.window.showInformationMessage('validate xxx', schema)
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
    throw Error(error)
  }
   vscode.window.showInformationMessage('validate ytyyy', geojsonStr)

}