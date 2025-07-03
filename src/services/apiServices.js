// src/api/llm.js
const KEY = "AIzaSyActxvOCk7cmf5Yn-eZfH8X7ymwpRuF684"

export default async function suggestReplacement({ before, after }) {
  const prompt = `…${before}XXXX${after}…\nReplace “XXXX” concisely. Reply only with the replacement.`
  const url    = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

  try {
    const res = await fetch(`${url}?key=${KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      throw new Error(`Status ${res.status}`)
    }

    const { candidates } = await res.json()
    // Drill into the first candidate's content.parts[0].text
    const raw = candidates?.[0]?.content?.parts?.[0]?.text
    if (!raw) {
      console.warn('No output in candidate, falling back')
      return 'replacement'
    }
    // Trim whitespace/newlines
    return raw.trim()
  } catch (err) {
    console.warn('Gemini call failed, stub replacement:', err)
    return 'replacement'
  }
}
