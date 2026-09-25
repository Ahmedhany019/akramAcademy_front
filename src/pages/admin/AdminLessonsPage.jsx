import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetLessonsQuery,
  useGetClassesQuery,
  useGetPeriodsQuery,
  useCreatePeriodMutation,
  useGetMeQuery,
  useDeleteLessonMutation,
  usePublishLessonMutation,
  useUnpublishLessonMutation,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmModal";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Calendar } from "lucide-react";
import { formatDate } from "../../utils/cn";

export default function AdminLessonsPage() {
  const navigate = useNavigate();
  const { data: meData } = useGetMeQuery();
  const { data: lessonsData, isLoading } = useGetLessonsQuery();
  const { data: classesData } = useGetClassesQuery();
  const { data: periodsData } = useGetPeriodsQuery();
  const [createPeriod, { isLoading: isCreatingPeriod }] = useCreatePeriodMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [publishLesson] = usePublishLessonMutation();
  const [unpublishLesson] = useUnpublishLessonMutation();

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [periodType, setPeriodType] = useState("month");
  const [periodParentId, setPeriodParentId] = useState("");
  const [periodClassId, setPeriodClassId] = useState("");
  const [periodStartDate, setPeriodStartDate] = useState("");
  const [periodEndDate, setPeriodEndDate] = useState("");
  const [periodErrorMsg, setPeriodErrorMsg] = useState("");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const lessons = lessonsData?.data || lessonsData || [];
  const classes = classesData?.data || classesData || [];
  const user = meData?.data?.user || meData?.user;

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

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let startYear = currentYear;

    if (user?.created_at) {
      const createdYear = new Date(user.created_at).getFullYear();
      if (!isNaN(createdYear)) {
        startYear = createdYear;
      }
    }

    const options = [];
    for (let yr = startYear; yr <= currentYear; yr++) {
      options.push({ value: String(yr), label: String(yr) });
    }
    return options;
  }, [user?.created_at]);

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

  const periods = periodsData?.data || periodsData || [];

  const parentOptions = Array.isArray(periods)
    ? periods.map((p) => ({
        value: String(p.id),
        label: `(${p.type === "year" ? "سنة" : p.type === "term" ? "ترم" : "شهر"})`,
      }))
    : [];

  const handleOpenAddPeriod = () => {
    setPeriodType("month");
    setPeriodParentId("");
    setPeriodClassId(classOptions[0]?.value || "");
    setPeriodStartDate("");
    setPeriodEndDate("");
    setPeriodErrorMsg("");
    setIsPeriodModalOpen(true);
  };

  const handlePeriodSubmit = async (e) => {
    e.preventDefault();
    setPeriodErrorMsg("");
    if (!periodClassId) {
      setPeriodErrorMsg("يرجى تحديد الصف الدراسي");
      return;
    }

    try {
      const payload = {
        type: periodType,
        class_id: periodClassId,
        parent_period_id: periodParentId || null,
        start_date: periodStartDate || null,
        end_date: periodEndDate || null,
      };

      await createPeriod(payload).unwrap();
      setIsPeriodModalOpen(false);
    } catch (err) {
      setPeriodErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ الفترة الدراسية"
      );
    }
  };

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
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleOpenAddPeriod}
              className="gap-2 border-primary/20 hover:border-primary/40 text-primary"
            >
              <Calendar className="w-4 h-4 text-cyanAccent" />
              إضافة فترة دراسية
            </Button>
            <Link to="/admin/lessons/create">
              <Button variant="primary" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة درس جديد
              </Button>
            </Link>
          </div>
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

      {/* Add Period Modal */}
      <Modal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        title="إضافة فترة دراسية جديدة"
      >
        <form onSubmit={handlePeriodSubmit} className="space-y-4">
          {periodErrorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {periodErrorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="النوع"
              options={[
                { value: "year", label: "سنة دراسية" },
                { value: "term", label: "ترم دراسي" },
                { value: "month", label: "شهر" },
              ]}
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
            />

            <Select
              label="الصف الدراسي"
              options={classOptions}
              value={periodClassId}
              onChange={(e) => setPeriodClassId(e.target.value)}
              required
            />
          </div>

          <Select
            label="الفترة الأب (إن وجدت)"
            options={parentOptions}
            value={periodParentId}
            onChange={(e) => setPeriodParentId(e.target.value)}
            placeholder="بدون فترة أب (فترة رئيسية)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="تاريخ البداية"
              type="date"
              value={periodStartDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setPeriodStartDate(e.target.value)}
            />
            <Input
              label="تاريخ النهاية"
              type="date"
              value={periodEndDate}
              onChange={(e) => setPeriodEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button
              variant="outline"
              onClick={() => setIsPeriodModalOpen(false)}
              disabled={isCreatingPeriod}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreatingPeriod}
            >
              حفظ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
