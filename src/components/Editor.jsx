import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ReplacementMark from "./ReplacementMark";
import { Plugin } from "prosemirror-state";

export default function Editor({
  aiReplacements = [],
  onReady,
  onNodeInserted,
}) {
  const editor = useEditor({
    extensions: [StarterKit, ReplacementMark],
    content: "<p>Type something like XXXX to replace</p>",
    editorProps: {
      attributes: {
        class: [
          "ProseMirror",
          "w-full",
          "h-[70vh]",
          "overflow-auto",
          "rounded-lg",
          "focus:outline-none",
          "focus:ring-0",
          "overflow-auto",
          "pt-[10px]",
        ].join(" "),
      },
      plugins: [
        new Plugin({
          props: {},
        }),
      ],
    },
    autofocus: "end",
    onCreate({ editor }) {
      onReady?.(editor);
    },
    onUpdate({ editor }) {
      onReady?.(editor);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const chain = editor.chain().focus();

    [...aiReplacements]
      .reverse()
      .forEach(({ from, to, replacement, context, id, text }) => {
        const currentText = editor.state.doc.textBetween(from, to);
        if (currentText === "XXXX") {
          chain.deleteRange({ from, to }).insertContentAt(from, {
            type: "ai_placeholder",
            attrs: { text: "XXXX", replacement, context, id },
          });
          // notify parent to add this to suggestions panel
          const docText = editor.state.doc.textBetween(
            0,
            editor.state.doc.content.size
          );
          onNodeInserted?.({
            id,
            from,
            to,
            replacement,
            context,

            before: docText.slice(Math.max(0, from - 20), from),
            after: docText.slice(to, to + 20),
          });
        }
      });

    chain.run();
  }, [aiReplacements, editor]);

  if (!editor) return <div>Loading editor…</div>;

  return <EditorContent editor={editor} />;
}
