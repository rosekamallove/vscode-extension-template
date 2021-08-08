<script lang="ts">
  let count = 0;
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";
</script>

<main>
  <h1>Vodoo</h1>
  <form
    on:submit|preventDefault={() => {
      todos = [{ text, completed: false }, ...todos];
      text = "";
    }}
  >
    <input bind:value={text} />
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
</main>

<style>
  .complete {
    text-decoration: line-through;
  }
  input {
    background-color: gray;
  }
</style>
