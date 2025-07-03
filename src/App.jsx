import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import NavBar from "./components/NavBar";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
