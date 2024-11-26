<script lang="ts">
	import { 
		$getSelection as getSelection, 
		$isRangeSelection as isRangeSelection, 
		createEditor, 
		type EditorState,
        type LexicalEditor

	} from "lexical";

	import { theme } from "./editorTheme";

	import {
		$isHeadingNode as isHeadingNode,
		HeadingNode,
		QuoteNode,
		registerRichText,
        type HeadingTagType,
	} from "@lexical/rich-text";

	import { mergeRegister } from "@lexical/utils";
	import { registerDragonSupport } from "@lexical/dragon";
	import { createEmptyHistoryState, registerHistory } from "@lexical/history";
	import { $generateHtmlFromNodes as generateHtmlFromNodes } from "@lexical/html";

	import { onMount, setContext, type Snippet } from "svelte";
    import { type FormatStyle } from "./plugin/formatter/formatterUtil";
    import Toolbar from "./plugin/toolbar/__Toolbar.svelte";
    import ButtonTest from "./plugin/toolbar/ButtonTest.svelte";

	export const contextKeys = {
		editor: "editor",
	}

	type Props = {
		children?: Snippet,
		currentStyle?: FormatStyle | undefined,
	};

	let {
		children,
		currentStyle = $bindable(),
	}: Props = $props();

	const config = {
		namespace: "MyEditor",
		nodes: [HeadingNode, QuoteNode],
		onError: (error: Error) => {
			throw error;
		},
		theme,
	};

	let editorElement: any;

	let currentEditorState: EditorState | undefined = $state();
	let html: string = $state("");

	const editor = createEditor(config);

	const test = () => {

		currentEditorState?.read(() => (html = generateHtmlFromNodes(editor)));

		// const editorState = editor.parseEditorState(data)
		// currentEditorState.read(() =>   html = generateHtmlFromNodes(editor, null))
	};

	const handleUpdateFormat = (style: FormatStyle) => {
		console.log(style);
		currentStyle = style;
	}

	onMount(() => {

		editorElement = document.getElementsByTagName("lex-editor")[0];
		editor.setRootElement(editorElement);

		mergeRegister(
			registerRichText(editor),
			registerDragonSupport(editor),
			registerHistory(editor, createEmptyHistoryState(), 300),
		);

		editor.registerUpdateListener(({ editorState }) => updateEditor(editorState));
	});

	const updateEditor = (newState: EditorState) => {
		currentEditorState = newState;
	}

	const handleWrapperClick = () => {
		editor.focus();
	};

	setContext(contextKeys.editor, editor);

</script>

{@render children?.()}

<lex-editor-wrapper onclick={handleWrapperClick} role="none">
	<lex-editor contenteditable></lex-editor>
</lex-editor-wrapper>

<style>

	lex-editor-wrapper {
		overflow: auto;
		cursor: text;
		border: solid gray 2px;
		padding: 6px;
	}

	lex-editor {
		width: 100%;
		height: 100%;
		outline: none;
	}

</style>
