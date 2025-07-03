// src/pages/EditorPage.jsx
import React, { useState, useCallback } from "react";
import Editor from "../components/Editor";
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
        <div className="flex justify-between p-[6px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            Document Editor
          </h2>
          <div className="flex gap-4 text-sm text-slate-500">
            <span id="word-count">0 words</span>
            <span id="char-count">0 characters</span>
          </div>
        </div>

        {/* 60vw × 70vh container */}
        <div className="w-full min-h-[90%] p-2 overflow-auto">
          <Editor onPlaceholder={handlePlaceholder} />
        </div>
      </div>
      <div className="w-[30vw] p-4 rounded-2xl h-[100%]  bg-white">
        {/* suggestion box */}
        <div className="flex justify-between p-[6px] mb-[10px] items-center border-b border-black/5">
          <h2 className="text-[1.2rem] font-semibold text-[#2d3748]">
            AI Suggestions
          </h2>
        </div>
        {placeholderInfo && suggestion && (
          <div className="relative w-[70%] p-4 bg-gray-50 rounded-2xl shadow-lg">
            {/* Floating label */}
            <span className="bg-gray-50 text-xs font-medium text-indigo-500">
              Suggested change
            </span>

            {/* Body */}
            <div className="pt-4 space-y-4">
              {/* “Before” */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Before:</div>
                <div className="italic text-gray-800 text-sm">
                  …{placeholderInfo.before}
                  <span className="bg-yellow-100 px-1">XXXX</span>
                  {placeholderInfo.after}…
                </div>
              </div>

              {/* “After” */}
              <div>
                <div className="text-sm text-gray-600 mb-1">After:</div>
                <div className="text-gray-900 text-sm leading-snug">
                  …{placeholderInfo.before}{" "}
                  <span className="bg-yellow-100 px-1">X{suggestion}</span>{" "}
                  {placeholderInfo.after}…
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  onClick={() => {
                    setPlaceholderInfo(null);
                    setSuggestion(null);
                  }}
                >
                  ✕ Dismiss
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => {
                    const { editor, from, to } = placeholderInfo;
                    editor
                      .chain()
                      .focus()
                      .deleteRange({ from, to })
                      .insertContentAt(from, suggestion)
                      .run();
                    setPlaceholderInfo(null);
                    setSuggestion(null);
                  }}
                >
                  ✓ Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
