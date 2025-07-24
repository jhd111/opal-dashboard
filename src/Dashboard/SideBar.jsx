import { useState } from "react";
import logo from "../assets/opal_logo.png";
import cart from "../assets/cart.png";
import users from "../assets/users.png";
import card from "../assets/card-outline.png";
import productlist from "../assets/product-list.png";
import { IoClose } from "react-icons/io5";
import home from "../assets/home.png";
import icon from "../assets/Icon.png";
import { call } from "../assets/index";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
// import {home} from "../assets/index"

import {
  FiHome,
  FiShoppingCart,
  FiCalendar,
  FiCreditCard,
  FiPlus,
  FiList,
  FiUser,
  FiSettings,
} from "react-icons/fi";

function SideBar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/dashboard"); // Set default active tab

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden sm:block w-[21%] bg-white  sticky top-0 shadow-lg"
        style={{
          boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="flex flex-col py-6 px-4">
          {/* Logo Section */}
          <div className="flex justify-start items-center gap-2 mb-8">
            <img src={logo} alt="logo" className="w-44 h-8" />
          </div>

          {/* Main Menu Section */}
          <div className="mb-8">
            <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">
              Main Menue
            </h3>
            <div className="flex flex-col gap-1">
              <div
                onClick={() => {
                  navigate("/dashboard");
                  setActiveTab("/dashboard");
                }}
                className={`flex items-center gap-3 p-3  lato font-bold  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <span className="w-5 h-5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.2 2.65C12.8538 2.39036 12.4327 2.25 12 2.25C11.5673 2.25 11.1462 2.39036 10.8 2.65L3.8 7.9C3.55161 8.08629 3.35 8.32786 3.21115 8.60557C3.07229 8.88328 3 9.18951 3 9.5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8.9C9.19174 21 9.47153 20.8841 9.67782 20.6778C9.88411 20.4715 10 20.1917 10 19.9V15C10 14.4696 10.2107 13.9609 10.5858 13.5858C10.9609 13.2107 11.4696 13 12 13C12.5304 13 13.0391 13.2107 13.4142 13.5858C13.7893 13.9609 14 14.4696 14 15V19.9C14 20.1917 14.1159 20.4715 14.3222 20.6778C14.5285 20.8841 14.8083 21 15.1 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9.5C21 9.18951 20.9277 8.88328 20.7889 8.60557C20.65 8.32786 20.4484 8.08629 20.2 7.9L13.2 2.65Z"
                      fill={`${
                        activeTab === "/dashboard"
                          ? " white"
                          : "#6A717F"
                      }`}
                    />
                  </svg>
                </span>
                <span className="font-medium">Dashboard</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/orders");
                  setActiveTab("/dashboard/orders");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/orders"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <img src={cart} alt="" className="w-5 h-5" />
                <span>Order Management</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard");
                  setActiveTab("/dashboard");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <img src={card} alt="" className="w-5 h-5" />
                <span>Payfast Payments</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/transactions");
                  setActiveTab("/dashboard/transactions");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/transactions"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <img src={card} alt="" className="w-5 h-5" />
                <span>Transaction</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/contact");
                  setActiveTab("/dashboard/contact");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/contact"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <img src={call} alt="" className="w-5 h-5" />
                <span>Contact us queries</span>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="mb-8">
            <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">
              Product
            </h3>
            <div className="flex flex-col gap-1">
              <div
                onClick={() => {
                  navigate("/dashboard/deals");
                  setActiveTab("/dashboard/deals");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/deals"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Deals</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/productlist");
                  setActiveTab("/dashboard/productlist");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/productlist"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                <img src={productlist} alt="" className="w-5 h-5" />
                <span>Product List</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/voucher");
                  setActiveTab("/dashboard/voucher");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/voucher"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                {" "}
                <img src={productlist} alt="" className="w-5 h-5" />
                <span>IT Vouchers</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/testingservices");
                  setActiveTab("/dashboard/testingservices");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/testingservices"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}
              >
                {" "}
                <img src={productlist} alt="" className="w-5 h-5" />
                <span>Testing Services</span>
              </div>
            </div>
          </div>

          {/* Manage Section */}
          <div className="mb-8">
            <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">
              Manage
            </h3>
            <div className="flex flex-col gap-1">
              <div
                onClick={() => {
                  navigate("/dashboard/media");
                  setActiveTab("/dashboard/media");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/media"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}
              >
                {" "}
                <FiPlus className="w-5 h-5" />
                <span>Upload Media</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/result");
                  setActiveTab("/dashboard/result");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/result"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Results</span>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/paymentinformation");
                  setActiveTab("/dashboard/paymentinformation");
                }}
                className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/paymentinformation"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}
              >
                <img src={card} alt="" className="w-5 h-5" />
                <span>Update Payment Details</span>
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Admin</h3>
            <div className="flex flex-col gap-1">
              <div 
              onClick={() => {
                navigate("/dashboard/admin-profile");
                setActiveTab("/dashboard/admin-profile");
              }}
              className={`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
           ${
             activeTab === "/dashboard/admin-profile"
               ? "bg-[#3651BF] text-white"
               : "text-[#6A717F] hover:bg-gray-50"
           }
           `}
              
              
              // className="flex items-center gap-3 p-3 lato text-[#6A717F] hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <img src={icon} className="w-5 h-5" />
                <span>Admin Profile</span>
              </div>
              {/* <div className="flex items-center gap-3 p-3 lato text-[#6A717F] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiSettings className="w-5 h-5" />
                <span>Control Authority</span>
              </div> */}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Dealport
                </div>
                <div className="text-xs text-gray-500">Mark@thedesigner...</div>
              </div>
              <div className="w-4 h-4 text-gray-400">
              <TbLogout2 />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full z-50 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:hidden`}
        style={{
          boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="p-4">
          {/* Close Button */}
          <IoClose
            className="text-2xl cursor-pointer mb-6 ml-auto"
            onClick={() => setIsOpen(false)}
          />

          {/* Logo Section */}
          <div className="flex justify-start items-center gap-2 mb-8">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-[#4285f4]">
              OPAL INSTITUTE
            </span>
          </div>

          {/* Main Menu Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 bg-[#4285f4] text-white rounded-lg cursor-pointer">
                <FiHome className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiShoppingCart className="w-5 h-5" />
                <span>Order Management</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiCalendar className="w-5 h-5" />
                <span>Bookings</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiCreditCard className="w-5 h-5" />
                <span>Transaction</span>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Product</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiPlus className="w-5 h-5" />
                <span>Add Products</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiList className="w-5 h-5" />
                <span>Product List</span>
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Admin</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiUser className="w-5 h-5" />
                <span>Admin role</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-[#6B7280] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiSettings className="w-5 h-5" />
                <span>Control Authority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
