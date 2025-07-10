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
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <PrivateRoute>
                <Announcements />
              </PrivateRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <PrivateRoute>
                <Activities />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <PrivateRoute>
                <Leave />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/carbooking"
            element={
              <PrivateRoute>
                <CarBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div className="p-6 text-center text-red-600">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
