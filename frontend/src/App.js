import React from "react";
import MainPage from "./pages/mainPage";
import Youtube from "./pages/youtube";
import Login from "./pages/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/easteregg" element={<Youtube></Youtube>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
