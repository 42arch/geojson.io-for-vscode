import * as path from 'path'
import {
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
  Disposable,
  Range,
  workspace
} from 'vscode'

type Message = {
  type: 'error' | 'info' | 'warning' | 'data'
  data: string
}

export default class ViewPanel {
  private static instance: ViewPanel | undefined
  public panel: WebviewPanel
  private context: ExtensionContext
  private disposables: Disposable[]

  private constructor(context: ExtensionContext) {
    this.context = context
    this.disposables = []
    this.panel = window.createWebviewPanel(
      'map-view',
      'Map View',
      ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          Uri.file(path.join(this.context.extensionPath, 'out', 'view'))
        ]
      }
    )

    this.render()

    this.panel.webview.onDidReceiveMessage(
      (message: Message) => {
        switch (message.type) {
          case 'data':
            this.replaceTextContent(message.data)
            break
          case 'error':
            window.showErrorMessage(message.data)
            break
          case 'warning':
            window.showWarningMessage(message.data)
            break
          default:
            break
        }
      },
      null,
      this.disposables
    )

    this.panel.onDidDispose(
      () => {
        this.dispose()
      },
      null,
      this.disposables
    )
  }

  public dispose() {
    ViewPanel.instance = undefined
    while (this.disposables.length) {
      const x = this.disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }

  public static getInstance(context: ExtensionContext) {
    if (!ViewPanel.instance) {
      ViewPanel.instance = new ViewPanel(context)
    }

    return ViewPanel.instance
  }

  public static open(context: ExtensionContext) {
    const instance = ViewPanel.getInstance(context)

    // const column = window.activeTextEditor
    //   ? window.activeTextEditor.viewColumn
    //   : undefined
    if (instance.panel) {
      instance.panel.reveal()
    }
  }

  static postMessageToWebview(message: string) {
    const instance = ViewPanel.instance
    if (instance) {
      instance.panel.webview.postMessage(message)
    }
    // const instance = ViewPanel.getInstance(context)
    // ctx.currentPanel?.webview.postMessage(message)
  }

  private render() {
    const bundleScriptPath = this.panel.webview.asWebviewUri(
      Uri.file(
        path.join(this.context.extensionPath, 'out', 'view', 'bundle.js')
      )
    )
    const stylePath = this.panel.webview.asWebviewUri(
      Uri.file(
        path.join(
          this.context.extensionPath,
          'out',
          'view',
          'assets',
          'style.css'
        )
      )
    )

    const html = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Map App</title>
          <link rel="stylesheet" crossorigin href="${stylePath}">
        </head>

        <body>
          <div id="root"></div>
          <script>
            const vscode = acquireVsCodeApi();
          </script>
          <script src="${bundleScriptPath}"></script>
        </body>
      </html>
    `
    this.panel.webview.html = html
  }

  private formatJSONString(textContent: string) {
    const config = workspace.getConfiguration()
    const tabSize = Number(config.get('editor.tabSize')) || 2
    return JSON.stringify(JSON.parse(textContent), null, tabSize)
  }

  private replaceTextContent(textContent: string) {
    const textEditor = window.visibleTextEditors[0]
    if (!textEditor) {
      return
    }
    const firstLine = textEditor.document.lineAt(0)
    const lastLine = textEditor.document.lineAt(
      textEditor.document.lineCount - 1
    )
    const textRange = new Range(
      0,
      firstLine.range.start.character,
      textEditor.document.lineCount - 1,
      lastLine.range.end.character
    )

    textEditor.edit((editBuilder) => {
      editBuilder.replace(textRange, this.formatJSONString(textContent))
    })
  }
}
