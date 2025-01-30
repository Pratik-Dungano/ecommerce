import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, getWishListCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  return (
    <div className="sticky top-0 left-0 w-full flex items-center justify-between py-2 px-4 sm:px-6 bg-white shadow-md z-50 font-medium">
      {/* Logo with responsive margin */}
      <Link to="/" className="flex-shrink-0 ml-4 md:ml-8">
        <img
          src={assets.nav_logo}
          className="w-32 md:w-40 mt-1"
          alt="Logo"
        />
      </Link>

      {/* Desktop Navigation - hidden on mobile */}
      <div className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-4 lg:gap-6 text-lg text-custom-green font-bold font-anton">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center gap-1">
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setVisible(false)}
        ></div>
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        visible ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}>
        <div className="p-4">
          <img
            src={assets.close_icon}
            className="w-6 h-6 ml-auto mb-4 cursor-pointer"
            onClick={() => setVisible(false)}
            alt="Close menu"
          />
          <ul className="flex flex-col gap-6 text-lg text-custom-green font-bold font-anton">
            <NavLink to="/" onClick={() => setVisible(false)}>HOME</NavLink>
            <NavLink to="/collection" onClick={() => setVisible(false)}>COLLECTION</NavLink>
            <NavLink to="/about" onClick={() => setVisible(false)}>ABOUT</NavLink>
            <NavLink to="/contact" onClick={() => setVisible(false)}>CONTACT</NavLink>
          </ul>
        </div>
      </div>

      {/* Right-aligned icons with responsive spacing */}
      <div className="flex items-center gap-4 md:gap-6 mr-4 md:mr-8">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer hidden md:block"
          alt="Search"
        />
        
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate('/login'))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="Profile"
          />
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <Link to="/wishlist" className="relative">
          <img src={assets.heart_icon} className="w-5 min-w-5" alt="Wishlist" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getWishListCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(!visible)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer md:hidden"
          alt="Menu"
        />
      </div>
    </div>
  );
};

export default Navbar;