import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div> Home Page </div>} />
        <Route path="about" element={<div>About Page</div>} />
        <Route path="contact" element={<div>contact Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
