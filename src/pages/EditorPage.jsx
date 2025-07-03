// src/pages/EditorPage.jsx
import React, { useState, useCallback } from "react";
import Editor from "../components/Editor";
import suggestReplacement from "../services/apiServices";

export default function EditorPage() {
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const handlePlaceholder = useCallback(
    async (info) => {
      if (loading) return;
      setLoading(true);

      // 1) Get AI suggestion
      const replacement = await suggestReplacement({
        before: info.before,
        after: info.after,
      });
      setLoading(false);

      // 2) Immediately apply it in the editor
      info.editor
        .chain()
        .focus()
        .deleteRange({ from: info.from, to: info.to })
        .insertContentAt(info.from, replacement)
        .run();

      // 3) Record it in your history
      setSuggestions((all) => [
        ...all,
        {
          id: Date.now(), // simple unique key
          before: info.before,
          after: info.after,
          replacement,
        },
      ]);
    },
    [loading]
  );

  return (
    <div className="p-8 pl-[20px] h-[90vh] flex items-start justify-around  bg-gradient-to-br from-gray-200 to-gray-400 gap-8">
      <div className="w-[70vw] rounded-2xl p-4 h-[100%] bg-white">
        <div className="flex justify-between p-[6px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            Document Editor
          </h2>
        </div>

        {/* 60vw × 70vh container */}
        <div className="w-full min-h-[90%] p-2 overflow-auto">
          <Editor onPlaceholder={handlePlaceholder} />
        </div>
      </div>
      <div className="w-[30vw] p-4 rounded-2xl h-[100%]  bg-white overflow-scroll">
        {/* suggestion box */}
        <div className="flex justify-between p-[6px] mb-[10px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            AI Suggestions Made
          </h2>
        </div>

        {suggestions.map((s) => (
          <div
            key={s.id}
            className="mb-4 w-[95%] p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="text-xs text-gray-500 mb-1">Before:</div>
            <div className="italic text-gray-800 mb-2">
              …{s.before}
              <span className="bg-yellow-200 px-1">XXXX</span>
              {s.after}…
            </div>
            <div className="text-xs text-gray-500 mb-1">Replaced With:</div>
            <div className="italic text-gray-800 mb-2">
              …{s.before}
              <span className="bg-orange-200 px-1">{s.replacement}</span>
              {s.after}…
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
