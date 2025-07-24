import React, { useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch, FiBell } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { FiUser } from "react-icons/fi";

function Navbar({ onMenuClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log('Logged out');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 w-full px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <GiHamburgerMenu
          className="block sm:hidden cursor-pointer text-gray-600 text-xl"
          onClick={onMenuClick}
        />
        <span className="text-xl font-semibold text-gray-900">Dashboard</span>
      </div>
      <div className="relative">
        <div
          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Dealport</div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute -right-5 w-34 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-2 text-xs text-gray-500">Mark@thedesigner...</div>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              Logout <TbLogout2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;