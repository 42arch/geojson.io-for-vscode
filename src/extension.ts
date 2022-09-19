import { readFile } from 'fs'
import * as vscode from 'vscode'
import { validate } from './utils/geojsonValidate'
import { ViewLoader } from './view/ViewLoader'

export function activate(context: vscode.ExtensionContext) {
  let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.viewOnMap', (uri: vscode.Uri) => {
    try {
      const fileUri = uri || vscode.window.activeTextEditor.document.uri
      if(fileUri.fsPath) {
        readFile(fileUri.fsPath, (err, data) => {
          const s = data.toString()
          if (s) {
            ViewLoader.showWebview(context)
            ViewLoader.postMessageToWebview(s)
          } else {
            vscode.window.showErrorMessage('Oops! The data you trying to view is not standard feature-collection type, please check it again!')
          }
        })
      } else {
        vscode.window.showErrorMessage('No geojson file to view!')
      }
    } catch (error) {
      vscode.window.showErrorMessage("The extension can't recognize this file!")
    }
  })
  context.subscriptions.push(openWebview)

  let validateGeojson = vscode.commands.registerCommand('geojson-io-for-vscode.validate', (uri: vscode.Uri) => {
    try {
      const fileUri = uri || vscode.window.activeTextEditor.document.uri
      if(fileUri.fsPath) {
        readFile(fileUri.fsPath, (err, data) => {
          const s = data.toString()
          if (s) {
            vscode.window.showInformationMessage('The geojson format of Your data is standard, you can view it on map.')
          } else {
            vscode.window.showErrorMessage('The data you trying to view is not standard feature-collection type, please check it again!')
          }
        })
      } else {
        vscode.window.showErrorMessage('No geojson file to view!')
      }
    } catch (error) {
      vscode.window.showErrorMessage("The extension can't recognize this file!")
    }
  })
  
  context.subscriptions.push(validateGeojson)

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      ViewLoader.postMessageToWebview(document.getText())
    })
  )
}

export function deactivate() {}
