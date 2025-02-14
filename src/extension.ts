import {
  ExtensionContext,
  TextDocument,
  commands,
  window,
  workspace
} from 'vscode'
import gjv from 'geojson-validation'
import ViewPanel from './view-panel'

function isValidGeojsonText(text: string) {
  try {
    const parsed = JSON.parse(text)
    return gjv.valid(parsed)
  } catch {
    return false
  }
}

export function activate(context: ExtensionContext) {
  const openMapView = commands.registerCommand(
    'geojson-io.preview-geojson',
    () => {
      try {
        const editor = window.activeTextEditor
        if (editor) {
          const text = editor.document.getText()

          if (!text || isValidGeojsonText(text)) {
            ViewPanel.open(context)
            ViewPanel.postMessageToWebview(text)
          } else {
            window.showWarningMessage(
              "🌏 The data you're trying to preview is not a valid GeoJSON."
            )
          }
        } else {
          window.showWarningMessage(
            '🌏 You should open your geojson file in the editor!'
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
