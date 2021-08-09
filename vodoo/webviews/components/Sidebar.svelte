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
  {:else if !loading}
    {#if user != null}
      <Todos {user} />
      <button on:click={() => {}}>Logout</button>
    {/if}
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
    transition: 0.5s;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }
  .loading {
    padding: 5px;
  }
</style>
