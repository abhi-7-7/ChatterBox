// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Signup from "./components/Signup";
import Login from "./components/Login";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./pages/Dashboard/Dashboard"; 
import ChatPage from "./pages/ChatPage/ChatPage";
import Profile from "./pages/Profiles/Profile";
// import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Home / Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          /> */}


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login-signup" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
