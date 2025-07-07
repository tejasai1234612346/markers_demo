import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plugin } from "prosemirror-state";
import AiPlaceholder from "./AiPlaceholder";
/**
 * TipTap Editor integrated with AI placeholder support
 * - Inserts custom nodes with LLM-generated suggestions
 * - Notifies parent via `onNodeInserted` when a placeholder is rendered
 */
export default function Editor({
  aiReplacements = [], // List of AI suggestion objects with position + data
  onReady, // Callback to expose TipTap instance
  onNodeInserted, // Callback when an AI node is inserted (sync with right panel)
}) {
  // ====== Initialize TipTap Editor ======
  const editor = useEditor({
    extensions: [StarterKit, AiPlaceholder],
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
          props: {}, // Add custom plugin logic here if needed
        }),
      ],
    },
    autofocus: "end",
    onCreate({ editor }) {
      onReady?.(editor); // Expose editor on mount
    },
    onUpdate({ editor }) {
      onReady?.(editor); // Keep reference fresh on every change
    },
  });
  // ====== Insert AI Suggestions as Custom Nodes ======
  useEffect(() => {
    if (!editor) return;
    const chain = editor.chain().focus();
    // Loop through new replacements and insert AI placeholder nodes
    [...aiReplacements]
      .reverse()
      .forEach(({ from, to, replacement, context, id, text }) => {
        const currentText = editor.state.doc.textBetween(from, to);
        if (currentText === "XXXX") {
          // Replace "XXXX" with custom node
          chain.deleteRange({ from, to }).insertContentAt(from, {
            type: "ai_placeholder",
            attrs: { text: "XXXX", replacement, context, id },
          });
          // Report to parent so it appears in the right panel
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
    // Commit all changes to editor state
    chain.run();
  }, [aiReplacements, editor]);

  if (!editor) return <div>Loading editor…</div>;

  return <EditorContent editor={editor} />;
}
