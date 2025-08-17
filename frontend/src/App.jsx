import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Records from './pages/Records';
import ReportCard from './pages/ReportCard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Parents from './pages/Parents';

import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Your auth guard component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/records"
            element={
              <PrivateRoute>
                <Records />
              </PrivateRoute>
            }
          />
          <Route
            path="/reportcard"
            element={
              <PrivateRoute>
                <ReportCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <PrivateRoute>
                <Teachers />
              </PrivateRoute>
            }
          />
          <Route
            path="/parents"
            element={
              <PrivateRoute>
                <Parents />
              </PrivateRoute>
            }
          />

          {/* Redirect unmatched routes to dashboard or login */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;