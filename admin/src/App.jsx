import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Edit from './components/Edit';
import Categories from './pages/Categories';
import { backendUrl } from './config';

const App = () => {
  const [token, setToken] = useState(""); // Always start with an empty token

  useEffect(() => {
    // Remove token from localStorage on initial render
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Handle session timeout (auto logout after 15 minutes)
  useEffect(() => {
    if (token) {
      const timeout = setTimeout(() => {
        setToken(""); // Clear token after 15 minutes
        localStorage.removeItem("token"); // Remove token from localStorage
      }, 15 * 60 * 1000); // 15 minutes in milliseconds

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/edit/:id" element={<Edit token={token} />} />
                <Route path="/categories" element={<Categories token={token} />} />
          
                {/* Default redirect route */}
                <Route path="/" element={<Navigate to="/orders" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
