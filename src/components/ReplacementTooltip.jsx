// ReplacementTooltip.jsx (uses Tippy.js and your exact style)
import React from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";

/**
 * Tooltip UI for AI suggestions.
 * Appears when user hovers over "XXXX" inline node.
 * Displays suggested replacement and context, with Apply & Reject buttons.
 */
export default function PlaceholderTooltip({
  text,
  replacement,
  context,
  onApply,
  onReject,
}) {
  // Tooltip content
  const renderTooltip = (attrs) => (
    <div
      tabIndex="-1"
      {...attrs}
      style={{
        width: "320px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        fontFamily: "sans-serif",
        padding: "14px",
        zIndex: 1000,
      }}
    >
      {/* Tooltip Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontWeight: "600" }}>Suggested change</p>
        <button
          onClick={onReject}
          style={{
            fontSize: "0.8rem",
            border: "none",
            background: "transparent",
            color: "#BDBDBD",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
      {/* Replacement Block */}
      <div
        style={{
          border: "1px solid #BDBDBD",
          marginTop: "10px",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            background: "#BDBDBD",
            padding: "0.5rem 0.75rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderRadius: "4px 4px 0 0",
            color: "white",
          }}
        >
          <button
            onClick={onApply}
            style={{
              fontSize: "0.8rem",
              border: "none",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✓ Apply
          </button>
        </div>
        <div
          style={{
            padding: "8px",
            fontSize: "18px",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {replacement}
        </div>
      </div>
      {/* Optional Context */}
      {context && (
        <div
          style={{
            fontSize: "0.875rem",
            color: "#444",
            marginTop: "4px",
          }}
        >
          <strong>Context:</strong> {context}
        </div>
      )}
    </div>
  );

  return (
    <Tippy
      render={renderTooltip}
      interactive={true}
      placement="top"
      delay={[100, 0]}
      offset={[0, 10]}
    >
      <span
        style={{
          borderBottom: "2px solid red",
          cursor: "pointer",
        }}
      >
        {text}
      </span>
    </Tippy>
  );
}
