import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home3D from "./Home3D";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./Dashboard/Dashboard";

export default function App2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home3D />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
