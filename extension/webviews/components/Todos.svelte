<script lang="ts">
  export let user: {
    name: string;
    id: string;
    todos: [{ completed: boolean; text: string }];
  };
  export let accessToken = "";
  let todos: Array<{ text: string; completed: boolean }> = ([] =
    user.todos.reverse());
  let text = "";

  async function addTodo(txt: string) {
    if (!txt) return;
    const response = await fetch(`${apiBaseUrl}/todo`, {
      method: "POST",
      body: JSON.stringify({
        text: txt,
        completed: false,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const { todo } = await response.json();
    todos = [todo, ...todos];
  }

  async function updateTodo(txt: string) {
    if (!txt) return;
    const response = await fetch(`${apiBaseUrl}/todo-update`, {
      method: "PUT",
      body: JSON.stringify({
        text: txt,
        completed: true,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const { todo } = await response.json();
    todos = [todo, ...todos];
  }

  window.addEventListener("message", async (e) => {
    const message = e.data;
    switch (message.type) {
      case "add-todo":
        addTodo(message.value);
    }
  });
</script>

<main>
  <div class="greeting">Hello: {user.name}</div>
  <form
    on:submit|preventDefault={async () => {
      addTodo(text);
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
          updateTodo(text);
          todo.completed = !todo.completed;
        }}
      >
        {todo.text}
      </li>
    {/each}
  </ul>
</main>

<style>
  .greeting {
    padding: 5px;
  }
  .complete {
    text-decoration: line-through;
  }
  input[type="text"] {
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }
  ul {
    list-style: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 5px;
    margin: 10px;
    margin-right: 20px;
    border-radius: 5px;
    transition: 0.3s;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }
  li:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }
</style>
