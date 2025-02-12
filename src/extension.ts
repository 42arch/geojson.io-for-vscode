import {
  ExtensionContext,
  TextDocument,
  commands,
  window,
  workspace
} from 'vscode'
import ViewPanel from './view-panel'

export function activate(context: ExtensionContext) {
  const openMapView = commands.registerCommand(
    'geojson-io.preview-geojson',
    () => {
      try {
        const editor = window.activeTextEditor
        if (editor) {
          const text = editor.document.getText()
          ViewPanel.open(context)
          ViewPanel.postMessageToWebview(text)
        } else {
          window.showWarningMessage(
            '🌏 You should open your geojson file on the editor!'
          )
        }
      } catch (error) {
        window.showErrorMessage('🌏 Failed to preview this file! ' + error)
      }
    }
  )

  const saveGeojson = workspace.onDidSaveTextDocument(
    (document: TextDocument) => {
      const text = document.getText()
      ViewPanel.postMessageToWebview(text)
    }
  )

  context.subscriptions.push(openMapView)
  context.subscriptions.push(saveGeojson)
}

export function deactivate() {}
