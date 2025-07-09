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
import Profile from "./pages/Profile";

const App = () => {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/report" element={<Report />} />
        <Route path="/carbooking" element={<CarBooking />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div className="p-6 text-center text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
