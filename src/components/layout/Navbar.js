 

import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
 
import logo from '../../assets/bhce-logo.gif';

 
import { AuthContext } from '../../context/AuthContext';


const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const activeClass =
    "text-yellow-600 border-b-2 border-yellow-600 pb-1";

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-12 w-auto" />
          <span className="font-semibold text-lg text-gray-800 hidden sm:block">
            BCE BHAGALPUR
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : "hover:text-yellow-600")}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : "hover:text-yellow-600")}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? activeClass : "hover:text-yellow-600")}>
            Contact
          </NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {!user && (
            <>
               
              <NavLink
               to="/login"
               className={({ isActive }) =>
                 `px-4 py-2 text-sm border rounded-lg transition-all ${
                isActive
                 ? "text-yellow-600 border-yellow-600"
                 : "text-black border-gray-300 hover:text-yellow-600"
                    }` 
                }
                >
                   Login
                     </NavLink>
                     <NavLink
               to="/signup"
               className={({ isActive }) =>
                 `px-4 py-2 text-sm border rounded-lg transition-all ${
                isActive
                 ? "text-yellow-600 border-yellow-600"
                 : "text-black border-gray-300 hover:text-yellow-600"
                    }` 
                }
                >
                   Sign Up
                     </NavLink>

               
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
              >
                <FaUserCircle size={20} />
                <span className="hidden sm:block text-sm capitalize">
                  {user.role}
                </span>
                <FaChevronDown size={12} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                  <Link
                    to={`/${user.role}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="block">
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="block">
            Contact
          </NavLink>

          {user && (
            <NavLink to={`/${user.role}`} onClick={() => setMenuOpen(false)} className="block">
              Dashboard
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

