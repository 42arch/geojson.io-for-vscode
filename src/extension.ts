import { readFile } from 'fs'
import * as vscode from 'vscode'
import { ViewLoader } from './view/ViewLoader'

function geojsonTest(geojsonStr: string) {
  try {
    if(geojsonStr === '') {
      return true
    }
    let geojsonObj = JSON.parse(geojsonStr)
    if (geojsonObj.type && geojsonObj.type === "FeatureCollection" && geojsonObj.features && Array.isArray(geojsonObj.features)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export function activate(context: vscode.ExtensionContext) {
  let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.openMap', (uri: vscode.Uri) => {
    try {
      const fileUri = uri || vscode.window.activeTextEditor.document.uri
      if(fileUri.fsPath) {
        readFile(fileUri.fsPath, (err, data) => {
          const s = data.toString()
          if (geojsonTest(s)) {
            ViewLoader.showWebview(context)
            ViewLoader.postMessageToWebview(s)
          } else {
            vscode.window.showErrorMessage('Oops! the data you trying to view is not geojson format.')
          }
        })
      } else {
        vscode.window.showErrorMessage('No geojson file to view!')
      }
    } catch (error) {
      vscode.window.showErrorMessage("geojson.io can't recognize this file!")
    }
  })
  context.subscriptions.push(openWebview)

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      ViewLoader.postMessageToWebview(document.getText())
    })
  )
}

export function deactivate() {}
