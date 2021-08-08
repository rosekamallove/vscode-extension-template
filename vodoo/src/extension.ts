import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vodoo-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      const item = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right
      );
      item.text = "$(add) Add Todo";
      item.show();
      item.command = "vodoo.addTodo";
      if (!activeTextEditor) {
        vscode.window.showErrorMessage("Nothing selected from the editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      if (!text) {
        vscode.window.showErrorMessage("Nothing selected from the editor");
        return;
      }
      sidebarProvider._view?.webview.postMessage({
        type: "add-todo",
        value: text,
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.refresh", async () => {
      //HelloWorldPanel.kill();
      //HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vodoo-sidebar"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
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
        console.log("sorry to hear that");
      } else {
        console.log(answer);
      }
    })
  );
}

export function deactivate() {}
