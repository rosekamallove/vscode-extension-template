import * as _vscode from "vscode";
const tvscode = _vscode;

declare global {
  const tsvscode: {
    postMessage: ({ type: string, value: any }) => void;
  };
  const apiBaseUrl: string;
}
