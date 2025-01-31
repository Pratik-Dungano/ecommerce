import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {assets} from '../assets/assets'


const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token); // Store token in localStorage
        setToken(token); // Update the token state
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Validate email format
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <img src={assets.logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className={`mt-4 w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
              loading || !email || !password || !isEmailValid(email)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            type="submit"
            disabled={
              loading || !email || !password || !isEmailValid(email)
            }
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
