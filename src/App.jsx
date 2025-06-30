import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Messages from "./pages/Messages";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/PAGEMS/login" replace />} />

        {/* Login page */}
        <Route path="/PAGEMS/login" element={<Login />} />

        <Route path="/PAGEMS/dashboard" element={<Dashboard />} />

        <Route path="/PAGEMS/employees" element={<Employees />} />
        <Route path="/PAGEMS/messages" element={<Messages />} />

        {/* Catch-all route */}
        <Route path="*" element={<div className="p-6 text-center text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
