import React, { useState } from "react";
import {
  useGetPeriodsQuery,
  useCreatePeriodMutation,
  useUpdatePeriodMutation,
  useGetClassesQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import Skeleton from "../../components/common/Skeleton";
import { Plus, Calendar, Edit2, ChevronDown, ChevronLeft } from "lucide-react";
import { formatDate } from "../../utils/cn";

export default function AdminPeriodsPage() {
  const { data: periodsData, isLoading } = useGetPeriodsQuery();
  const { data: classesData } = useGetClassesQuery();

  const periods = periodsData?.data || periodsData || [];
  const classes = classesData?.data || classesData || [];

  const [createPeriod, { isLoading: isCreating }] = useCreatePeriodMutation();
  const [updatePeriod, { isLoading: isUpdating }] = useUpdatePeriodMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  const [type, setType] = useState("month");
  const [parentId, setParentId] = useState("");
  const [classId, setClassId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const parentOptions = Array.isArray(periods)
    ? periods
        .filter((p) => !editingPeriod || p.id !== editingPeriod.id)
        .map((p) => ({
          value: String(p.id),
          label: `(${p.type === "year" ? "سنة" : p.type === "term" ? "ترم" : "شهر"})`,
        }))
    : [];

  const handleOpenAdd = () => {
    setEditingPeriod(null);
    setType("month");
    setParentId("");
    setClassId(classOptions[0]?.value || "");
    setStartDate("");
    setEndDate("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPeriod(p);
    setType(p.type || "month");
    setParentId(p.parent_period_id ? String(p.parent_period_id) : "");
    setClassId(p.class_id ? String(p.class_id) : "");
    setStartDate(p.start_date ? p.start_date.split("T")[0] : "");
    setEndDate(p.end_date ? p.end_date.split("T")[0] : "");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!classId) {
      setErrorMsg("يرجى تحديد الصف الدراسي");
      return;
    }

    try {
      const payload = {
        type,
        class_id:classId,
        parent_period_id: parentId || null,
        start_date: startDate || null,
        end_date: endDate || null,
      };

      if (editingPeriod) {
        await updatePeriod({ id: editingPeriod.id, ...payload }).unwrap();
      } else {
        await createPeriod(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ الفترة الدراسية"
      );
    }
  };

  const [selectedClassFilter, setSelectedClassFilter] = useState("all");

  const classFilterOptions = [
    { value: "all", label: "جميع الصفوف الدراسية" },
    ...classOptions,
  ];

  const filteredPeriods = Array.isArray(periods)
    ? selectedClassFilter === "all"
      ? periods
      : periods.filter(
          (p) => String(p.class_id) === String(selectedClassFilter) || String(p.class?.id) === String(selectedClassFilter)
        )
    : [];

  // Build tree representation: years at top, terms under years, months under terms
  const rootPeriods = filteredPeriods.filter((p) => !p.parent_period_id && !p.parentId);

  const renderPeriodNode = (node, level = 0) => {
    const children = filteredPeriods.filter(
      (p) =>
        String(p.parent_period_id || p.parentId) === String(node.id)
    );
    const typeLabel = {
      year: "سنة دراسية",
      term: "ترم دراسي",
      month: "شهر / فترة",
    }[node.type] || node.type;

    return (
      <div
        key={node.id}
        className={`bg-white border border-surface-border rounded-2xl p-4 shadow-soft space-y-3 ${
          level > 0 ? "mr-6 border-r-4 border-r-cyanAccent" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
              <Calendar className="w-5 h-5 text-cyanAccent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="cyan">{typeLabel}</Badge>
              </div>
              <p className="text-xs text-textSecondary mt-0.5">
                {node.class?.name && `الصف: ${node.class.name} | `}
                الفترة: {formatDate(node.start_date)} إلى {formatDate(node.end_date)}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(node)}
            className="gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            تعديل
          </Button>
        </div>

        {children.length > 0 && (
          <div className="pt-2 space-y-2 border-t border-surface-border">
            {children.map((child) => renderPeriodNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الفترات الدراسية"
        subtitle="الهيكل الزمني للفصول (سنوات - ترمات - شهور)"
        action={
          <Button variant="primary" size="md" onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة فترة دراسية
          </Button>
        }
      />

      {/* Filter by Class */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Select
            label="تصفية حسب الصف الدراسي"
            options={classFilterOptions}
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-textSecondary">
          إجمالي الفترات: {filteredPeriods.length}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : rootPeriods.length > 0 ? (
        <div className="space-y-4">
          {rootPeriods.map((root) => renderPeriodNode(root))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-surface-border rounded-2xl text-textSecondary text-sm">
          لم يتم العثور على أي فترات دراسية للصف المحدد
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPeriod ? "تعديل الفترة الدراسية" : "إضافة فترة دراسية جديدة"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
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
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            <Select
              label="الصف الدراسي"
              options={classOptions}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            />
          </div>

          <Select
            label="الفترة الأب (إن وجدت)"
            options={parentOptions}
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            placeholder="بدون فترة أب (فترة رئيسية)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="تاريخ البداية"
              type="date"
              value={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="تاريخ النهاية"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating || isUpdating}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating || isUpdating}
            >
              حفظ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
