import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStudentsQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { Eye, Search } from "lucide-react";

export default function AdminStudentsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: studentsData, isLoading } = useGetStudentsQuery();
  const students = studentsData?.data || studentsData || [];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredStudents = students.filter((student) => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return true;
    const nameMatch = student.name?.toLowerCase().includes(term);
    const phoneMatch = student.phone?.includes(term);
    const parentPhoneMatch = student.parent_phone?.includes(term);
    return nameMatch || phoneMatch || parentPhoneMatch;
  });

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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-surface-border shadow-soft">
        <div className="w-full sm:w-80 relative">
          <Input
            placeholder="البحث باسم الطالب أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredStudents}
        isLoading={isLoading}
        emptyMessage={searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد طلاب مسجلين حتى الآن"}
      />
    </div>
  );
}
