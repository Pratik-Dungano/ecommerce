import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const OnSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const url = currentState === 'Sign Up'
      ? `${backendUrl}/api/user/register`
      : `${backendUrl}/api/user/login`;

    const body = currentState === 'Sign Up'
      ? { name, email, password }
      : { email, password };

    try {
      const response = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        if (currentState === 'Login') {
          const userToken = response.data.token;
          setToken(userToken);
          localStorage.setItem('token', userToken);
          navigate('/');
        } else {
          toast.success('Sign up successful! Please log in.');
          setCurrentState('Login');
        }
      } else {
        toast.error(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <img
            src={assets.hero_centre}
            alt="Logo"
            className="mx-auto h-20 w-auto mb-8 drop-shadow-lg animate-float"
          />
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          {currentState === 'Login' ? 'Welcome Back, Beautiful!' : 'Join Our Cool Club!'}
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          {currentState === 'Login' ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
            className="ml-1 font-medium text-pink-600 hover:text-pink-500 cursor-pointer transition-colors duration-200"
          >
            {currentState === 'Login' ? 'Sign up here' : 'Sign in here'}
          </span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 transform transition-all duration-300 hover:shadow-lg">
          <form className="space-y-6" onSubmit={OnSubmitHandler}>
            {currentState === 'Sign Up' && (
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="group relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {isLoading ? 'Processing...' : (currentState === 'Login' ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
