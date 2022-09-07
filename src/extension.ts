import { readFile } from 'fs'
import * as vscode from 'vscode'
import { validate } from './utils/geojsonValidate'
import { ViewLoader } from './view/ViewLoader'

export function activate(context: vscode.ExtensionContext) {
  let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.openMap', (uri: vscode.Uri) => {
    try {
      const fileUri = uri || vscode.window.activeTextEditor.document.uri
      if(fileUri.fsPath) {
        readFile(fileUri.fsPath, (err, data) => {
          const s = data.toString()
          if (validate(s)) {
            ViewLoader.showWebview(context)
            ViewLoader.postMessageToWebview(s)
          } else {
            vscode.window.showErrorMessage('Oops! the data you trying to view is not correct feature-collection type, please check it again!')
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

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      ViewLoader.postMessageToWebview(document.getText())
    })
  )
}

export function deactivate() {}
