import React from "react";
import PageHeader from "../../components/common/PageHeader";
import { User, Phone, Mail, GraduationCap } from "lucide-react";
import {
  useGetSubscriptionsQuery,
  useGetOrdersQuery,
  useGetMeQuery,
} from "../../redux/api/apiSlice";

export default function ProfilePage() {
  const { data: meData } = useGetMeQuery();
  const { data: subsData } = useGetSubscriptionsQuery();
  const { data: ordersData } = useGetOrdersQuery();

  const user = meData?.data?.user || meData?.user || {};
  const subscriptions = subsData?.data || subsData || [];
  const orders = ordersData?.data || ordersData || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الملف الشخصي"
        subtitle="بيانات الحساب والاشتراكات المرتبطة"
        breadcrumbs={[{ label: "الرئيسية", href: "/" }, { label: "الملف الشخصي" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white border border-surface-border rounded-2xl p-6 shadow-soft text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-primary">{user.name || "-"}</h2>
          <p className="text-xs text-textSecondary mt-1">
            {user.role === "admin" ? "مدير النظام" : "طالب"}
          </p>

          <div className="mt-6 pt-6 border-t border-surface-border space-y-3 text-right">
            <div className="flex items-center gap-2.5 text-xs text-textSecondary">
              <Phone className="w-4 h-4 text-cyanAccent" />
              <span>رقم الطالب: {user.phone || "-"}</span>
            </div>
            {user.profile?.parent_phone && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>رقم ولي الأمر: {user.profile.parent_phone}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <Mail className="w-4 h-4 text-cyanAccent" />
                <span>البريد: {user.email}</span>
              </div>
            )}
            {user.profile?.grade_level_name && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <GraduationCap className="w-4 h-4 text-cyanAccent" />
                <span>الصف: {user.profile.grade_level_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
            <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-surface-border">
              ملخص الحساب
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-textSecondary">إجمالي الاشتراكات</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {Array.isArray(subscriptions) ? subscriptions.length : 0}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-textSecondary">إجمالي الطلبات</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {Array.isArray(orders) ? orders.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
