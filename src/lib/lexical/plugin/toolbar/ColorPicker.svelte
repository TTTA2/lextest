<script lang="ts">

    let {
        currentColor = "", 
        onChangeColor = undefined
    } : 
    { currentColor?: string, onChangeColor?: (color: string) => void } = $props();

    let isOpen = $state(false);
    let button: HTMLElement | undefined = $state();
    let rect: DOMRect = $state(new DOMRect());

    let usedColorList: string[] = $state(JSON.parse(window.localStorage.getItem("colors") ?? "[]"));

    let mouseDownColor: string = "";

    const handleClick = (e: MouseEvent ) => {

        if (!button) return;

        //イベント停止
        e.preventDefault();
        e.stopPropagation();

        rect = button.getBoundingClientRect();

        console.log(rect);

        isOpen = true;

        document.addEventListener("mousedown", outClick);
    }

    const outClick = (e: any) => {

        if (e.target.closest("color-picker") == undefined) {            
            isOpen = false;
            document.removeEventListener("mousedown", outClick);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    const handleClickBackground = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        isOpen = false;
    }

    const handleMouseDown = (e: any, color: string) => {
        e.preventDefault();
        e.stopPropagation();
        mouseDownColor = color;
    }

    const handleMouseUp = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        handleChangePickColor(mouseDownColor);
    }

    const handleChangePickColor = (color: string) => {

        isOpen = false;
        document.removeEventListener("mousedown", outClick);

        const colors = [...usedColorList];
        const index = colors.findIndex(c => color == c);

        if (index > -1) colors.splice(index, 1);

        colors.unshift(color);
        if (colors.length > 100) colors.pop();

        usedColorList = colors;

        window.localStorage.setItem("colors", JSON.stringify(usedColorList));

        onChangeColor?.call(undefined, color);
    }

</script>

<style>

    :root {
        --tileSize: 24px;
    }


    color-picker {
        position: absolute;
        width: fit-content;
        height: fit-content;
        
        padding: 8px;
        background-color: white;
        z-index: 2;
        border: 1px solid gray;
    }

    current-colorbox {
        display: block;
        width: 32px;
        height: 16px;
    }

    color-tile {
        display: block;
        width: calc(var(--tileSize) - 4px);
        height: calc(var(--tileSize) - 4px);
        outline: none;
        border: 2px solid currentColor;
    }

    color-tile.select {
        border: solid 2px orange;
    }

    color-tile:hover {
        border: solid 2px orange;
    }

    box-caption {
        display: block;
        color: rgb(36, 36, 36);
        font-weight: bold;
        /* background-color: lightgray; */
    }

    flex-box {
        /* display: flex; */
        /* gap: 2px; */
    }

    flex-list {

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        /* display: grid; */
        /* grid-template-columns: repeat(auto-fill, minmax(15px, 1fr)); */


        /* display: flex; */
        /* flex-direction: column; */
        /* gap: 0px; */
              
        max-width: calc(var(--tileSize) * 10);
        min-width: calc(var(--tileSize) * 10);
        
        max-height: calc(var(--tileSize) * 10);
        min-height: calc(var(--tileSize) * 10);

        border: lightgray solid 1px;
    }

    .hidden {
        display: none;
    }

</style>

{#snippet colorTile(color: string)}
    <color-tile
    tabindex=0
    aria-label="Back"
    role="button"
    onmousedown={(e: any) => handleMouseDown(e, color)} 
    onmouseup={handleMouseUp} 
    class:select={color == currentColor}
    style="color: {color}; background-color: {color};"></color-tile>
{/snippet}

{#snippet colorList(colors: string[])}
    <flex-list>
        {#each colors as color}
            {@render colorTile(color)}
        {/each}
    </flex-list>
{/snippet}

<button tabindex=0 aria-label="Back" bind:this={button} onclick={handleClick}>
    <current-colorbox style="background-color: {currentColor}"></current-colorbox>
</button>

<color-picker style="top: {(rect.top + rect.height)}px; left:{rect.left}px;" class:hidden={!isOpen}>

    <box-caption>最近使用した色</box-caption>

    <flex-box>
        {@render colorList(usedColorList)}
    </flex-box>

    <hr>

    <box-caption>その他の色</box-caption>
    <input type="color" value={currentColor} onchange={(e) => handleChangePickColor(e.currentTarget.value)} >

</color-picker>


