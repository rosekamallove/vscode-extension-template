<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "hello from svelte",
    });
  }}>Click Me</button
>
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "hello from svelte",
    });
  }}>Show Error</button
>
