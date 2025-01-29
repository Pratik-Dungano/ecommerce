import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const OnSubmitHandler = async (event) => {
    event.preventDefault();

    // API URL based on current state
    const url =
      currentState === 'Sign Up'
        ? `${backendUrl}/api/user/register`
        : `${backendUrl}/api/user/login`;

    const body =
      currentState === 'Sign Up'
        ? { name, email, password }
        : { email, password };

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        if (currentState === 'Login') {
          const userToken = response.data.token;
          setToken(userToken); // Save token in context
          localStorage.setItem('token', userToken); // Save token in localStorage
          navigate('/'); // Redirect on successful login
        } else {
          toast.success('Sign up successful! Please log in.');
          setCurrentState('Login'); // Switch to login after sign-up
        }
      } else {
        toast.error(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={OnSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-sm m-auto mt-10 gap-6 text-gray-800"
    >
      {/* Title */}
      <div className="inline-flex items-center gap-2 mb-4">
        <p className="text-2xl sm:text-3xl font-medium">{currentState}</p>
        <hr className="border-none h-[1px] w-10 bg-gray-800" />
      </div>

      {/* Conditional Input for Sign Up */}
      {currentState === 'Sign Up' && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="Name"
          required
        />
      )}

      {/* Email Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring focus:ring-gray-300"
        placeholder="Email"
        required
      />

      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring focus:ring-gray-300"
        placeholder="Password"
        required
      />

      {/* Links Section */}
      <div className="w-full flex justify-between text-sm">
        <p className="cursor-pointer text-gray-500 hover:underline">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Login Here
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-black text-white rounded-md text-center font-medium hover:bg-gray-800"
      >
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
