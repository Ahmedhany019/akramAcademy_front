import React, { useState } from "react";
import {
  useGetClassesQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useGetClassUnitsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import { Plus, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminUnitsPage() {
  const [selectedClassId, setSelectedClassId] = useState("");

  const { data: classesData } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  // Automatically select first class if none selected
  const activeClassId = selectedClassId || (classes[0]?.id ? String(classes[0].id) : "");

  const { data: unitsData, isLoading } = useGetClassUnitsQuery(activeClassId, {
    skip: !activeClassId,
  });

  const units = unitsData?.data?.units || unitsData || [];

  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetClassId, setTargetClassId] = useState(activeClassId);
  const [errorMsg, setErrorMsg] = useState("");

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setName("");
    setDescription("");
    setTargetClassId(activeClassId);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setName(unit.name || "");
    setDescription(unit.description || "");
    setTargetClassId(String(unit.classId || activeClassId));
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم الوحدة");
      return;
    }

    try {
      if (editingUnit) {
        await updateUnit({
          id: editingUnit.id,
          name,
          description,
          class_id: Number(targetClassId),
        }).unwrap();
      } else {
        await createUnit({
          name,
          description,
          class_id: Number(targetClassId),
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ بيانات الوحدة"
      );
    }
  };

  const currentClassName =
    classes.find((c) => String(c.id) === String(activeClassId))?.name || "-";

  const columns = [
    {
      header: "اسم الوحدة",
      accessor: "name",
      render: (row) => <span className="font-bold text-primary">{row.name}</span>,
    },
    {
      header: "الفصل",
      accessor: "className",
      render: () => currentClassName,
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
        title="إدارة الوحدات الدراسية"
        subtitle="إدارة وتبويب الوحدات لكل صف دراسي"
        action={
          <div className="flex items-center gap-2">

          <Button variant="primary" size="md" onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة وحدة
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

      {/* Class filter switcher */}
      <div className="flex items-center gap-3 bg-white p-4 border border-surface-border rounded-2xl shadow-soft">
        <label className="text-xs font-bold text-primary whitespace-nowrap">
          اختر الصف الدراسي:
        </label>
        <select
          value={activeClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="px-3.5 py-2 bg-gray-50 border border-surface-border rounded-xl text-xs font-semibold text-primary focus:ring-cyanAccent"
        >
          {classOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        data={units}
        isLoading={isLoading}
        emptyMessage="لم يتم إضافة أي وحدات لهذا الصف بعد"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUnit ? "تعديل بيانات الوحدة" : "إضافة وحدة دراسية جديدة"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Select
            label="الصف الدراسي"
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            options={classOptions}
            required
          />

          <Input
            label="اسم الوحدة"
            placeholder="مثال: الوحدة الأولى - مدخل المنهج"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="وصف الوحدة"
            placeholder="وصف مختصر لمحتوى الوحدة..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
