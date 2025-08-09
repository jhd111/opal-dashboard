import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Base_url from "../Base_url/Baseurl"; // adjust path if needed

function Navbar({ onMenuClick }) {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ Missing navigate hook
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${Base_url}/api/admin/logout/`,
        { email },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setShowModal(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout button click with event propagation prevention
  const handleLogoutClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Logout button clicked!"); // Debug log
    setShowModal(true);
    setIsOpen(false); // Close dropdown when modal opens
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTitle = () => {
    const pathMap = {
      "/dashboard": "Dashboard",
      "/dashboard/orders": "Orders",
      "/dashboard/transactions": "Transactions",
      "/dashboard/contact": "Contact Us",
      "/dashboard/deals": "Deals",
      "/dashboard/productlist": "Products",
      "/dashboard/voucher": "Vouchers",
      "/dashboard/media": "Media",
      "/dashboard/result": "Results",
      "/dashboard/paymentinformation": "Payments",
      "/dashboard/admin-profile": "Admin Profile",
      "/dashboard/testingservices": "Testing Services",
      "/dashboard/category":"Category",
      "/dashboard/alpha":"Alfa Pte",
      "/dashboard/inventory":"Inventory"
    };

    return pathMap[location.pathname] || "Dashboard";
  };

  return (
    <div className="bg-white border-b border-gray-200 w-full px-5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <GiHamburgerMenu
          className="block sm:hidden cursor-pointer text-gray-600 text-xl"
          onClick={onMenuClick}
        />
        <span className="text-xl font-semibold text-gray-900">{getTitle()}</span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium text-gray-900">Dealport</div>
            <FiChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="mt-2 absolute -right-2 w-34 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-2 text-xs text-gray-500">Mark@thedesigner...</div>
            <button
              onClick={handleLogoutClick} // ✅ FIXED HERE - using new handler
              className="w-full cursor-pointer text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              Logout <TbLogout2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div 
        onClick={(e) => e.stopPropagation()} // Prevent any interference
        className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
        <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={(e) => e.stopPropagation()} // Prevent any interference
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-md"> */}
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;