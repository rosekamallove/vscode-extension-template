import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorldPanel";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vodoo" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand("vodoo.helloWorld", () => {
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("vodoo.askQuestion", async () => {
			const answer = await vscode.window.showInformationMessage(
				"how was your day?",
				"good",
				"bad",
				"meh"
			);
			if (answer === "bad") {
				console.log('sorry to hear that')
			} else {
				console.log(answer)
			}
		})
	);
}

export function deactivate() { }
