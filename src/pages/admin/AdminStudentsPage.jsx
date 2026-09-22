import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetStudentsQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { Eye } from "lucide-react";

export default function AdminStudentsPage() {
  const navigate = useNavigate();
  const { data: studentsData, isLoading } = useGetStudentsQuery();
  const students = studentsData?.data || studentsData || [];

  const columns = [
    {
      header: "اسم الطالب",
      accessor: "name",
      render: (row) => <span className="font-bold text-primary">{row.name}</span>,
    },
    {
      header: "رقم الهاتف",
      accessor: "phone",
      render: (row) => row.phone || "-",
    },
    {
      header: "رقم ولي الأمر",
      accessor: "parent_phone",
      render: (row) => row.parent_phone || "-",
    },
    {
      header: "الصف",
      accessor: "grade_level",
      render: (row) => row.grade_level || "-",
    },
    {
      header: "حالة الحساب",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "active" || !row.status ? "success" : "neutral"}>
          {row.status === "active" || !row.status ? "مفعل" : "معطل"}
        </Badge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: "actions",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/admin/students/${row.id}`)}
          className="gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          عرض الطالب
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الطلاب"
        subtitle="عرض قائمة الطلاب المسجلين بالمنصة وتفاصيل اشتراكاتهم"
      />

      <Table
        columns={columns}
        data={students}
        isLoading={isLoading}
        emptyMessage="لا يوجد طلاب مسجلين حتى الآن"
      />
    </div>
  );
}
