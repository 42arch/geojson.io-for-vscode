import { readFile } from 'fs'
import * as vscode from 'vscode'
import { ViewLoader } from './view/ViewLoader'

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('geojson-io-for-vscode.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vscode_preview!')
	})

	context.subscriptions.push(disposable)

	let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.openWebview', (uri) => {
		ViewLoader.showWebview(context)
		if(uri.path) {
			readFile(uri._fsPath, (err, data) => {
				const dataStr = data.toString()
				ViewLoader.postMessageToWebview(dataStr)
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
