<script lang="ts">
  import { onMount } from "svelte";
  import Todos from "./Todos.svelte";

  let accessToken = "";
  let loading = true;
  let user: {
    name: string;
    id: string;
    todos: [{ completed: boolean; text: string }];
  } | null = null;

  onMount(() => {
    window.addEventListener("message", async (e) => {
      const message = e.data;
      switch (message.type) {
        case "token":
          accessToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          user = data.user;
          loading = false;
      }
    });
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

<main>
  <h1>Vodoo</h1>

  {#if loading}
    <div class="loading">Loading...</div>
  {:else if user}
    <Todos {user} {accessToken} />
    <button
      on:click={() => {
        (user = null), (accessToken = "");
        tsvscode.postMessage({ type: "logout", value: undefined });
      }}>Logout</button
    >
  {:else}
    <button
      on:click={() => {
        tsvscode.postMessage({ type: "authenticate", value: undefined });
      }}>Login with Github</button
    >
  {/if}
</main>

<style>
  button {
    border-radius: 5px;
    transition: 0.3s;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    margin-top: 10px;
  }
  button:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }
  .loading {
    padding: 5px;
  }
</style>
