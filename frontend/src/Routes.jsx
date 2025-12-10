import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import App from "./App";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predictor" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
