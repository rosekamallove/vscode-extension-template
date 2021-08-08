<script lang="ts">
  let count = 0;
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";
</script>

<main>
  <h1>Vodoo</h1>
  <form
    on:submit|preventDefault={() => {
      if (text !== "") {
        todos = [{ text, completed: false }, ...todos];
      }
      text = "";
    }}
  >
    <input bind:value={text} type="text" />
  </form>

  <!-- Rendering the todos -->
  <ul>
    {#each todos as todo}
      <li
        class:complete={todo.completed}
        on:click={() => {
          todo.completed = !todo.completed;
        }}
      >
        {todo.text}
      </li>
    {/each}
  </ul>
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
</main>

<style>
  .complete {
    text-decoration: line-through;
  }
  input[type="text"] {
    background-color: #282c34;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }
  ul {
    list-style: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }
  li {
    background-color: #282c34;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    width: 100%;
    padding: 5px;
    margin: 10px;
    margin-right: 20px;
    border-radius: 5px;
    transition: 0.5s;
  }
  li:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  }
</style>
