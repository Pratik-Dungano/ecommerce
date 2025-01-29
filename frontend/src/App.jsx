import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Searchbar from './components/Searchbar';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    // Main container with padding for responsiveness
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[0vw]">
      <ToastContainer />
      {/* Navigation bar */}
      <Navbar />
      <Searchbar />

      {/* Routes for different pages */}
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* About page */}
        <Route path="/about" element={<About />} />

        {/* Cart page */}
        <Route path="/cart" element={<Cart />} />

        {/* Product details page (dynamic route for productId) */}
        <Route path="/product/:productId" element={<Product />} />

        {/* Collection page */}
        <Route path="/collection" element={<Collection />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Place Order page */}
        <Route path="/place-order" element={<PlaceOrder />} />

        {/* Contact page */}
        <Route path="/contact" element={<Contact />} />

        {/* Orders page */}
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer/>
    </div>
  );
};

export default App;