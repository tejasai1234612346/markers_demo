// src/extensions/AiPlaceholder.js
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import PlaceholderTooltip from "./ReplacementTooltip";
/**
 * Custom TipTap Node: ai_placeholder
 *
 * Replaces "XXXX" with an interactive inline element.
 * Shows tooltip with AI-generated suggestion and optional context.
 *
 * Attributes:
 * - text: original placeholder text ("XXXX")
 * - replacement: LLM-suggested replacement
 * - context: explanation or supporting info
 * - id: unique ID used for syncing with suggestion panel
 */
export default Node.create({
  name: "ai_placeholder",
  group: "inline",
  inline: true,
  atom: true, // treated as a single unit in editor (can't be split)
  // === Define attributes ===
  addAttributes() {
    return {
      text: { default: "XXXX" },
      replacement: { default: "" },
      context: { default: "" },
      id: { default: null },
    };
  },
  // === HTML parsing support ===
  parseHTML() {
    return [{ tag: "span[data-ai-placeholder]" }];
  },
  // === Output HTML when serializing content ===
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-ai-placeholder": "true",
        style: "border-bottom: 2px orange; cursor: pointer;",
      }),
    ];
  },
  // === Custom React NodeView for Tooltip interactions ===
  addNodeView() {
    return ReactNodeViewRenderer(
      ({ node, updateAttributes, editor, getPos }) => {
        const { text, replacement, context } = node.attrs;

        return (
          <NodeViewWrapper as="span" style={{ position: "relative" }}>
            <PlaceholderTooltip
              text={text}
              replacement={replacement}
              context={context}
              onApply={() => {
                const pos = getPos?.();
                if (typeof pos !== "number") return;

                editor
                  .chain()
                  .focus()
                  .deleteRange({ from: pos, to: pos + node.nodeSize })
                  .insertContentAt(pos, replacement)
                  .run();
                editor.options.onSuggestionHandled?.(node.attrs.id);
              }}
              onReject={() => {
                const pos = getPos?.();
                if (typeof pos !== "number") return;

                editor
                  .chain()
                  .focus()
                  .deleteRange({ from: pos, to: pos + node.nodeSize }) // Remove the node
                  .insertContentAt(pos, node.attrs.text) // Reinsert raw text (e.g., "XXXX")
                  .run();
                editor.options.onSuggestionHandled?.(node.attrs.id);
              }}
            />
          </NodeViewWrapper>
        );
      }
    );
  },
});
