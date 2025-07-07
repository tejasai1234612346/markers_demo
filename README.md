# 🧠 AI Placeholder Editor – Proof of Concept

A rich text editor built with **React** and **Tiptap**, enhanced with **LLM (Gemini)** integration. It detects `XXXX` placeholders in a document, sends contextual prompts to an LLM, and allows you to apply or reject intelligent suggestions both inline (via tooltip) and in a synchronized sidebar.

---

## 🚀 Features

- 📝 Smart detection of `XXXX` placeholders in the editor
- 🤖 Gemini LLM generates context-aware replacements
- 🧠 Context-aware prompts using surrounding sentences
- 🎯 Inline tooltips powered by **Tippy.js** for Apply/Reject actions
- 🪟 Sidebar panel listing all current AI suggestions
- ⚡ Parallel API requests for speed
- ♻️ Modular, extendable architecture using **Tiptap** extensions

---

## 📁 Project Structure

src/
├── components/
│ ├── Editor.jsx # Sets up the Tiptap editor and handles insertion
│ └── ReplacementTooltip.jsx # Custom tooltip UI rendered using Tippy.js
│
├── extensions/
│ └── AiPlaceholder.js # Tiptap custom inline node for AI placeholder
│
├── pages/
│ └── EditorPage.jsx # Layout: Editor + Right-Side Suggestion Panel
│
├── services/
│ └── apiServices.js # Communicates with Gemini LLM
│
public/
└── index.html

## 🛠️ Getting Started

### 1. Clone the Repository

gh repo clone tejasai1234612346/markers_demo
cd marker-demo

### 2.Install Dependencies

npm install

### 3.Start Development Server

npm start

✨ How It Works

### 4. How it works

#### a.You write content like:

The capital of India is XXXX. The PM is XXXX.

#### b.Clicking ▶️ triggers runAll():

Finds all XXXX matches in the editor

Extracts 500-character context on both sides

Builds sentence-aware prompts

Sends them to Gemini using Promise.all()

Inserts AI placeholder nodes via Tiptap's command chain

#### c.Each node:

Is wrapped in a styled span

On hover, shows a tooltip with:

Suggested replacement

Source context

Apply (✓) or Reject (✗) buttons

The right panel shows all suggestions and tracks real-time state from the editor.
