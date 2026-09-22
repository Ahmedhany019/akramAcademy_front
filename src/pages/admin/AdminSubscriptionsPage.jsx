import React, { useState } from "react";
import { useGetSubscriptionsQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/cn";

export default function AdminSubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState("");

  const { data: subsData, isLoading } = useGetSubscriptionsQuery();
  const subscriptions = subsData?.data || subsData || [];

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub?.status?.toLowerCase().includes(statusFilter.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="success">نشط</Badge>;
      case "pending":
        return <Badge variant="warning">قيد الانتظار</Badge>;
      case "expired":
        return <Badge variant="danger">منتهي</Badge>;
      case "cancelled":
        return <Badge variant="neutral">ملغي</Badge>;
      default:
        return <Badge variant="neutral">{status || "-"}</Badge>;
    }
  };

  const columns = [
    {
      header: "الطالب",
      accessor: "student",
      render: (row) => (
        <span className="font-bold text-primary">
          {row?.student_name || "-"}
        </span>
      ),
    },
    {
      header: "الخطة",
      accessor: "plan_name",
      render: (row) => row.plan_name || "-",
    },
    {
      header: "تاريخ البداية",
      accessor: "start_date",
      render: (row) => formatDate(row.start_date),
    },
    {
      header: "تاريخ النهاية",
      accessor: "end_date",
      render: (row) => formatDate(row.end_date),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الاشتراكات"
        subtitle="متابعة وتصفية جميع اشتراكات الطلاب على المنصة"
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-white p-4 border border-surface-border rounded-2xl shadow-soft">
        <label className="text-xs font-bold text-primary">تصفية بالحالة:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 border border-surface-border rounded-xl text-xs font-semibold text-primary"
        >
          <option value="">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="pending">قيد الانتظار</option>
          <option value="expired">منتهي</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={filteredSubscriptions}
        isLoading={isLoading}
        emptyMessage="لا توجد اشتراكات مطابقة"
      />
    </div>
  );
}
