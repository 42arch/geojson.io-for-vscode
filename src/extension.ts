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
  let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.openMap', (uri) => {
    if(uri.path) {
      readFile(uri._fsPath, (err, data) => {
        const dataStr = data.toString()
        if (geojsonTest(dataStr)) {
          ViewLoader.showWebview(context)
          ViewLoader.postMessageToWebview(dataStr)
        } else {
          vscode.window.showErrorMessage('Oops! the data you opened is not geojson format. ')
        }
      })
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
