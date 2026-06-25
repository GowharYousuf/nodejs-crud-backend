// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from "./pages/header/Header";
import Login from "./pages/auth/login/Login";
import SignUp from "./pages/auth/signup/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');

    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (error) {
        console.error('Invalid user stored in localStorage', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
