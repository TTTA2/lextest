<script lang="ts">
    import {     
        $getSelection as getSelection, 
        $isRangeSelection as isRangeSelection, 
        CAN_REDO_COMMAND,
        CAN_UNDO_COMMAND,
        FORMAT_ELEMENT_COMMAND,
        FORMAT_TEXT_COMMAND,
        REDO_COMMAND,
        SELECTION_CHANGE_COMMAND,
        UNDO_COMMAND,
        type EditorState, 
        type LexicalEditor,
        ElementNode,
        $createParagraphNode as createParagraphNode,
    } from "lexical";

    import {
        $setBlocksType as setBlocksType,
        $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
        $patchStyleText as patchStyleText,
    } from "@lexical/selection";
    
    import {
        $isHeadingNode as isHeadingNode,
        $createHeadingNode as createHeadingNode,
        HeadingNode,
        QuoteNode,
        registerRichText,
        type HeadingTagType,
    } from "@lexical/rich-text";

    import { mergeRegister } from "@lexical/utils";

    import { onMount, type Snippet } from "svelte";
    import ColorPicker from "./ColorPicker.svelte";
    import type { FormatStyle, Style } from "../formatter/formatterUtil";

    let { editor, h1, onChange, registerToolbar = $bindable(), children }: 
    {
        editor: LexicalEditor, 
        h1?: boolean, 
        onChange?: (formattedStyle: FormatStyle) => void,
        registerToolbar?: ((editor: LexicalEditor, onUpdateFormat: (style: FormatStyle) => void) => void) | undefined,

        children?: Snippet<[FormatStyle]>,

    } = $props();

    let formattedStyle: FormatStyle = $state({
        head: undefined,
        bold: false,
        italic: false,
        strikethrough: false,
        color: "#000",
    });

    onMount(() => {
        mergeRegister(registerFormatter(editor, handleUpdateFormat));        
    });

    function handleChange(newFormattedStyle: FormatStyle, style?: Style | undefined) {

        editor.update(() => {

            const selection = getSelection();

            if (isRangeSelection(selection)) {

                if (formattedStyle.head != newFormattedStyle.head && !newFormattedStyle.head) {
                    setBlocksType(selection, () => createParagraphNode());
                }
                else if (formattedStyle.head != newFormattedStyle.head && newFormattedStyle.head) {
                    const headdingTag: HeadingTagType = newFormattedStyle.head;
                    setBlocksType(selection, () => createHeadingNode(headdingTag));
                }

                if (newFormattedStyle.bold != formattedStyle.bold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                if (newFormattedStyle.italic != formattedStyle.italic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                if (newFormattedStyle.strikethrough != formattedStyle.strikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');

                if (newFormattedStyle.color != formattedStyle.color) {
                    patchStyleText(selection, {
                        "color": newFormattedStyle.color,
                    });
                }

            }
        });

    }

    const updateEditor = (editor: LexicalEditor, newState: EditorState, onUpdateFormat: (style: FormatStyle) => void) => {

        editor.read(() => {

            const selection = getSelection();

            if (!isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const targetNode = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

            const currentHeader = isHeadingNode(targetNode) ? targetNode.getTag() : undefined;
            const bold = selection.hasFormat("bold");
            const italic = selection.hasFormat("italic");
            const strikethrough = selection.hasFormat("strikethrough");

            const color = getSelectionStyleValueForProperty(selection, "color", "#000")

            console.log(bold, italic);

            onUpdateFormat({  bold, italic, strikethrough, head: currentHeader, color });
        })
    }

    const handleUpdateFormat = (style: FormatStyle) => {
        formattedStyle = { ...style };
    }

    export function registerFormatter(editor: LexicalEditor, onUpdateFormat: (style: FormatStyle) => void): () => void {
        editor.registerUpdateListener(({ editorState }) => updateEditor(editor, editorState, onUpdateFormat));
        return () => { }
    }

</script>

<div role="none" onmousedown={(e) => e.preventDefault()}>
 
    {@render children?.(formattedStyle)}

    <button onclick={(e) => handleChange({ ...formattedStyle, head: formattedStyle.head == "h1" ? undefined : "h1" }) }>H1</button>
    <button onclick={(e) => handleChange({ ...formattedStyle, head: formattedStyle.head == "h2" ? undefined : "h2" }) }>H2</button>
    <button onclick={(e) => handleChange({ ...formattedStyle, head: formattedStyle.head == "h3" ? undefined : "h3" }) }>H3</button>

    <button onclick={(e) => handleChange({ ...formattedStyle, bold: !formattedStyle.bold })}>BOLD</button>
    <button onclick={(e) => handleChange({ ...formattedStyle, italic: !formattedStyle.italic })}>ITALIC</button>
    <button onclick={(e) => handleChange({ ...formattedStyle, strikethrough: !formattedStyle.strikethrough })}>STRIKETHROUGH</button>

    <ColorPicker currentColor={formattedStyle.color} onChangeColor={(color: string) => handleChange({...formattedStyle, color })}></ColorPicker>
    <!-- <button on:click={(e) => handleChange({ ...formattedStyle, color: "#FF0000" })}>COLOR!</button> -->

    <label>{formattedStyle.color}</label>

    <!-- <label>
        <input type="checkbox" checked={h1} value={h1} on:change={(e) => handleChange("h1", { ...formattedStyle, head: (e.currentTarget.checked ? "h1" : "") }) }>
        H1
    </label> -->

</div>