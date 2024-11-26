<script lang="ts">
    import type { FormatStyle, Header } from "../formatter/formatterUtil";

    let { formatStyle, onChangeFormat } : 
        { formatStyle: FormatStyle, onChangeFormat?: (newFormat: FormatStyle) => void} = $props();

    const handleChange = (headTag: Header | undefined) => {
        onChangeFormat?.call(undefined,  { ...formatStyle, head: headTag });
    }

    const getHeaderTag = (headerTag: string): Header | undefined => {

        if (headerTag == "h1" || 
            headerTag == "h2" || 
            headerTag == "h3" || 
            headerTag == "h4" ||
            headerTag == "h5" ||
            headerTag == "h6") return headerTag;

        return undefined;
    }
    
</script>

<div class="flex">

    <select value={formatStyle.head} onchange={(e) => handleChange(getHeaderTag(e.currentTarget.value))}>
        <option value="">なし</option>
        <option value="h1">見出し1</option>
        <option value="h2">見出し2</option>
        <option value="h3">見出し3</option>
        <option value="h4">見出し4</option>
        <option value="h5">見出し5</option>
        <option value="h6">見出し6</option>
    </select>

    <hr>

    

</div>

<style>

    .flex {
        display: flex;
    }

</style>