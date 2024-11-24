<script lang="ts">

    let {
        currentColor = "", 
        onChangeColor = undefined
    } : 
    { currentColor?: string, onChangeColor?: (color: string) => void } = $props();

    let isOpen = $state(false);
    let button: HTMLElement | undefined = $state();
    let rect: DOMRect = $state(new DOMRect());

    let usedColorList: string[] = $state([]);

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
        onChangeColor?.call(undefined, color);
    }

</script>

<style>

    color-picker {
        position: absolute;
        width: fit-content;
        height: fit-content;
        padding: 8px;
        /* width: 64px; */
        /* height: 64px; */
        z-index: 2;
        border: 2px solid gray;
    }

    current-colorbox {
        display: block;
        width: 32px;
        height: 16px;
    }

    color-tile {
        display: block;
        width: 12px;
        height: 12px;
        outline: none;
        border: 2px solid currentColor;
    }

    color-tile:hover {
        border: solid 2px orange;
    }

    flex-box {
        display: flex;
        gap: 2px;
    }

    flex-list {
        display: flex;
        flex-direction: column;
        gap: 0px;
        border: lightgray solid 1px;
    }

    .hidden {
        display: none;
    }

    color-picker-background {
        overflow: hidden;
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: rgba(128, 128, 128, 0.5);
        top: 0;
        left: 0;    
    }

</style>

{#snippet colorTile(color: string)}
    <color-tile
    tabindex=0
    aria-label="Back"
    role="button"
    onmousedown={(e: any) => handleMouseDown(e, color)} 
    onmouseup={handleMouseUp} 
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

    <flex-box>
        {@render colorList(["#F1CEEE", "#E49EDD", "#D76DCC", "#78206E", "#501549"])}
    </flex-box>

    <input type="color" value={currentColor} onchange={(e) => handleChangePickColor(e.currentTarget.value)} >

</color-picker>


