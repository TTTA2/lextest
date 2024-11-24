import { 
    $getSelection as getSelection, 
    $isRangeSelection as isRangeSelection, 
    type EditorState,
    type LexicalEditor
} from "lexical";

import {
    $isHeadingNode as isHeadingNode,
    HeadingNode,
    QuoteNode,
    registerRichText,
    type HeadingTagType,
} from "@lexical/rich-text";

export type Header = "" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type FormattedStyle = {
    head: Header | undefined,
}

const updateEditor = (editor: LexicalEditor, newState: EditorState, onUpdateFormat: (style: FormattedStyle) => void) => {

    editor.read(() => {

        const selection = getSelection();

        if (!isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const targetNode = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        const currentHeader = isHeadingNode(targetNode) ? targetNode.getTag() : undefined;

        onUpdateFormat({
            head: currentHeader,
        });
    })
}

export function registerFormatter(editor: LexicalEditor, onUpdateFormat: (style: FormattedStyle) => void): () => void {

    editor.registerUpdateListener(({ editorState }) => updateEditor(editor, editorState, onUpdateFormat));

    return () => { }
}