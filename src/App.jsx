import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Activities from "./pages/Activities";
import Employees from "./pages/Employees";
import Accounts from "./pages/Accounts";
import Leave from "./pages/Leave";
import CarBooking from "./pages/CarBooking";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NoPermissionPage from "./pages/NoPermissionPage";
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Import Report Views
import Report_BOD from "./pages/Report_BOD";
import Report_IT from "./pages/Report_IT";
import Report_Software from "./pages/Report_Software";
import Report_Design from "./pages/Report_Design";
import Report_Factory from "./pages/Report_Factory";
import Report_Finance from "./pages/Report_Finance";
import Report_HRAdmin from "./pages/Report_HRAdmin";
import Report_Marketing from "./pages/Report_Marketing";

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


const PermissionRoute = ({ children, requiredPermission, requiredValue }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required permission
  // Special case for dailyReportView which is a string, not a boolean
  if (requiredPermission === 'dailyReportView') {
    if (!user.permissions ||
      (requiredValue && user.permissions[requiredPermission] !== requiredValue &&
        user.permissions[requiredPermission] !== 'All')) {
      return <NoPermissionPage />;
    }
  } else {
    // For all other permissions which are booleans
    if (!user.permissions || !user.permissions[requiredPermission]) {
      return <NoPermissionPage />;
    }
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
              <PermissionRoute requiredPermission="dashboardView">
                <Dashboard />
              </PermissionRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <PermissionRoute requiredPermission="announcementView">
                <Announcements />
              </PermissionRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <PermissionRoute requiredPermission="activityView">
                <Activities />
              </PermissionRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <PermissionRoute requiredPermission="leaveView">
                <Leave />
              </PermissionRoute>
            }
          />
          {/* Report Routes */}
          <Route
            path="/report/bod"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="BOD">
                <Report_BOD />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/it"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="IT">
                <Report_IT />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/software"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="Software">
                <Report_Software />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/design"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="Design">
                <Report_Design />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/factory"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="Factory">
                <Report_Factory />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/finance"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="Finance">
                <Report_Finance />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/hradmin"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="HRAdmin">
                <Report_HRAdmin />
              </PermissionRoute>
            }
          />
          <Route
            path="/report/marketing"
            element={
              <PermissionRoute requiredPermission="dailyReportView" requiredValue="Marketing">
                <Report_Marketing />
              </PermissionRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PermissionRoute requiredPermission="employeeView">
                <Employees />
              </PermissionRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <PermissionRoute requiredPermission="employeeView">
                <Accounts />
              </PermissionRoute>
            }
          />
          <Route
            path="/carbooking"
            element={
              <PermissionRoute requiredPermission="carBookingView">
                <CarBooking />
              </PermissionRoute>
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
