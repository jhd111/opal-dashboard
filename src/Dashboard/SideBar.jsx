import { useState } from "react";
import logo from "../assets/opal_logo.png";
import cart from "../assets/cart.png"
import users from "../assets/users.png"
import card from "../assets/card-outline.png"
import productlist from "../assets/product-list.png"
import { IoClose } from "react-icons/io5";
import home from "../assets/home.png"
import icon from "../assets/Icon.png"
import { call } from "../assets/index";
import { useNavigate } from "react-router-dom";

import { 
  FiHome, 
  FiShoppingCart, 
  FiCalendar, 
  FiCreditCard,
  FiPlus,
  FiList,
  FiUser,
  FiSettings 
} from "react-icons/fi";

function SideBar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/dashboard/orders"); // Set default active tab

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block w-[21%] bg-white  sticky top-0 shadow-lg" 
           style={{ 
             boxShadow: '0 3px 4px 0 rgba(0, 0, 0, 0.12)' 
           }}>
        <div className="flex flex-col py-6 px-4">
          {/* Logo Section */}
          <div className="flex justify-start items-center gap-2 mb-8">
            <img src={logo} alt="logo" className="w-44 h-8" />
           
          </div>

          {/* Main Menu Section */}
          <div className="mb-8">
          <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">Main Menue</h3>
            <div className="flex flex-col gap-1">
              <div 
              onClick={() => {
                navigate('/dashboard');
                setActiveTab("/dashboard");
              }}
              className={`flex items-center gap-3 p-3  lato font-bold  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>
                <img src={home} alt="" className="w-5 h-5"/>
                <span className="font-medium">Dashboard</span>
              </div>
              <div 
              onClick={() => {
                navigate('/dashboard/orders')
                setActiveTab('/dashboard/orders')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/orders"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>
              <img src={cart} alt="" className="w-5 h-5"/>
                <span>Order Management</span>
              </div>
              <div
              onClick={() => {
                navigate('/dashboard')
                setActiveTab('/dashboard')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>
             
              <img src={card} alt="" className="w-5 h-5"/>
                <span>Payfast Payments</span>
              </div>
              <div
              
              onClick={() => {
                navigate('/dashboard/transactions')
                setActiveTab('/dashboard/transactions')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/transactions"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>
                <img src={card} alt="" className="w-5 h-5"/>
                <span>Transaction</span>
              </div>
              <div 
              
              onClick={() => {
                navigate('/dashboard/contact')
                setActiveTab('/dashboard/contact')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/contact"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>
                <img src={call} alt="" className="w-5 h-5"/>
                <span>Contact us queries</span>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="mb-8">
            <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">Product</h3>
            <div className="flex flex-col gap-1">
              <div 
              
              onClick={() => {
                navigate('/dashboard/deals')
                setActiveTab('/dashboard/deals')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/deals"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>                
                <FiPlus className="w-5 h-5" />
                <span>Add Deals</span>
              </div>
              <div
              
              onClick={() => {
                navigate('/dashboard/productlist')
                setActiveTab('/dashboard/productlist')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/productlist"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>  
                            <img src={productlist} alt="" className="w-5 h-5"/>
                <span>Product List</span>
              </div>
              <div
              
              onClick={() => {
                navigate('/dashboard/voucher')
                setActiveTab('/dashboard/voucher')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/voucher"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>                  <img src={productlist} alt="" className="w-5 h-5"/>
                <span>IT Vouchers</span>
              </div>
              <div
               onClick={() => {
                navigate('/dashboard/testingservices')
                setActiveTab('/dashboard/testingservices')
              }}
              className=
              {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
              ${
                activeTab === "/dashboard/testingservices"
                  ? "bg-[#3651BF] text-white"
                  : "text-[#6A717F] hover:bg-gray-50"
              }
              `}>                 <img src={productlist} alt="" className="w-5 h-5"/>
                <span>Testing Services</span>
              </div>
            </div>
          </div>

           {/* Manage Section */}
           <div className="mb-8">
            <h3 className="text-sm font-mono lato text-[#6A717F] mb-3">Manage</h3>
            <div className="flex flex-col gap-1">
              <div 
             
              
              onClick={() => {
               navigate('/dashboard/media')
               setActiveTab('/dashboard/media')
             }}
             className=
             {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/media"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}>                   <FiPlus className="w-5 h-5" />
                <span>Upload Media</span>
              </div>
              <div
              
              
              onClick={() => {
               navigate('/dashboard/result')
               setActiveTab('/dashboard/result')
             }}
             className=
             {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/result"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}>   
<FiPlus className="w-5 h-5" />
                <span>Add Results</span>
              </div>
              <div
              
              onClick={() => {
               navigate('/dashboard/paymentinformation')
               setActiveTab('/dashboard/paymentinformation')
             }}
             className=
             {`flex items-center gap-3 p-3  lato  rounded-lg cursor-pointer 
             ${
               activeTab === "/dashboard/paymentinformation"
                 ? "bg-[#3651BF] text-white"
                 : "text-[#6A717F] hover:bg-gray-50"
             }
             `}>   
<img src={card} alt="" className="w-5 h-5"/>
                <span>Update Payment Details</span>
              </div>
             
            </div>
          </div>

          {/* Admin Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Admin</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 lato text-[#6A717F] hover:bg-gray-50 rounded-lg cursor-pointer">
                <img src={icon} className="w-5 h-5" />
                <span>Admin role</span>
              </div>
              <div className="flex items-center gap-3 p-3 lato text-[#6A717F] hover:bg-gray-50 rounded-lg cursor-pointer">
                <FiSettings className="w-5 h-5" />
                <span>Control Authority</span>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Dealport</div>
                <div className="text-xs text-gray-500">Mark@thedesigner...</div>
              </div>
              <div className="w-4 h-4 text-gray-400">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a6 6 0 0 1 6 6H2a6 6 0 0 1 6-6Z" />
                </svg>
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
          boxShadow: '0 3px 4px 0 rgba(0, 0, 0, 0.12)' 
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
            <span className="text-xl font-bold text-[#4285f4]">OPAL INSTITUTE</span>
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