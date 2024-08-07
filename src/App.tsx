import React from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import AppNavbar from './components/Navbar';
import EmailLinkHandler from './components/EmailLinkHandler';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/callback" element={<EmailLinkHandler />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
