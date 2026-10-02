import React, { useState, useRef, useEffect } from "react";
import { Bell, BookOpen, Check, Trash2, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "../../redux/api/apiSlice";
import Spinner from "../common/Spinner";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data: notificationsData, isLoading } = useGetNotificationsQuery(
    undefined,
    {
      pollingInterval: 15000,
    }
  );

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount ?? notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await markAsRead(notif.id).unwrap();
      } catch (err) {
        // ignore
      }
    }
    setIsOpen(false);
    if (notif.lesson_id) {
      navigate(`/lessons/${notif.lesson_id}`);
    } else if (notif.order_id) {
      if (window.location.pathname.startsWith("/admin")) {
        navigate("/admin/orders");
      } else {
        navigate("/orders");
      }
    }
  };

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      // ignore
    }
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    try {
      await deleteNotification(notifId).unwrap();
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-primary bg-gray-50 border border-surface-border hover:bg-cyan-50/50 hover:text-cyanAccent transition-all"
        title="الإشعارات"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-68 sm:w-96 bg-white rounded-2xl shadow-xl border border-surface-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-right">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                تعيين الكل كمقروء
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-surface-border">
            {isLoading ? (
              <div className="py-8 flex justify-center items-center">
                <Spinner size="sm" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center space-y-1 text-textSecondary">
                <Bell className="w-7 h-7 mx-auto text-gray-300 mb-1" />
                <p className="text-xs font-bold text-gray-600">لا توجد إشعارات</p>
                <p className="text-[11px]">ستصلك إشعارات عند إضافة تعليقات أو ردود جديدة</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => {
                const isAdminSender = notif.sender_role === "admin";
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 transition-colors cursor-pointer hover:bg-gray-50/80 flex items-start gap-3 ${
                      !notif.is_read ? "bg-cyan-50/20" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        isAdminSender
                          ? "bg-primary text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isAdminSender ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {notif.sender_name}
                          </span>
                          {isAdminSender && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary text-white">
                              معلم
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notif.is_read && (
                            <span className="w-2 h-2 rounded-full bg-cyanAccent" />
                          )}
                          <button
                            onClick={(e) => handleDelete(e, notif.id)}
                            className="text-gray-300 hover:text-red-500 p-0.5 rounded transition-colors"
                            title="حذف الإشعار"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-snug line-clamp-2">
                        {notif.title}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-textSecondary pt-0.5">
                        {notif.lesson_title && (
                          <span className="inline-flex items-center gap-1 text-primary font-semibold truncate max-w-[170px]">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            {notif.lesson_title}
                          </span>
                        )}
                        <span>
                          {notif.created_at &&
                            new Date(notif.created_at).toLocaleDateString("ar-EG", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
