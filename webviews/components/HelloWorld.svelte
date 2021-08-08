<script lang="ts">
  var name = "Rose";
  var count = 0;
</script>

<main>
  <h1>Hello {name}</h1>
  <input bind:value={name} />
  <button
    on:click={() => {
      count = count + 1;
    }}>Clicks: {count}</button
  >
</main>
