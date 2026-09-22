import React from "react";
import { useGetSubscriptionsQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/cn";

export default function SubscriptionsPage() {
  const { data: subsData, isLoading } = useGetSubscriptionsQuery();
  const subscriptions = subsData?.data || subsData || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="success">نشط</Badge>;
      case "pending":
        return <Badge variant="warning">قيد الانتظار</Badge>;
      case "expired":
        return <Badge variant="danger">منتهي</Badge>;
      case "cancelled":
        return <Badge variant="danger">ملغي</Badge>;
      default:
        return <Badge variant="neutral">{status || "-"}</Badge>;
    }
  };

  const columns = [
    {
      header: "الخطة",
      accessor: "plan_name",
      render: (row) => (
        <span className="font-bold text-primary">
          {row.plan_name || "-"}
        </span>
      ),
    },
    {
      header: "الصف الدراسي",
      accessor: "class_name",
      render: (row) => row.class_name || "-",
    },
    {
      header: "تاريخ البداية",
      accessor: "startDate",
      render: (row) => formatDate(row.start_date),
    },
    {
      header: "تاريخ النهاية",
      accessor: "endDate",
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
        title="اشتراكاتي"
        subtitle="عرض وتتبع الاشتراكات المفعلة والسابقة"
        breadcrumbs={[{ label: "الرئيسية", href: "/" }, { label: "الاشتراكات" }]}
      />

      <Table
        columns={columns}
        data={subscriptions}
        isLoading={isLoading}
        emptyMessage="لا توجد اشتراكات مسجلة لحسابك حالياً"
      />
    </div>
  );
}
