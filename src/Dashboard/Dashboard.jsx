import Navbar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom"; // For routing
import { useState } from "react";
function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    return (
      <div className="flex sm:flex-row">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Navbar with Hamburger */}
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content */}
        <div className="flex-1 bg-[#F9FAFB]  h-full p-4 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
    );
  }

export default Dashboard;

