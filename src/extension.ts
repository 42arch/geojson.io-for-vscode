import * as vscode from 'vscode'
import { ViewLoader } from './view/ViewLoader'

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('geojson-io-for-vscode.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vscode_preview!')
	})

	context.subscriptions.push(disposable)

	let openWebview = vscode.commands.registerCommand('geojson-io-for-vscode.openWebview', () => {
		ViewLoader.showWebview(context)
		ViewLoader.postMessageToWebview('x fgggg')

	})

	context.subscriptions.push(openWebview)
}

export function deactivate() {}
