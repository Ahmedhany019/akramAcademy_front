import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetStudentByIdQuery,
  useGetStudentOrdersAndSubscriptionsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Badge from "../../components/common/Badge";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import { User, Phone, Mail, GraduationCap } from "lucide-react";
import { formatDate, formatPrice } from "../../utils/cn";

export default function AdminStudentDetailsPage() {
  const { id } = useParams();
  const { data: studentData, isLoading: isStudentLoading, error, refetch } = useGetStudentByIdQuery(id);
  const { data: ordersSubsData, isLoading: isOrdersSubsLoading } = useGetStudentOrdersAndSubscriptionsQuery(id);

  const student = studentData?.data || studentData;
  const subscriptions = ordersSubsData?.data?.subscriptions || [];
  const orders = ordersSubsData?.data?.orders || [];

  if (isStudentLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <ErrorState
        title="تعذر العثور على بيانات الطالب"
        message="قد يكون هذا الحساب غير متوفر أو تم حذفه."
        onRetry={refetch}
      />
    );
  }

  const subColumns = [
    {
      header: "الخطة",
      accessor: "plan",
      render: (row) => (
        <div>
          <div className="font-bold text-primary">{row.plan_name || row.plan?.name || "خطة دراسية"}</div>
          {row.class_name && (
            <div className="text-[11px] text-textSecondary">{row.class_name}</div>
          )}
        </div>
      ),
    },
    {
      header: "البداية",
      accessor: "startDate",
      render: (row) => formatDate(row.start_date || row.startDate),
    },
    {
      header: "النهاية",
      accessor: "endDate",
      render: (row) => formatDate(row.end_date || row.endDate),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "نشط" : row.status}
        </Badge>
      ),
    },
  ];

  const orderColumns = [
    {
      header: "رقم الطلب",
      accessor: "id",
      render: (row) => `#${row.id}`,
    },
    {
      header: "الخطة",
      accessor: "plan",
      render: (row) => (
        <div>
          <div className="font-bold text-primary">{row.plan_name || row.plan?.name || "طلب"}</div>
          {row.class_name && (
            <div className="text-[11px] text-textSecondary">{row.class_name}</div>
          )}
        </div>
      ),
    },
    {
      header: "المبلغ",
      accessor: "amount",
      render: (row) => formatPrice(row.amount || row.price),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => (
        <Badge
          variant={
            row.status === "paid"
              ? "success"
              : row.status === "cancelled"
              ? "danger"
              : "warning"
          }
        >
          {row.status === "paid"
            ? "مدفوع ومفعل"
            : row.status === "cancelled"
            ? "ملغي / مرفوض"
            : "قيد المراجعة"}
        </Badge>
      ),
    },
    {
      header: "تاريخ الطلب",
      accessor: "createdAt",
      render: (row) => formatDate(row.created_at || row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ملف الطالب: ${student.name}`}
        subtitle="مراجعة بيانات الطالب، الاشتراكات السارية والطلبات"
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin" },
          { label: "الطلاب", href: "/admin/students" },
          { label: student.name },
        ]}
      />

      {/* Info Card */}
      <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyanAccent rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-textSecondary block">الاسم</span>
            <span className="text-sm font-bold text-primary">{student.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-textSecondary block">هاتف الطالب</span>
            <span className="text-sm font-bold text-primary">{student.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-textSecondary block">هاتف ولي الأمر</span>
            <span className="text-sm font-bold text-primary">
              {student.parentPhone || "غير مسجل"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-textSecondary block">الصف الدراسي</span>
            <span className="text-sm font-bold text-primary">
              {student.class?.name || "غير محدد"}
            </span>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-primary">اشتراكات الطالب</h3>
        <Table
          columns={subColumns}
          data={subscriptions}
          emptyMessage="لا توجد اشتراكات مسجلة لهذا الطالب"
        />
      </div>

      {/* Orders Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-primary">طلبات الطالب</h3>
        <Table
          columns={orderColumns}
          data={orders}
          emptyMessage="لا توجد طلبات سابقة لهذا الطالب"
        />
      </div>
    </div>
  );
}
