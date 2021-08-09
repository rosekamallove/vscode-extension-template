import * as polka from "polka";
import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";

export const authenticate = () => {
  const app = polka();

  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<head><meta charset="UTF-8"></head>
                <h1 style="text-align:center;">
                  Something went wrong! ❌
                </h1>`);
      return;
    }
    console.log(token);
    res.end(`<head><meta charset="UTF-8"></head>
              <h1 style="text-align:center;">
                Auth was Sucessfull 🚀
              </h1>`);
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};
