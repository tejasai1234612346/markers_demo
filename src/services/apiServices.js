// src/api/llm.js
const KEY = "AIzaSyActxvOCk7cmf5Yn-eZfH8X7ymwpRuF684"
export default async function suggestReplacement({ before, after, context }) {
  const prompt = `
  Sentence: "${context}"

just only Replace "XXXX" concisely and explain why you chose that replacement.

Respond in this JSON format without markdown:

{
  "replacement": "...",
  "context": "..."
}
  `.trim();

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  try {
    const res = await fetch(`${url}?key=${KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      throw new Error(`Status ${res.status}`);
    }

    const { candidates } = await res.json();
    let raw = candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔥 Remove markdown block ```json ... ``` if present
    raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);

    return {
      replacement: parsed.replacement?.trim() || "replacement",
      context: parsed.context?.trim() || "",
    };
  } catch (err) {
    console.warn("Gemini call failed, stub replacement:", err);
    return {
      replacement: "replacement",
      context: "No context available.",
    };
  }
}
