(function () {
  const vscode = acquireVsCodeApi();

  const button = document.getElementById("button");
  button.addEventListener("click", () => {
    button.innerText = "Crap";
  });
})();
