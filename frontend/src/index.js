import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

function Root() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
