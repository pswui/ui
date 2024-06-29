import "./tailwind.css";
import App from "@/DialogOverflowTest.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

const ROOT = document.getElementById("root");

if (!ROOT) throw new Error("ROOT is not found");

ReactDOM.createRoot(ROOT).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
