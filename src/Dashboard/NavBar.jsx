import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch, FiBell } from "react-icons/fi";

function Navbar({ onMenuClick }) {
  return (
    <div className="bg-white border-b border-gray-200 w-full px-6 py-4 flex justify-between items-center">
      {/* Left Side - Hamburger & Title */}
      <div className="flex items-center gap-3">
        <GiHamburgerMenu 
          className="block sm:hidden cursor-pointer text-gray-600 text-xl" 
          onClick={onMenuClick}
        />
        <span className="text-xl font-semibold text-gray-900">Dashboard</span>
      </div>

      {/* Right Side - Search & Notification */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search data, users, or reports" 
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          <FiSearch className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="relative">
          <FiBell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
          <img 
            src="https://via.placeholder.com/32x32" 
            alt="user avatar" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;