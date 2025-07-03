import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EditorPage from "./pages/EditorPage";

import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-100">
        <Link to="/" className="mr-4">
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
