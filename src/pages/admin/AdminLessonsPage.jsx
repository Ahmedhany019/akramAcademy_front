import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetLessonsQuery,
  useGetClassesQuery,
  useDeleteLessonMutation,
  usePublishLessonMutation,
  useUnpublishLessonMutation,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmModal";
import Select from "../../components/common/Select";
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "../../utils/cn";

export default function AdminLessonsPage() {
  const navigate = useNavigate();
  const { data: lessonsData, isLoading } = useGetLessonsQuery();
  const { data: classesData } = useGetClassesQuery();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [publishLesson] = usePublishLessonMutation();
  const [unpublishLesson] = useUnpublishLessonMutation();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const lessons = lessonsData?.data || lessonsData || [];
  const classes = classesData?.data || classesData || [];

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const monthOptions = [
    { value: "1", label: "يناير (1)" },
    { value: "2", label: "فبراير (2)" },
    { value: "3", label: "مارس (3)" },
    { value: "4", label: "أبريل (4)" },
    { value: "5", label: "مايو (5)" },
    { value: "6", label: "يونيو (6)" },
    { value: "7", label: "يوليو (7)" },
    { value: "8", label: "أغسطس (8)" },
    { value: "9", label: "سبتمبر (9)" },
    { value: "10", label: "أكتوبر (10)" },
    { value: "11", label: "نوفمبر (11)" },
    { value: "12", label: "ديسمبر (12)" },
  ];

  const yearOptions = [
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    if (selectedClassId) {
      const lessonClassId =
        lesson.class_id ??
        lesson.unit?.class_id ??
        lesson.unit?.classId;
      if (String(lessonClassId) !== String(selectedClassId)) {
        return false;
      }
    }

    if (selectedMonth || selectedYear) {
      const dateStr = lesson.created_at || lesson.createdAt;
      if (!dateStr) return false;
      const lessonDate = new Date(dateStr);
      if (isNaN(lessonDate.getTime())) return false;

      if (selectedMonth && String(lessonDate.getMonth() + 1) !== String(selectedMonth)) {
        return false;
      }

      if (selectedYear && String(lessonDate.getFullYear()) !== String(selectedYear)) {
        return false;
      }
    }

    return true;
  });

  const [lessonToDelete, setLessonToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return;
    try {
      await deleteLesson(lessonToDelete.id).unwrap();
      setLessonToDelete(null);
    } catch {
      alert("حدث خطأ أثناء حذف الدرس");
    }
  };

  const handleTogglePublish = async (lesson) => {
    try {
      if (lesson.status === "published") {
        await unpublishLesson(lesson.id).unwrap();
      } else {
        await publishLesson(lesson.id).unwrap();
      }
    } catch {
      alert("حدث خطأ أثناء تغيير حالة النشر");
    }
  };

  const columns = [
    {
      header: "عنوان الدرس",
      accessor: "title",
      render: (row) => <span className="font-bold text-primary">{row.title}</span>,
    },
    {
      header: "الوحدة",
      accessor: "unit",
      render: (row) => row.unit?.name || "-",
    },
    {
      header: "الفترة",
      accessor: "period",
      render: (row) => row.period?.type === "month"? "شهر": row.period?.type === "term"? "ترم": "سنة"  || "-",
    },
    {
      header: "النوع",
      accessor: "is_free",
      render: (row) =>
        row.is_free ? (
          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            مجاني
          </Badge>
        ) : (
          <Badge variant="neutral" className="bg-gray-100 text-gray-700">
            مدفوع
          </Badge>
        ),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "published" ? "success" : "neutral"}>
          {row.status === "published" ? "منشور" : "مسودة"}
        </Badge>
      ),
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt",
      render: (row) => formatDate(row.created_at),
    },
    {
      header: "الإجراءات",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/lessons/${row.id}`)}
            title="عرض الدرس"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/lessons/${row.id}/edit`)}
            title="تعديل الدرس"
          >
            <Edit className="w-4 h-4 text-cyanAccent" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTogglePublish(row)}
            title={row.status === "published" ? "إلغاء النشر" : "نشر الدرس"}
          >
            {row.status === "published" ? (
              <XCircle className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLessonToDelete(row)}
            title="حذف الدرس"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الدروس التعليمية"
        subtitle="إنشاء، تعديل، ونشر شروحات الدروس ومرفقاتها"
        action={
          <Link to="/admin/lessons/create">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة درس جديد
            </Button>
          </Link>
        }
      />

      <div className="bg-white p-4 border border-surface-border rounded-2xl shadow-soft flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[180px]">
          <Select
            label="تصفية حسب الصف الدراسي"
            placeholder="جميع الصفوف"
            options={classOptions}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[160px]">
          <Select
            label="تصفية حسب الشهر"
            placeholder="جميع الشهور"
            options={monthOptions}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <Select
            label="تصفية حسب السنة"
            placeholder="جميع السنوات"
            options={yearOptions}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
        </div>

        {(selectedClassId || selectedMonth || selectedYear) && (
          <div className="flex items-end self-end pb-0.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedClassId("");
                setSelectedMonth("");
                setSelectedYear("");
              }}
            >
              إعادة ضبط
            </Button>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredLessons}
        isLoading={isLoading}
        emptyMessage={
          selectedClassId || selectedMonth || selectedYear
            ? "لا توجد دروس مطابقة لمعايير الفلترة"
            : "لم يتم إنشاء أي دروس حتى الآن"
        }
      />

      <ConfirmModal
        isOpen={!!lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف الدرس"
        message={`هل أنت متأكد من حذف الدرس "${lessonToDelete?.title}"؟ سيتم حذف جميع المرفقات المرتبطة به.`}
        confirmText="حذف الدرس"
        isLoading={isDeleting}
      />
    </div>
  );
}
