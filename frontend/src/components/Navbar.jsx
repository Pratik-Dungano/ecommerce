import React, { useState,useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  // State to manage visibility of the sidebar menu
  const [visible, setVisible] = useState(false);
  const {setShowSearch,getCartCount,navigate,token,setToken,setCartItems}=useContext(ShopContext);
  const logout=()=>{
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    
  }
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo on the left */}
      <Link to='/'><img src={assets.logo} className="w-36" alt="Logo" /></Link>

      {/* Navigation links (visible on medium and larger screens) */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {/* NavLink for Home */}
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          {/* Decorative line, hidden by default */}
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {/* NavLink for Collection */}
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {/* NavLink for About */}
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {/* NavLink for Contact */}
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Icons section (e.g., search, profile, cart, menu) */}
      <div className="flex items-center gap-6">
        {/* Search icon */}
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />

        {/* Profile icon with dropdown menu */}
        <div className="group relative">
         <img onClick={()=>token?null:navigate('/login  ')} src={assets.profile_icon} className="w-5 cursor-pointer" alt="" />
          {/* DropDown Menu */}
          {token && 
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            {/* Dropdown menu items */}
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>}
        </div>

        {/* Cart icon with item count badge */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">{getCartCount()}</p>
        </Link>

        {/* Menu icon for small screens */}
        <img
          onClick={() => setShowSearch(true)} // Opens the sidebar menu
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          {/* Close button for the sidebar */}
          <div
            onClick={() => setVisible(false)} // Closes the sidebar
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>

          {/* Sidebar NavLinks with onClick to close sidebar on navigation */}
          <NavLink onClick={() => setVisible(false)} to="/" className="py-2 pl-6 border">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/collection" className="py-2 pl-6 border">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/about" className="py-2 pl-6 border">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/contact" className="py-2 pl-6 border">
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
