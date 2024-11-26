<script lang="ts">
  
  import type { FormatStyle } from "./lib/lexical/plugin/formatter/formatterUtil";
  import Svelexical from "./lib/lexical/Svelexical.svelte";

  let formattedStyle: FormatStyle | undefined = $state();
  let head = $derived(formattedStyle?.head ?? undefined);

  // let h1 = $derived(formattedStyle?.head);
</script>

<Svelexical></Svelexical>

<style>
</style>
