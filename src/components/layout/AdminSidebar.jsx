import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Calendar,
  CreditCard,
  Users,
  CheckSquare,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  FolderKanban,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toggleDesktopSidebar } from "../../redux/slices/uiSlice";
import { useLogoutMutation } from "../../redux/api/apiSlice";
import { logo, logo2 } from "../../assets/images";
import { cn } from "../../utils/cn";

export default function AdminSidebar({ onItemClick }) {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const collapsed = useSelector((state) => state.ui.desktopSidebarCollapsed);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore
    } finally {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  const navLinks = [
    { to: "/admin", label: "الرئيسية", icon: LayoutDashboard, end: true },
    { to: "/admin/classes", label: "إدارة الفصول", icon: FolderKanban },
    { to: "/admin/units", label: "الأقسام", icon: Layers },
    { to: "/admin/lessons", label: "الدروس", icon: BookOpen },
    { to: "/admin/periods", label: "الفترات الدراسية", icon: Calendar },
    { to: "/admin/subscription-plans", label: "خطط الاشتراك", icon: CreditCard },
    { to: "/admin/students", label: "الطلاب", icon: Users },
    { to: "/admin/subscriptions", label: "الاشتراكات", icon: CheckSquare },
    { to: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
    { to: "/student", label: "منصة الطلاب", icon: GraduationCap },
    // { to: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-primary text-white rounded-l-[20px] flex flex-col h-full transition-all duration-300 ease-in-out select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <span className="text-[10px] bg-cyanAccent/20 text-cyanAccent font-bold px-2 py-0.5 rounded-full border border-cyanAccent/30 whitespace-nowrap">
            الإدارة
          </span>
        </div>

        {/* Mini logo when collapsed */}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-cyanAccent border border-white/10 mx-auto">
            أ
          </div>
        )}

        {/* Desktop collapse toggle button */}
        <button
          type="button"
          onClick={() => dispatch(toggleDesktopSidebar())}
          className={cn(
            "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden lg:flex items-center justify-center",
            collapsed && "mx-auto mt-2"
          )}
          title={collapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {collapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto p-3 pl-0 space-y-1">
        {/* Management Links */}
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onItemClick}
              title={collapsed ? link.label : ""}
              className={({ isActive }) =>
                cn(
                  "flex items-center w-full gap-3 px-3 py-2.5 rounded-r-full text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-0" : "",
                  isActive
                    ? "bg-surface-bg text-primary font-bold shadow-xs"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          title={collapsed ? "خروج" : ""}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-600/20 transition-all duration-200",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 text-rose-400 flex-shrink-0" />
          {!collapsed && <span className="truncate">خروج</span>}
        </button>
      </div>
    </aside>
  );
}
