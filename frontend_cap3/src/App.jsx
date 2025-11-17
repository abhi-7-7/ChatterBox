// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LoginSignup from './components/LoginSignup';
import Dashboard from './pages/Dashboard';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login-signup */}
          <Route path="/" element={<Navigate to="/login-signup" replace />} />
          
          {/* Public Routes */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/login-signup" element={<LoginSignup />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to login */}
          {/* <Route path="*" element={<Navigate to="/login-signup" replace />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;