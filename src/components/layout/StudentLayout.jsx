import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarOpen } from "../../redux/slices/uiSlice";
import { cn } from "../../utils/cn";

export default function StudentLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <div className="flex h-screen overflow-hidden text-textPrimary">
      {/* Desktop Fixed Right Sidebar with smooth collapse transition */}
      <div className="hidden lg:block h-full flex-shrink-0 z-30 transition-all duration-300 ease-in-out">
        <StudentSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer with smooth slide and fade */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeSidebar}
        />
        <div
          className={cn(
            "relative w-64 max-w-[80vw] h-full z-10 shadow-2xl transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <StudentSidebar onItemClick={closeSidebar} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar title="بوابة الطالب" />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
