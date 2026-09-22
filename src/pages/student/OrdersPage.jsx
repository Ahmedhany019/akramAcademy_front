import React from "react";
import { useGetOrdersQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Badge from "../../components/common/Badge";
import { formatDate, formatPrice } from "../../utils/cn";

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const orders = ordersData?.data || ordersData || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">مدفوع ومفعل</Badge>;
      case "awaiting_payment":
        return <Badge variant="warning">في انتظار السداد</Badge>;
      case "pending":
        return <Badge variant="warning">قيد المراجعة</Badge>;
      case "cancelled":
        return <Badge variant="danger">ملغي</Badge>;
      case "expired":
        return <Badge variant="danger">منتهي</Badge>;
      default:
        return <Badge variant="neutral">{status || "-"}</Badge>;
    }
  };

  const columns = [
    {
      header: "رقم الطلب",
      accessor: "id",
      render: (row) => (
        <span className="font-mono font-bold text-primary">#{row.id}</span>
      ),
    },
    {
      header: "الخطة",
      accessor: "planName",
      render: (row) => (
        <span className="font-bold text-primary">
          {row.plan_name || row.planName || "-"}
        </span>
      ),
    },
    {
      header: "المبلغ",
      accessor: "amount",
      render: (row) => (
        <span className="font-bold text-cyanAccent">
          {formatPrice(row.amount || row.price)}
        </span>
      ),
    },
    {
      header: "تاريخ الطلب",
      accessor: "created_at",
      render: (row) => formatDate(row.created_at),
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
        title="طلباتي"
        subtitle="متابعة حالة طلبات الاشتراك وتأكيد الدفع"
        breadcrumbs={[{ label: "الرئيسية", href: "/" }, { label: "الطلبات" }]}
      />

      <Table
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyMessage="لا توجد طلبات سابقة حتى الآن"
      />
    </div>
  );
}
