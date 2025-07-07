// src/pages/EditorPage.jsx
import React, { useState, useCallback } from "react";
import Editor from "../components/Editor";
import suggestReplacement from "../services/apiServices";
//Icons
import { CiPlay1 } from "react-icons/ci";

export default function EditorPage() {
  // ====== State Setup ======
  const [suggestions, setSuggestions] = useState([]); // Show AI suggestions in side panel
  const [aiReplacement, setAiReplacement] = useState([]); // AI suggestoins sent to the editor
  const [editorInstance, setEditorInstance] = useState(null); // Editor Reference

  // ====== Trigger AI Suggestions on Run ======
  const runAll = async () => {
    if (!editorInstance) return;
    const text = editorInstance.getText();
    const { doc } = editorInstance.state;
    const replacements = [];

    // Find every "XXXX" and collect context
    doc.descendants((node, pos) => {
      if (node.isText) {
        const regex = /\bXXXX\b/g;
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          const start = pos + match.index;
          const end = start + match[0].length;

          const fullBefore = text.slice(Math.max(0, start - 500), start);
          const fullAfter = text.slice(end, end + 500);
          const safeBefore = fullBefore.split("XXXX").pop();
          const safeAfter = fullAfter.split("XXXX")[0];
          const sentenceBefore = fullBefore.split(/(?<=[.?!])\s+/).pop() || "";
          const sentenceAfter = fullAfter.split(/(?<=[.?!])\s+/)[0] || "";

          const simplecontext =
            `${sentenceBefore} XXXX ${sentenceAfter}`.trim();

          replacements.push({
            from: start,
            to: end,
            before: safeBefore,
            after: safeAfter,
            simplecontext: simplecontext,
          });
        }
      }
    });

    // Call LLM calls in parallel
    const enriched = await Promise.all(
      replacements.map(async (r, idx) => {
        const { replacement, context } = await suggestReplacement({
          before: r.before,
          after: r.after,
          context: r.simplecontext,
        });
        return {
          ...r,
          replacement,
          context,
          id: Date.now() + idx,
        };
      })
    );
    // Update both editor and side panel
    setAiReplacement(enriched);
  };
  // Called from inside Editor on placeholder node insertion
  const handleNodeInserted = (node) => {
    setSuggestions((prev) => {
      const index = prev.findIndex((item) => item.id === node.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = node;
        return updated;
      }
      return [...prev, node];
    });
  };
  const handleEditorReady = useCallback((editor) => {
    setEditorInstance(editor);
  }, []);

  // ====== Layout Rendering ======
  return (
    <div className="p-8 pl-[20px] h-[90vh] flex items-start justify-around  bg-gradient-to-br from-gray-200 to-gray-400 gap-8">
      <div className="w-[70vw] rounded-2xl p-4 h-[100%] bg-white">
        <div className="flex justify-between p-[6px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            Document Editor
          </h2>
          <CiPlay1
            className="cursor-pointer border border-[#764ba2] text-[#764ba2] h-8 w-8 p-2 rounded-md"
            color="#764ba2"
            onClick={() => runAll()}
          />
        </div>

        {/* TipTap Editor Content */}
        <div className="w-full min-h-[90%] p-2 overflow-auto">
          <Editor
            onReady={handleEditorReady}
            aiReplacements={aiReplacement}
            onNodeInserted={handleNodeInserted}
          />
        </div>
      </div>

      {/* Right-Side Suggestions Panel */}
      <div className="w-[30vw] p-4 rounded-2xl h-[100%]  bg-white overflow-scroll">
        <div className="flex justify-between p-[6px] mb-[10px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            AI Suggestions
          </h2>
        </div>

        {suggestions.map((s) => (
          <div key={s.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Before:</div>
            <div className="italic text-gray-800 mb-2">
              …{s.before}
              <span className="bg-yellow-200 px-1">XXXX</span>
              {s.after}…
            </div>
            <div className="text-xs text-gray-500 mb-1">AI Replacement:</div>
            <div className="italic text-gray-800 mb-2">
              <div className="italic text-gray-800 mb-2">
                …{s.before}
                <span className="bg-orange-200 px-1">{s.replacement}</span>
                {s.after}…
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
