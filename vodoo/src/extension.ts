import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";

/**
 * To Run the extension, press F5
 *
 * If you update the file,
 * reload the extension window.
 * (from the command pallete)
 */

export function activate(context: vscode.ExtensionContext) {
  /*************************
   *   @Example_Command    *
   *************************/
  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.askQuestion", async () => {
      /**
       * Remeber to add command in `package.json`,
       * @activatinEvents and @commonds
       *
       * * Example:
       * "activationEvents":[
       *    "onCommand":"vodoo.askQuestion"
       *  ]
       *  "commands":[{
       *    "command":"vodoo.askQuestion",
       *    "title":"Ask a question"
       *  }]
       */
      const answer = await vscode.window.showInformationMessage(
        "how was your day?",
        "good",
        "bad",
        "meh"
      );
      if (answer === "bad") {
        /* These are shown in the Debug Console */
        console.log("sorry to hear that");
      } else {
        console.log(answer);
      }
    })
  );

  TokenManager.globalState = context.globalState;

  console.log("Token is:" + TokenManager.getToken());

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  /* Creates the Todo Sidebar View (typical extension view) */
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vodoo-sidebar", sidebarProvider)
  );

  /* Creates the Todo Sidebar View (typical extension view) */
  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.authenticate", () => {
      try {
        authenticate(() => {});
      } catch (err) {
        console.log(err);
      }
    })
  );

  /* Creating a Icon on the bottom bar */
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(add) Add Todo";
  item.show();
  item.command = "vodoo.addTodo";

  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.addTodo", () => {
      /**
       *  => Adding Todos form the Selected Text from active editor
       */
      const { activeTextEditor } = vscode.window;
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
      /* Creates a Hello World Editor View (Looks like the editor) */
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vodoo.refresh", async () => {
      /**
       * @refresh useful_for_debugging
       */
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vodoo-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}

export function deactivate() {}
