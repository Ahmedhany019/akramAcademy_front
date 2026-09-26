import React, { useState } from "react";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useGetClassesQuery,
  useGetPeriodsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import { Plus, Edit2 } from "lucide-react";
import { formatDate, formatPrice } from "../../utils/cn";

export default function AdminPlansPage() {
  const { data: plansData, isLoading } = useGetPlansQuery();
  const { data: classesData } = useGetClassesQuery();
  const { data: periodsData } = useGetPeriodsQuery();

  const plans = plansData?.data || plansData || [];
  const classes = classesData?.data || classesData || [];
  const periods = periodsData?.data || periodsData || [];

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [classId, setClassId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [status, setStatus] = useState("active");
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedClassFilter, setSelectedClassFilter] = useState("all");

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const classFilterOptions = [
    { value: "all", label: "جميع الصفوف الدراسية" },
    ...classOptions,
  ];

  const filteredPlans = Array.isArray(plans)
    ? selectedClassFilter === "all"
      ? plans
      : plans.filter(
          (p) => String(p.class?.id || p.class_id) === String(selectedClassFilter)
        )
    : [];

  const availablePeriods = Array.isArray(periods)
    ? classId
      ? periods.filter((p) => String(p.class_id || p.class?.id) === String(classId))
      : periods
    : [];

  const periodOptions = availablePeriods.map((p) => {
    const typeLabel = p.type === "year" ? "سنة" : p.type === "term" ? "ترم" : "شهر";
    const dateRange = p.start_date && p.end_date ? ` (${formatDate(p.start_date)} - ${formatDate(p.end_date)})` : "";
    return {
      value: String(p.id),
      label: `${typeLabel}${dateRange}`,
    };
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    const initialClassId = classOptions[0]?.value || "";
    setClassId(initialClassId);
    
    const initialPeriods = Array.isArray(periods)
      ? periods.filter((p) => String(p.class_id || p.class?.id) === String(initialClassId))
      : [];
    setPeriodId(initialPeriods[0] ? String(initialPeriods[0].id) : "");
    setStatus("active");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setName(plan.name || "");
    setPrice(plan.price || "");
    setClassId(plan.class?.id ? String(plan.class.id) : "");
    setPeriodId(plan.period?.id ? String(plan.period.id) : "");
    setStatus(plan.status || "active");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !price || !classId) {
      setErrorMsg("يرجى إدخال اسم الخطة، السعر، وتحديد الصف");
      return;
    }

    try {
      const payload = {
        name,
        price: Number(price),
        class_id: Number(classId),
        period_id: periodId ? Number(periodId) : null,
        status,
      };

      if (editingPlan) {
        await updatePlan({ id: editingPlan.id, ...payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ خطة الاشتراك"
      );
    }
  };

  const columns = [
    {
      header: "اسم الخطة",
      accessor: "name",
      render: (row) => <span className="font-bold text-primary">{row.name}</span>,
    },
    {
      header: "الفصل",
      accessor: "class",
      render: (row) => row.class?.name || "-",
    },
    {
      header: "الفترة",
      accessor: "period",
      render: (row) => `${formatDate(row.period?.start_date)} - ${formatDate(row.period?.end_date)}` || "-",
    },
    {
      header: "السعر",
      accessor: "price",
      render: (row) => (
        <span className="font-bold text-cyanAccent">
          {formatPrice(row.price)}
        </span>
      ),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "نشط" : "معطل"}
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
          onClick={() => handleOpenEdit(row)}
          className="gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          تعديل
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة خطط الاشتراك"
        subtitle="تحديد باقات وأسعار الفترات الدراسية"
        action={
          <Button variant="primary" size="md" onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة خطة
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
          إجمالي الخطط: {filteredPlans.length}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredPlans}
        isLoading={isLoading}
        emptyMessage="لم يتم إضافة أي خطط اشتراك بعد"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? "تعديل خطة الاشتراك" : "إضافة خطة اشتراك جديدة"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="اسم الخطة"
            placeholder="مثال: اشتراك شهر أكتوبر - أولى ثانوي"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="الصف الدراسي"
              options={classOptions}
              value={classId}
              onChange={(e) => {
                const newClassId = e.target.value;

                setClassId(newClassId);

                const classPeriods = periods.filter(
                  (p) =>
                    String(p.class_id || p.class?.id) === String(newClassId)
                );

                setPeriodId(
                  classPeriods.length > 0
                    ? String(classPeriods[0].id)
                    : ""
                );
              }}
              required
            />
            <Select
              label="الفترة المرتبطة"
              options={periodOptions}
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="السعر (ج.م)"
              type="number"
              placeholder="مثال: 150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Select
              label="الحالة"
              options={[
                { value: "active", label: "نشط" },
                { value: "inactive", label: "معطل" },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
