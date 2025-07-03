// src/components/Editor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";

export default function Editor({ onPlaceholder }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Type here to see placeholder detection:</p>",
    editorProps: {
      attributes: {
        class: [
          "ProseMirror",
          "w-full",
          "h-full",
          "overflow-auto",
          "min-h-full",
          "p-[24px]",
          "rounded-lg",
          "border border-gray-100",
          "shadow-sm",
          "focus:outline-none focus:ring-1 focus:gray-100",
          "overflow-auto",
        ].join(" "),
      },
      plugins: [
        // underline any “XXXX” spans
        new Plugin({
          props: {
            decorations(state) {
              const decos = [];
              const text = state.doc.textBetween(
                0,
                state.doc.content.size,
                undefined,
                "\ufffc"
              );
              let match;
              const pattern = /\bXXXX\b/g;
              while ((match = pattern.exec(text))) {
                const from = match.index + 1;
                const to = from + match[0].length;
                decos.push(
                  Decoration.inline(from, to, {
                    style:
                      "text-decoration: underline; text-decoration-color: #ffba08",
                  })
                );
              }
              return DecorationSet.create(state.doc, decos);
            },
          },
        }),
      ],
    },
    autofocus: "end",
    onCreate: ({ editor }) => editor.chain().focus().run(),
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const match = text.match(/\bXXXX\b/);
      if (!match) {
        return;
      }
      if (match) {
        // 1) Compute from/to
        const index = match.index; // guaranteed to be defined because match is truthy
        const from = index + 1;
        const to = from + match[0].length;

        // 2) Compute context *after* we know index
        const radius = 50;
        const before = text.slice(Math.max(0, index - radius), index);
        const after = text.slice(
          index + match[0].length,
          index + match[0].length + radius
        );

        // 3) Notify parent with everything in scope
        onPlaceholder({ editor, from, to, before, after });
      }
    },
  });

  if (!editor) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Loading editor…
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}
