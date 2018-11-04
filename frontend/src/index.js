import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#root");
  ReactDOM.render(<App />, root);
});
