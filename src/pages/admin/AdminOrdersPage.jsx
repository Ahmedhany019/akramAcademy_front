import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../../utils/cn";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orderToApprove, setOrderToApprove] = useState(null);
  const [orderToReject, setOrderToReject] = useState(null);
  const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation();

 const [statusFilter, setStatusFilter] = useState("");

const { data: ordersData, isLoading } = useGetOrdersQuery();

const orders = ordersData?.data || ordersData || [];

const filteredOrders = statusFilter
  ? orders.filter((order) => order.status === statusFilter)
  : orders;

  const handleApprove = async () => {
    if (!orderToApprove) return;
    try {
      await approveOrder(orderToApprove.id).unwrap();
      setOrderToApprove(null);
    } catch {
      alert("حدث خطأ أثناء تفعيل الطلب");
    }
  };

  const handleReject = async () => {
    if (!orderToReject) return;
    try {
      await rejectOrder(orderToReject.id).unwrap();
      setOrderToReject(null);
    } catch {
      alert("حدث خطأ أثناء إلغاء/رفض الطلب");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">مدفوع ومفعل</Badge>;
      case "awaiting_payment":
        return <Badge variant="warning">في انتظار السداد</Badge>;
      case "pending":
        return <Badge variant="warning">قيد المراجعة</Badge>;
      case "cancelled":
        return <Badge variant="danger">ملغي / مرفوض</Badge>;
      case "expired":
        return <Badge variant="neutral">منتهي</Badge>;
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
      header: "الطالب",
      accessor: "student",
      render: (row) => (
        <Link
          to={`/admin/students/${row.student_id || row.studentId || row.user?.id}`}
          className="font-bold text-primary hover:text-cyanAccent hover:underline transition-colors"
        >
          {row.user?.name || row.studentName || row.student_name || "-"}
        </Link>
      ),
    },
    {
      header: "خطة الاشتراك",
      accessor: "plan",
      render: (row) => row.plan?.name || row.planName || row.plan_name || "-",
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
      header: "الحالة",
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt",
      render: (row) => formatDate(row.createdAt || row.created_at),
    },
    {
      header: "الإجراءات",
      accessor: "actions",
      render: (row) =>
        row.status !== "paid" && row.status !== "cancelled" ? (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-xs py-1"
              onClick={() => setOrderToApprove(row)}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              قبول
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 text-xs py-1"
              onClick={() => setOrderToReject(row)}
            >
              <XCircle className="w-3.5 h-3.5" />
              رفض
            </Button>
          </div>
        ) : row.status === "paid" ? (
          <span className="text-xs text-emerald-600 font-semibold">مفعل</span>
        ) : (
          <span className="text-xs text-rose-500 font-semibold">ملغي</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة طلبات الاشتراك"
        subtitle="متابعة أوامر الشراء والاشتراكات المطلوب تفعيلها"
      />

      <div className="flex items-center gap-3 bg-white p-4 border border-surface-border rounded-2xl shadow-soft">
        <label className="text-xs font-bold text-primary">تصفية بحالة الطلب:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 border border-surface-border rounded-xl text-xs font-semibold text-primary"
        >
          <option value="">جميع الطلبات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="awaiting_payment">في انتظار السداد</option>
          <option value="paid">مدفوع ومفعل</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        emptyMessage="لا توجد طلبات مطابقة"
      />

      <ConfirmModal
        isOpen={!!orderToApprove}
        onClose={() => setOrderToApprove(null)}
        onConfirm={handleApprove}
        title="تأكيد تفعيل الطلب والاشتراك"
        message={`هل أنت متأكد من تأكيد سداد الطلب رقم #${orderToApprove?.id} للطالب "${orderToApprove?.student_name || orderToApprove?.studentName || orderToApprove?.user?.name || ""}"؟ سيتم تفعيل اشتراك الطالب فوراً.`}
        confirmText="تأكيد وتفعيل"
        isLoading={isApproving}
      />

      <ConfirmModal
        isOpen={!!orderToReject}
        onClose={() => setOrderToReject(null)}
        onConfirm={handleReject}
        title="تأكيد رفض / إلغاء الطلب"
        message={`هل أنت متأكد من رفض الطلب رقم #${orderToReject?.id} للطالب "${orderToReject?.student_name || orderToReject?.studentName || orderToReject?.user?.name || ""}"؟ سيتم تحويل حالة الطلب إلى ملغي.`}
        confirmText="تأكيد الرفض"
        isLoading={isRejecting}
      />
    </div>
  );
}
