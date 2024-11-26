<script lang="ts">

    import type { LexicalEditor } from "lexical";
    import Formatter from "./plugin/formatter/Formatter.svelte";
    import {
        defaultStyle,
        type FormatStyle,
    } from "./plugin/formatter/formatterUtil";
    import SvelexicalCore from "./SvelexicalCore.svelte";
    import ToolBar from "./plugin/toolbar/ToolBar.svelte";

    let f: FormatStyle = $state(defaultStyle);

    let applyFormat: ((newformat: FormatStyle) => void) | undefined = $state();

    const handleChangeFormat = (newformat: FormatStyle) => {
        applyFormat?.call(undefined, newformat);
        // f = {...newformat};
    }

    $inspect(f);

</script>


<lex-split>

    <!-- <div> -->
        <!-- {f.bold} -->

    <!-- </div> -->

    <ToolBar formatStyle={f} onChangeFormat={handleChangeFormat}></ToolBar>

    <SvelexicalCore>
        <Formatter bind:formatStyle={f} bind:napplyFormat={applyFormat}></Formatter>
    </SvelexicalCore>


    <!-- <lex-state> -->
        <!-- {html} -->
        <!-- <button onclick={() => test()}>へんかん</button> -->
    <!-- </lex-state> -->

<!-- <lex-state>{JSON.stringify(state?.toJSON(), undefined, 2) ?? ""}</lex-state> -->
</lex-split>

<style>
    
	lex-split {
		display: grid;
        grid-template-rows: auto 1fr;
		/* grid-template-rows: auto 0.5fr 0.5fr; */
		width: 100%;
		height: 100%;
	}

	lex-state {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

</style>