import { readFile, promises as fs } from 'fs'
import * as vscode from 'vscode'
import { ViewLoader } from './view/ViewLoader'

function geojsonTest(geojsonStr: string) {
  try {
    if (geojsonStr === '') {
      return true
    }
    const geojsonObj = JSON.parse(geojsonStr)
    if (
      geojsonObj.type &&
      geojsonObj.type === 'FeatureCollection' &&
      geojsonObj.features &&
      Array.isArray(geojsonObj.features)
    ) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const openWebview = vscode.commands.registerCommand(
    'geojson-io-for-vscode.viewOnMap',
    (uri: vscode.Uri) => {
      try {
        const fileUri = uri || vscode.window.activeTextEditor.document.uri
        if (fileUri.fsPath) {
          readFile(fileUri.fsPath, (err, data) => {
            const s = data.toString()
            if (geojsonTest(s)) {
              ViewLoader.showWebview(context)
              ViewLoader.postMessageToWebview(s)
            } else {
              vscode.window.showErrorMessage(
                'Oops! The data you trying to view is not standard feature-collection type, please check it again!'
              )
            }
          })
        } else {
          vscode.window.showErrorMessage('No geojson file to view!')
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "The extension can't recognize this file!"
        )
      }
    }
  )
  context.subscriptions.push(openWebview)

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      ViewLoader.postMessageToWebview(document.getText())
    })
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
