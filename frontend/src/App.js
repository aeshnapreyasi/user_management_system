import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './styles.css';

const App = () => {
  const isLoggedIn = () => {
    // Check if the user is logged in by verifying the presence of a session token or flag
    return localStorage.getItem('userToken') ? true : false;
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to Login if the user is not logged in */}
        <Route
          path="/"
          element={isLoggedIn() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
        />
        
        {/* Login Route */}
        <Route
          path="/login"
          element={!isLoggedIn() ? <Login /> : <Navigate to="/home" replace />}
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={!isLoggedIn() ? <Register /> : <Navigate to="/home" replace />}
        />

        {/* Home Route */}
        <Route
          path="/home"
          element={isLoggedIn() ? <Home /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
