import React from "react";
import { useGetDashboardQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import RevenueChart from "../../components/charts/RevenueChart";
import SubscriptionsChart from "../../components/charts/SubscriptionsChart";
import Skeleton from "../../components/common/Skeleton";
import { formatPrice } from "../../utils/cn";

export default function AdminReportsPage() {
  const { data: dashData, isLoading } = useGetDashboardQuery();
  const stats = dashData?.data || dashData || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="تقارير الأداء والإحصائيات"
        subtitle="ملخص المؤشرات الحيوية للمنصة ومعدلات النمو"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-soft">
          <p className="text-xs text-textSecondary font-bold">إجمالي الطلاب</p>
          <p className="text-2xl font-black text-primary mt-2">
            {isLoading ? <Skeleton className="h-7 w-16" /> : stats.totalStudents ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-soft">
          <p className="text-xs text-textSecondary font-bold">الاشتراكات النشطة</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {isLoading ? <Skeleton className="h-7 w-16" /> : stats.activeSubscriptions ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-soft">
          <p className="text-xs text-textSecondary font-bold">إجمالي الإيرادات</p>
          <p className="text-2xl font-black text-cyanAccent mt-2">
            {isLoading ? <Skeleton className="h-7 w-20" /> : formatPrice(stats.totalRevenue ?? 0)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-soft">
          <p className="text-xs text-textSecondary font-bold">إجمالي الدروس</p>
          <p className="text-2xl font-black text-primary mt-2">
            {isLoading ? <Skeleton className="h-7 w-16" /> : stats.totalLessons ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-bold text-primary mb-4">
            النمو المالي والشهري
          </h3>
          <RevenueChart data={stats.revenueChart} />
        </div>

        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-bold text-primary mb-4">
            توزيع الاشتراكات على الصفوف
          </h3>
          <SubscriptionsChart data={stats.subscriptionsChart} />
        </div>
      </div>
    </div>
  );
}
