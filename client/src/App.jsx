import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;
