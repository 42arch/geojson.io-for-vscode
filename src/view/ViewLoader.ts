import * as vscode from "vscode"
import * as path from "path"

export class ViewLoader {
  public static currentPanel?: vscode.WebviewPanel

  private panel: vscode.WebviewPanel
  private context: vscode.ExtensionContext
  private disposables: vscode.Disposable[]

  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.disposables = []

    this.panel = vscode.window.createWebviewPanel('mapApp', 'Map View', vscode.ViewColumn.Beside, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))]
    })

    this.renderWebview()

    this.panel.webview.onDidReceiveMessage((message: string) => {
      this.replaceTextContent(message)
    }, null, this.disposables)

    this.panel.onDidDispose(() => {
      this.dispose()
    }, null, this.disposables)
  }

  private replaceTextContent(textContent: string) {
    const textEditor = vscode.window.visibleTextEditors[0]
    if(!textEditor) {
      return
    }
    const firstLine = textEditor.document.lineAt(0)
    const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1)
    const textRange = new vscode.Range(
      0, firstLine.range.start.character, textEditor.document.lineCount-1, lastLine.range.end.character
    )

    textEditor.edit((editBuilder) => {
      editBuilder.replace(textRange, this.formatJSONString(textContent))
    })
  }

  private formatJSONString(textContent: string) {
    return JSON.stringify(JSON.parse(textContent), null, 2)
  }

  private renderWebview() {
    const html = this.render()
    this.panel.webview.html = html
  }

  static showWebview(context: vscode.ExtensionContext) {
    const ctx = this
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
    if(ctx.currentPanel) {
      ctx.currentPanel.reveal(column)
    } else {
      ctx.currentPanel = new ctx(context).panel
    }
  }

  static postMessageToWebview(message: string) {
    const ctx = this
    ctx.currentPanel?.webview.postMessage(message)
  }

  public dispose() {
    ViewLoader.currentPanel = undefined
    while (this.disposables.length) {
      const x = this.disposables.pop()
      if(x) {
        x.dispose
      }
    }
  }

  render() {
    const bundleScriptPath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app', 'bundle.js'))
    )

    return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Map App</title>
          <script src="https://unpkg.com/esri-leaflet-vector@3.1.1/dist/esri-leaflet-vector.js" crossorigin=""></script>
        </head>

        <body>
          <div id="root"></div>
          <script>
            const vscode = acquireVsCodeApi();
          </script>
          <script>
            console.log('react app works')
          </script>
          <script src="${bundleScriptPath}"></script>
        </body>
      </html>
    `
  }
}