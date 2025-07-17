// src/App.jsx

import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import HomePage from "./pages/HomePage";
import ToolList from "./components/ToolList";
import AdminAuth from "./pages/AdminAuth";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsLoggedIn(!!token);
  }, [location]); // update login state on route change

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolList />} />
        <Route
          path="/vendors"
          element={<div>Vendors Page (Coming Soon)</div>}
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <AdminPanel />
            ) : (
              <AdminAuth onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
