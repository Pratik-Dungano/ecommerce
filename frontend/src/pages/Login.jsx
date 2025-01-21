import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const OnSubmitHandler = async (event) => {
    event.preventDefault();

    // Set the API URL based on current state (Login or Sign Up)
    const url = currentState === 'Sign Up' ? `${backendUrl}/api/user/register` : `${backendUrl}/api/user/login`;

    const body = currentState === 'Sign Up'
      ? { name, email, password }
      : { email, password };

    try {
      // Make the API request using axios
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is successful
      if (response.status === 200) {
        if (currentState === 'Login') {
          // On successful login, save the token in state and localStorage
          const userToken = response.data.token;
          setToken(userToken); // Update token in context
          localStorage.setItem('token', userToken); // Store token in localStorage
          navigate('/'); // Redirect to dashboard or another page
        } else {
          // After successful sign-up, change the state to Login
          toast.success('Sign up successful! Please log in.');
          setCurrentState('Login');
        }
      } else {
        // Handle unsuccessful responses
        toast.error(response.data.message || 'An error occurred. Please try again.', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.', { position: toast.POSITION.TOP_CENTER });
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={OnSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-sm m-auto mt-10 gap-6 text-gray-800">
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
