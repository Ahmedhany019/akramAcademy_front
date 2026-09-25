import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useGetStudentsQuery } from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { Eye, Search, FileSpreadsheet } from "lucide-react";

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

  const handleExportExcel = () => {
    const exportData = (filteredStudents.length > 0 ? filteredStudents : students).map(
      (student, index) => ({
        "م": index + 1,
        "اسم الطالب": student.name || "-",
        "رقم الهاتف": student.phone || "-",
        "رقم ولي الأمر": student.parent_phone || "-",
        "الصف الدراسي": student.grade_level || student.class?.name || "-",
        "حالة الحساب": student.status === "active" || !student.status ? "مفعل" : "معطل",
        "تاريخ التسجيل": student.created_at
          ? new Date(student.created_at).toLocaleDateString("ar-EG")
          : "-",
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
    ];
    worksheet["!dir"] = "rtl";

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب");
    XLSX.writeFile(workbook, `قائمة_الطلاب_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

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
        action={
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportExcel}
            disabled={students.length === 0 || isLoading}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            تصدير إلى Excel
          </Button>
        }
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
