import React, { useState } from "react";
import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import { Plus, Edit2 } from "lucide-react";

export default function AdminClassesPage() {
  const { data: classesData, isLoading } = useGetClassesQuery();
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const classes = classesData?.data || classesData || [];

  const categoryOptions = [
    { value: "all", label: "جميع المراحل" },
    { value: "primary", label: "المرحلة الابتدائية" },
    { value: "preparatory", label: "المرحلة الإعدادية" },
    { value: "secondary", label: "المرحلة الثانوية" },
  ];

  const getCategory = (cls) => {
    if (cls.category) return cls.category.toLowerCase();
    if (cls.stage) return cls.stage.toLowerCase();
    const name = (cls.name || "").toLowerCase();
    if (name.includes("ثانوي") || name.includes("ثانوية")) return "secondary";
    if (name.includes("إعدادي") || name.includes("اعدادي") || name.includes("إعدادية") || name.includes("اعدادية")) return "preparatory";
    if (name.includes("ابتدائي") || name.includes("ابتدائية")) return "primary";
    return "other";
  };

  const filteredClasses = classes.filter((cls) => {
    if (selectedCategory === "all") return true;
    return getCategory(cls) === selectedCategory;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [name, setName] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [status, setStatus] = useState("active");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName("");
    setOrderIndex(0);
    setStatus("active");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setName(cls.name || "");
    setOrderIndex(cls.order || 0);
    setStatus(cls.status || "active");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم الصف");
      return;
    }

    try {
      if (editingClass) {
        await updateClass({
          id: editingClass.id,
          name,
          order: Number(orderIndex),
          status,
        }).unwrap();
      } else {
        await createClass({
          name,
          order: Number(orderIndex),
          status,
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ بيانات الصف"
      );
    }
  };

  const columns = [
    {
      header: "اسم الفصل",
      accessor: "name",
      render: (row) => <span className="font-bold text-primary">{row.name}</span>,
    },
    {
      header: "الترتيب",
      accessor: "order",
      render: (row) => row.order ?? "-",
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "نشط" : "مؤرشف"}
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
        title="إدارة الفصول الدراسية"
        subtitle="إضافة وتعديل الصفوف والمراحل التعليمية"
        action={
          <Button variant="primary" size="md" onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة فصل
          </Button>
        }
      />

      {/* Category filter tabs / select */}
      <div className="bg-white p-4 border border-surface-border rounded-2xl shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">تصفية حسب المرحلة:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-textSecondary hover:bg-gray-100 hover:text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredClasses}
        isLoading={isLoading}
        emptyMessage={
          selectedCategory !== "all"
            ? "لا توجد فصول دراسية لهذه المرحلة"
            : "لم يتم إضافة أي صفوف دراسية بعد"
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "تعديل بيانات الفصل" : "إضافة فصل دراسي جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="اسم الفصل"
            placeholder="مثال: الصف الأول الثانوي"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="الترتيب"
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
          />

          <Select
            label="الحالة"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "active", label: "نشط" },
              { value: "archived", label: "مؤرشف" },
            ]}
          />

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
