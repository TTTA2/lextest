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
    import { defaultStyle, getFormatStyleFromSelection, type FormatStyle } from "./formatterUtil";
    import { getContext, onMount } from "svelte";

    const editor: LexicalEditor = getContext("editor");

    let { formatStyle = $bindable(defaultStyle), napplyFormat = $bindable() }: 
    {
        formatStyle?: FormatStyle,
        napplyFormat?: (newFormatStyle: FormatStyle) => void,

    } = $props();

    export function registerFormatter(editor: LexicalEditor, onUpdateFormat: (style: FormatStyle) => void): () => void {
        editor.registerUpdateListener(({ editorState }) => updateEditor(editor, editorState, onUpdateFormat));
        return () => { }
    }

    // $inspect(formatStyle);

    const updateEditor = (editor: LexicalEditor, newState: EditorState, onUpdateFormat: (style: FormatStyle) => void) => {

        editor.read(() => {

            const selection = getSelection();

            if (!isRangeSelection(selection)) return;

            const currentFormatStyle = getFormatStyleFromSelection(selection);

            onUpdateFormat(currentFormatStyle); 
        });
    }

    const applyFormat = (newFormatStyle: FormatStyle) => {

        editor.update(() => {

            const selection = getSelection();

            if (isRangeSelection(selection)) {

                if (!newFormatStyle.head) {
                    setBlocksType(selection, () => createParagraphNode());
                }
                else if (newFormatStyle.head) {
                    const headdingTag: HeadingTagType = newFormatStyle.head;
                    setBlocksType(selection, () => createHeadingNode(headdingTag));
                }

                if (formatStyle.bold != newFormatStyle.bold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                if (formatStyle.italic != newFormatStyle.italic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                if (formatStyle.strikethrough != newFormatStyle.strikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');

                if (formatStyle.color != newFormatStyle.color) {
                    patchStyleText(selection, {
                        "color": newFormatStyle.color,
                    });
                }
            }
        });
    }

    onMount(() => {
        if (editor) mergeRegister(registerFormatter(editor, (style) => formatStyle = {...style}));
        napplyFormat = applyFormat;
    });



    // $effect(() => {

    //     editor.update(() => {

    //         const selection = getSelection();

    //         if (isRangeSelection(selection)) {

    //             if (formattedStyle.head != newFormattedStyle.head && !newFormattedStyle.head) {
    //                 setBlocksType(selection, () => createParagraphNode());
    //             }
    //             else if (formattedStyle.head != newFormattedStyle.head && newFormattedStyle.head) {
    //                 const headdingTag: HeadingTagType = newFormattedStyle.head;
    //                 setBlocksType(selection, () => createHeadingNode(headdingTag));
    //             }

    //             if (newFormattedStyle.bold != formattedStyle.bold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    //             if (newFormattedStyle.italic != formattedStyle.italic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    //             if (newFormattedStyle.strikethrough != formattedStyle.strikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');

    //             if (newFormattedStyle.color != formattedStyle.color) {
    //                 patchStyleText(selection, {
    //                     "color": newFormattedStyle.color,
    //                 });
    //             }
    //         });

    // });

</script>