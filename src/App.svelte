<script lang="ts">
  import Svelexical from './lib/lexical/Svelexical.svelte'
  import type { FormattedStyle } from './lib/lexical/plugin/toolbar/formatter';

  let formattedStyle: FormattedStyle | undefined = $state();
  let head = $derived(formattedStyle?.head ?? undefined);

  // let h1 = $derived(formattedStyle?.head);

</script>

<Svelexical bind:currentStyle={formattedStyle} />


<style>

</style>
