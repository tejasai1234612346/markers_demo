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

      // 3. Verify the text is still “XXXX”
      // const currentText = info.editor.getText().slice(info.from - 1, info.to - 1)
      // if (currentText !== 'XXXX') {
      //   console.warn('Placeholder moved—skipping replace')
      //   return
      // }
      setSuggestion(replacement);

      // // 4. Apply the replacement
      // info.editor
      //   .chain()
      //   .focus()
      //   .deleteRange({ from: info.from, to: info.to })
      //   .insertContentAt(info.from, replacement)
      //   .run()
    },
    [loading]
  );

  return (
    <div className="max-w-6xl mx-auto p-8 pl-[20px] flex items-start justify-around    gap-8">
      <div className="w-[70vw]">
        <h2 className="text-[32px] mb-4">Markers Demo</h2>

        {/* 60vw × 70vh container */}
        <div className="w-[60vw] h-[70vh]">
          <Editor onPlaceholder={handlePlaceholder} />
        </div>
      </div>
      <div className="w-[30vw]">
        {/* suggestion box */}
        <h2 className="text-[32px] mb-4">Sugesstions</h2>
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
