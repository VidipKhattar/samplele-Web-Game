import "./App.css";
import React from "react";
import MainPage from "./pages/mainPage";
import AdminLogin from "./pages/adminLogin";
import Login from "./pages/login";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="admin" element={<Login />} />
        <Route path="easteregg" element={<div>HAHAHHAHAHAHA</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
