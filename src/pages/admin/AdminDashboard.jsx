import React from "react";
import {
  useGetDashboardQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import RevenueChart from "../../components/charts/RevenueChart";
import SubscriptionsChart from "../../components/charts/SubscriptionsChart";
import { Users, Layers, DollarSign, BookOpen } from "lucide-react";
import { formatPrice } from "../../utils/cn";

export default function AdminDashboard() {
  const { data: dashData, isLoading } = useGetDashboardQuery();
  const stats = dashData?.data || dashData || {};

  const totalStudents = stats.total_students ?? 0;
  const activeSubscriptions = stats.active_subscriptions ?? 0;
  const totalRevenue = stats.revenue ?? 0;
  const totalLessons = stats.total_lessons ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="مرحباً أستاذ أحمد 👋"
        subtitle="إدارة منصتك التعليمية من مكان واحد"
      />

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              إجمالي الطلاب
            </span>
            <div className="p-2.5 bg-cyan-50 text-cyanAccent rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-black text-primary">{totalStudents}</p>
            )}
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              الاشتراكات النشطة
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-black text-primary">
                {activeSubscriptions}
              </p>
            )}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              الإيرادات
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-black text-primary">
                {formatPrice(totalRevenue)}
              </p>
            )}
          </div>
        </div>

        {/* Total Lessons */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              إجمالي الدروس
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-black text-primary">{totalLessons}</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart.js Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-bold text-primary mb-4">
            مؤشر الإيرادات الشهرية
          </h3>
          <RevenueChart data={stats.revenueChart} />
        </div>

        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-bold text-primary mb-4">
            توزيع الاشتراكات حسب الصفوف
          </h3>
          <SubscriptionsChart data={stats.subscriptionsChart} />
        </div>
      </div>
    </div>
  );
}
