import type { EditorThemeClasses } from "lexical";
// import styles from "./editorTheme.module.scss";

export const theme: EditorThemeClasses = {
  heading: {
    h1: "eh1",
    h2: "eh2",
    // h3: styles.h3,
    // h4: styles.h4,
    // h5: styles.h5,
    // h6: styles.h6,
  },

  text: {
    bold: "bold",
    code: "",
    italic: "italic",
    strikethrough: "strikethrough",
    subscript: "styles.textSubscript",
    superscript: "styles.textSuperscript",
    underline: "underline",
    underlineStrikethrough: "underlinestrikethrough",
  },

};
