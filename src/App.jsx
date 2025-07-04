import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Activities from "./pages/Activities";
import Employees from "./pages/Employees";
import Report from "./pages/Report";
import Leave from "./pages/Leave";
import CarBooking from "./pages/CarBooking";
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
        <Route path="/PAGEMS/announcements" element={<Announcements />} />
        <Route path="/PAGEMS/activities" element={<Activities />} />
        <Route path="/PAGEMS/leave" element={<Leave />} />
        <Route path="/PAGEMS/report" element={<Report />} />
        <Route path="/PAGEMS/carbooking" element={<CarBooking />} />

        <Route path="/PAGEMS/employees" element={<Employees />} />
        <Route path="/PAGEMS/messages" element={<Messages />} />

        {/* Catch-all route */}
        <Route path="*" element={<div className="p-6 text-center text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
