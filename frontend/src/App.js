import "./App.css";
import React from "react";
import MainPage from "./pages/mainPage";
import adminLogin from "./pages/adminLogin";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="admin" element={<adminLogin />} />
        <Route path="easteregg" element={<div>HAHAHHAHAHAHA</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
