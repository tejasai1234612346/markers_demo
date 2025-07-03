// src/components/NavBar.jsx
import React from "react";

export default function NavBar() {
  return (
    <nav className="w-full bg-white p-6 h-[10vh] flex items-center justify-between">
      {/* Brand / Logo */}
      <div className="flex items-center text-white space-x-2">
        <span className="text-2xl">🔥</span>
        <span className="text-2xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Teja Demo
        </span>
      </div>

      {/* User icon button */}
      <button
        type="button"
        className="p-2 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] transition cursor-pointer"
        aria-label="User menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A15.933 15.933 0 0112 15c2.831 0 5.48.816 7.879 2.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </nav>
  );
}
