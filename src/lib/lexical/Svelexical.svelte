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

	import { onMount } from "svelte";
    import { registerFormatter, type FormattedStyle } from "./plugin/toolbar/formatter";
    import Toolbar from "./plugin/toolbar/Toolbar.svelte";

	type Props = {
		// children?: any,
		currentStyle?: FormattedStyle | undefined,
	};

	let {
		// children,
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

	let aa: any = undefined;


	const test = () => {

		currentEditorState?.read(() => (html = generateHtmlFromNodes(editor)));

		// const editorState = editor.parseEditorState(data)
		// currentEditorState.read(() =>   html = generateHtmlFromNodes(editor, null))
	};

	const handleUpdateFormat = (style: FormattedStyle) => {
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

</script>

<lex-split>
	<!-- <div>{@render children()}</div> -->

	<Toolbar {editor}></Toolbar>

	<lex-editor-wrapper on:click={handleWrapperClick}>
		<lex-editor contenteditable></lex-editor>
	</lex-editor-wrapper>

	<lex-state>
		{html}
		<button on:click={() => test()}>へんかん</button>
	</lex-state>

	<!-- <lex-state>{JSON.stringify(state?.toJSON(), undefined, 2) ?? ""}</lex-state> -->
</lex-split>

<style>
	lex-split {
		display: grid;
		grid-template-rows: auto 0.5fr 0.5fr;
		width: 100%;
		height: 100%;
	}

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

	lex-state {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

</style>
