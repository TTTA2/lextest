import type {
    RangeSelection,
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    BaseSelection,
    EditorState,
    LexicalEditor
} from "lexical";

import {
    $isHeadingNode as isHeadingNode,
    HeadingNode,
    QuoteNode,
    registerRichText,
    type HeadingTagType,
} from "@lexical/rich-text";

import {
    $setBlocksType as setBlocksType,
    $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
    $patchStyleText as patchStyleText,
} from "@lexical/selection";


const defaultColor = "#000000";

export type Header = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type Style = Header | "bold" | "strike";

export type FormatStyle  = {
    head: Header | undefined,
    bold: boolean,
    italic: boolean,
    strikethrough: boolean,
    color: string,
}

export const defaultStyle: FormatStyle = {
    head: undefined,
    bold: false,
    italic: false,
    strikethrough: false,
    color: defaultColor,
};

export const getFormatStyleFromSelection = (selection: RangeSelection) => {

    const anchorNode = selection.anchor.getNode();
    const targetNode = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

    const head = isHeadingNode(targetNode) ? targetNode.getTag() : undefined;
    const bold = selection.hasFormat("bold");
    const italic = selection.hasFormat("italic");
    const strikethrough = selection.hasFormat("strikethrough");

    const color = getSelectionStyleValueForProperty(selection, "color");

    return {  bold, italic, strikethrough, head, color };

}

// const updateEditor = (editor: LexicalEditor, newState: EditorState, onUpdateFormat: (style: FormattedStyle) => void) => {

//     editor.read(() => {

//         const selection = getSelection();

//         if (!isRangeSelection(selection)) return;

//         const anchorNode = selection.anchor.getNode();
//         const targetNode = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

//         const currentHeader = isHeadingNode(targetNode) ? targetNode.getTag() : undefined;

//         onUpdateFormat({
//             head: currentHeader,
//         });
//     })
// }

// export function registerFormatter(editor: LexicalEditor, onUpdateFormat: (style: FormattedStyle) => void): () => void {

//     editor.registerUpdateListener(({ editorState }) => updateEditor(editor, editorState, onUpdateFormat));

//     return () => { }
// }