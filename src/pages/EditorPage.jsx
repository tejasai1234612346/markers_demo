// src/pages/EditorPage.jsx
import React, { useState, useCallback } from "react";
import Editor from "../components/Editor";
import NavBar from "../components/NavBar";
import suggestReplacement from "../services/apiServices";

export default function EditorPage() {
  const [loading, setLoading] = useState(false);
  const [placeholderInfo, setPlaceholderInfo] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const handlePlaceholder = useCallback(
    async (info) => {
      // info: { from, to, before, after }
      if (loading) return;
      setLoading(true);
      setPlaceholderInfo(info);
      // 2. Call your AI helper
      const replacement = await suggestReplacement({
        before: info.before,
        after: info.after,
      });
      setLoading(false);
      setSuggestion(replacement);
    },
    [loading]
  );

  return (
    <div className="p-8 pl-[20px] h-[90vh] flex items-start justify-around  bg-gradient-to-br from-[#667eea] to-[#764ba2]   gap-8">
      <div className="w-[70vw] rounded-2xl p-4 h-[100%] bg-white">
        <div class="flex justify-between p-[6px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            Document Editor
          </h2>
          <div class="flex gap-4 text-sm text-slate-500">
            <span id="word-count">0 words</span>
            <span id="char-count">0 characters</span>
          </div>
        </div>

        {/* 60vw × 70vh container */}
        <div className="w-full h-[95%] p-2 overflow-auto">
          <Editor onPlaceholder={handlePlaceholder} />
        </div>
      </div>
      <div className="w-[30vw] p-4 rounded-2xl h-[100%] bg-white">
        {/* suggestion box */}
        <div class="flex justify-between p-[6px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            AI Suggestions
          </h2>
        </div>
        {placeholderInfo && suggestion && (
          <div className="w-[70%] p-4 bg-white border rounded shadow-lg">
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Before:</div>
              <div className="italic text-gray-800 text-sm">
                …{placeholderInfo.before}
                <span className="bg-yellow-100 px-1">XXXX</span>
                {placeholderInfo.after}…
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">After:</div>
              <div className="text-gray-900">{suggestion}</div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  // cancel — just clear out
                  setPlaceholderInfo(null);
                  setSuggestion(null);
                }}
              >
                ✕
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // apply replacement
                  const { editor, from, to } = placeholderInfo;
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContentAt(from, suggestion)
                    .run();
                  // then clear out
                  setPlaceholderInfo(null);
                  setSuggestion(null);
                }}
              >
                ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
