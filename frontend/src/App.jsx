import React, { useContext } from 'react';
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
import CategoryNav from './components/CategoryNav'; 
import MyProfile from './pages/MyProfile';
import Saree from './pages/Saree';
import Lehenga from './pages/Lehenga';
import Kurtas from './pages/Kurtas';
import Gown from './pages/Gown';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import Searchbar from './components/Searchbar';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryPage from './pages/CategoryPage'; 
import ExchangeReturnPolicy from './components/Exchange_Return_Policy';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundAndCancellation from './components/RefundAndcancellationPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import { ShopContext } from './context/ShopContext';

const App = () => {
  const { showSearch } = useContext(ShopContext);
  return (
    // Main container with padding for responsiveness
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[0vw]">
      <ToastContainer />
      {/* Navigation bar */}
      <Navbar />
      <CategoryNav /> 
      {showSearch && <Searchbar />}

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

        {/* Saree page */}
        <Route path="/saree" element={<Saree />} />

        {/* Lehenga page */}
        <Route path="/lehenga" element={<Lehenga />} />

        {/* Kurtas page */}
        <Route path="/kurtas" element={<Kurtas />} />

        {/* Gown page */}
        <Route path="/gown" element={<Gown />} />

        {/* Wishlist page */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<MyProfile />} />

        {/* Category and Subcategory pages */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
        {/* Exchange and Return Policy page */}
        <Route path="/exchange-return-policy" element={<ExchangeReturnPolicy />} />
        {/* Privacy Policy page */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Refund and Cancellation Policy page */}
        <Route path="/refund-cancellation-policy" element={<RefundAndCancellation />} />
        {/* Shipping Policy page */}
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        
      </Routes>

      <Footer/>
    </div>
  );
};

export default App;