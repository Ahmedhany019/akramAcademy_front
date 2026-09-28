import React, { useState } from "react";
import {
  useGetClassesQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetClassUnitsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/tables/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import { Plus, Edit2, Trash2, Image as ImageIcon, BookOpen, Lock, PlayCircle, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminUnitsPage() {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState("");

  const { data: classesData } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  // Automatically select first class if none selected
  const activeClassId =
    selectedClassId || (classes[0]?.id ? String(classes[0].id) : "");

  const { data: unitsData, isLoading } = useGetClassUnitsQuery(activeClassId, {
    skip: !activeClassId,
  });

  const units = unitsData?.data?.units || unitsData || [];

  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingUnit, setViewingUnit] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetClassId, setTargetClassId] = useState(activeClassId);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setName("");
    setDescription("");
    setTargetClassId(activeClassId);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setName(unit.name || "");
    setDescription(unit.description || "");
    setTargetClassId(String(unit.class_id || unit.classId));
    setThumbnailFile(null);
    setThumbnailPreview(unit.thumbnail || "");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الدروس التابعة له.")) {
      try {
        await deleteUnit(id).unwrap();
      } catch (err) {
        alert(err.data?.message || err.message || "حدث خطأ أثناء حذف القسم");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم القسم");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("class_id", targetClassId);
      if (description) {
        formData.append("description", description);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingUnit) {
        await updateUnit({
          id: editingUnit.id,
          data: formData,
        }).unwrap();
      } else {
        await createUnit(formData).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء حفظ بيانات القسم",
      );
    }
  };

  const currentClassName =
    classes.find((c) => String(c.id) === String(activeClassId))?.name || "-";

  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");
  const columns = [
    {
      header: "صورة القسم",
      accessor: "thumbnail",
      render: (row) =>
        row.thumbnail ? (
          <img
            src={
              row.thumbnail.startsWith("http")
                ? row.thumbnail
                : `${BASE_URL}${row.thumbnail}`
            }
            alt={row.name}
            className="w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-gray-400">
            <ImageIcon className="w-5 h-5" />
          </div>
        ),
    },
    {
      header: "اسم القسم",
      accessor: "name",
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewingUnit(row)}
          className="font-bold text-primary hover:text-cyanAccent hover:underline text-right flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{row.name}</span>
          <span className="text-[11px] font-normal text-textSecondary bg-gray-100 px-2 py-0.5 rounded-full">
            {row.lessons?.length || 0} درس
          </span>
        </button>
      ),
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewingUnit(row)}
            className="gap-1.5"
            title="عرض الدروس"
          >
            <Eye className="w-3.5 h-3.5" />
            الدروس
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            className="gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            تعديل
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الأقسام الدراسية"
        subtitle="إدارة وتبويب الأقسام لكل صف دراسي"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAdd}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة قسم
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
        title={editingUnit ? "تعديل بيانات القسم" : "إضافة وحدة دراسية جديدة"}
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
            label="اسم القسم"
            placeholder="مثال: القسم الأولى - مدخل المنهج"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-primary">
              صورة غلاف القسم (Thumbnail)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnailFile(file);
                  setThumbnailPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={
                    thumbnailPreview.startsWith("blob:") ||
                    thumbnailPreview.startsWith("http")
                      ? thumbnailPreview
                      : `${BASE_URL}${thumbnailPreview}`
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          <Textarea
            label="وصف القسم"
            placeholder="وصف مختصر لمحتوى القسم..."
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

      {/* View Unit Lessons Modal */}
      <Modal
        isOpen={!!viewingUnit}
        onClose={() => setViewingUnit(null)}
        title={`دروس ${viewingUnit?.name || "القسم"}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <span className="text-xs font-semibold text-textSecondary">
              إجمالي الدروس: {viewingUnit?.lessons?.length || 0}
            </span>
            <Link to="/admin/lessons/create">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setViewingUnit(null)}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة درس جديد
              </Button>
            </Link>
          </div>

          {viewingUnit?.lessons && viewingUnit.lessons.length > 0 ? (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {viewingUnit.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-surface-border hover:bg-gray-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-primary">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={lesson.is_free ? "success" : "neutral"}
                          className="text-[10px] px-1.5 py-0.2"
                        >
                          {lesson.is_free ? "مجاني" : "مدفوع"}
                        </Badge>
                        <Badge
                          variant={lesson.status === "published" ? "cyan" : "neutral"}
                          className="text-[10px] px-1.5 py-0.2"
                        >
                          {lesson.status === "published" ? "منشور" : "مسودة"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
                      title="عرض الدرس"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/lessons/${lesson.id}/edit`)}
                      title="تعديل الدرس"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-cyanAccent" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 border border-surface-border rounded-xl text-textSecondary text-xs">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              لا توجد دروس مضافة لهذه القسم حتى الآن
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-surface-border">
            <Button variant="outline" onClick={() => setViewingUnit(null)}>
              إغلاق
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
