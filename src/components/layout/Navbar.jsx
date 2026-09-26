import React from "react";
import { Menu, UserCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, toggleDesktopSidebar } from "../../redux/slices/uiSlice";
import { logo2 } from "../../assets/images";

export default function Navbar({ title }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-surface-border px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Universal toggle button for mobile drawer and desktop collapse */}
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              dispatch(toggleDesktopSidebar());
            } else {
              dispatch(toggleSidebar());
            }
          }}
          className="p-2 lg:hidden rounded-xl text-primary hover:text-cyanAccent hover:bg-cyan-50/50 transition-colors"
          title="فتح / إغلاق القائمة الجانبية"
        >
          <Menu className="w-6 h-6" />
        </button>
        {title && (
          <h2 className="text-base font-bold text-primary hidden sm:block">
            {title}
          </h2>
        )}
      </div>

      {/* User profile capsule and portal switcher */}
      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <a
            href={window.location.pathname.startsWith("/admin") ? "/student" : "/admin"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-primary/5 hover:bg-cyanAccent hover:text-white text-primary border border-surface-border hover:border-cyanAccent"
          >
            {window.location.pathname.startsWith("/admin")
              ? "🎓 عرض منصة الطالب"
              : "⚙️ لوحة الإدارة"}
          </a>
        )}
        <div className="flex items-center gap-2.5 bg-gray-50 border border-surface-border px-3 py-1.5 rounded-xl">
          <UserCircle className="w-6 h-6 text-primary" />
          <div className="text-right">
            <p className="text-xs font-bold text-primary leading-tight">
              {user?.name || "المستخدم"}
            </p>
            <p className="text-[10px] text-textSecondary leading-tight">
              {user?.role === "admin" ? "مدير النظام" : "طالب"}
            </p>
          </div>
        </div>
        <img src={logo2} alt="Logo" className=" w-[70px] object-contain" />
      </div>
    </header>
  );
}
