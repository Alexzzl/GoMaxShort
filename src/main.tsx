import { createRoot } from "react-dom/client";

import "../css/common.css";
import "../css/home.css";
import "../css/discover.css";
import "../css/detail.css";
import "../css/player.css";
import "../css/page-header.css";
import "../css/settings.css";
import "./styles/react-overrides.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(<App />);
