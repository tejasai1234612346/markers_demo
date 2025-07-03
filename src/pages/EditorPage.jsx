// src/pages/EditorPage.jsx
import React, { useState, useCallback } from 'react'
import Editor from '../components/Editor'
import suggestReplacement from '../services/apiServices'

export default function EditorPage() {
    const [loading, setLoading]         = useState(false)
  const [placeholderInfo, setPlaceholderInfo] = useState(null)

  const handlePlaceholder = useCallback(async (info) => {
    // info: { from, to, before, after }
    if (loading) return
    setLoading(true)
    setPlaceholderInfo(info)

    // 2. Call your AI helper
    const replacement = await suggestReplacement({
      before: info.before,
      after: info.after,
    })

    setLoading(false)

    // 3. Verify the text is still “XXXX”
    const currentText = info.editor.getText().slice(info.from - 1, info.to - 1)
    if (currentText !== 'XXXX') {
      console.warn('Placeholder moved—skipping replace')
      return
    }

    // 4. Apply the replacement
    info.editor
      .chain()
      .focus()
      .deleteRange({ from: info.from, to: info.to })
      .insertContentAt(info.from, replacement)
      .run()
  }, [loading])

  return (
    <div className="max-w-6xl mx-auto p-8  pl-[20px]">
      <h2 className="text-[32px] mb-4">Markers Demo</h2>

      {/* 60vw × 70vh container */}
      <div className="w-[60vw] h-[70vh]">
        <Editor onPlaceholder={handlePlaceholder} />
      </div>

      {placeholderInfo && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          Found <code>“XXXX”</code> at{' '}
          <span className="font-mono">
            from: {placeholderInfo.from}, to: {placeholderInfo.to}
          </span>
        </div>
      )}
    </div>
  )
}
