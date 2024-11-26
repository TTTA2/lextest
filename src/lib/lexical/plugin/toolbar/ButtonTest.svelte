<script lang="ts">
    import type { FormatStyle } from "../formatter/formatterUtil";


let { formattedStyle }: { formattedStyle?: FormatStyle } = $props();



</script>

<div>
    {formattedStyle?.bold}
</div>