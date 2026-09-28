import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { User, Phone, Mail, GraduationCap, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useGetSubscriptionsQuery,
  useGetOrdersQuery,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetClassesQuery,
} from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { data: meData } = useGetMeQuery();
  const { data: classesData } = useGetClassesQuery();
  const { data: subsData } = useGetSubscriptionsQuery();
  const { data: ordersData } = useGetOrdersQuery();

  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const user = meData?.data?.user || meData?.user || {};
  const classes = classesData?.data || classesData || [];
  const subscriptions = subsData?.data || subsData || [];
  const orders = ordersData?.data || ordersData || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    parent_phone: "",
    grade_level: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const handleOpenEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      parent_phone: user.profile?.parent_phone || "",
      grade_level: user.profile?.grade_level ? String(user.profile.grade_level) : (user.profile?.class_id ? String(user.profile.class_id) : (classOptions[0]?.value || "")),
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("يرجى إدخال اسم الطالب");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("يرجى إدخال رقم الهاتف");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      };

      if (user.role !== "admin") {
        payload.parent_phone = formData.parent_phone ? formData.parent_phone.trim() : null;
        if (formData.grade_level) {
          payload.grade_level = Number(formData.grade_level);
        }
      }

      if (formData.email && formData.email.trim()) {
        payload.email = formData.email.trim();
      }
      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await updateMe(payload).unwrap();
      const updatedUser = res?.data?.user || res?.user;
      if (updatedUser) {
        dispatch(setCredentials({ user: updatedUser }));
      }
      setSuccessMsg("تم تحديث البيانات بنجاح");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء تعديل البيانات",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الملف الشخصي"
        subtitle="بيانات الحساب والاشتراكات المرتبطة"
        breadcrumbs={[{ label: "الرئيسية", href: "/" }, { label: "الملف الشخصي" }]}
        action={
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenEdit}
            className="gap-2"
          >
            <Edit3 className="w-4 h-4" />
            تعديل البيانات
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white border border-surface-border rounded-2xl p-6 shadow-soft text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-primary">{user.name || "-"}</h2>
          <p className="text-xs text-textSecondary mt-1">
            {user.role === "admin" ? "مدير النظام" : "طالب"}
          </p>

          <div className="mt-6 pt-6 border-t border-surface-border space-y-3 text-right">
            <div className="flex items-center gap-2.5 text-xs text-textSecondary">
              <Phone className="w-4 h-4 text-cyanAccent" />
              <span>رقم الطالب: {user.phone || "-"}</span>
            </div>
            {user.profile?.parent_phone && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>رقم ولي الأمر: {user.profile.parent_phone}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <Mail className="w-4 h-4 text-cyanAccent" />
                <span>البريد: {user.email}</span>
              </div>
            )}
            {(user.profile?.grade_level_name || user.profile?.class?.name) && (
              <div className="flex items-center gap-2.5 text-xs text-textSecondary">
                <GraduationCap className="w-4 h-4 text-cyanAccent" />
                <span>الصف: {user.profile?.grade_level_name || user.profile?.class?.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
            <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-surface-border">
              ملخص الحساب
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-textSecondary">إجمالي الاشتراكات</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {Array.isArray(subscriptions) ? subscriptions.length : 0}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-textSecondary">إجمالي الطلبات</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {Array.isArray(orders) ? orders.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="تعديل بيانات الحساب"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <Input
            label="اسم الطالب"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="الاسم ثلاثي أو رباعي"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
            />
            {user.role !== "admin" && (
              <Input
                label="رقم ولي الأمر"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
              />
            )}
          </div>

          <div className={`grid grid-cols-1 ${user.role !== "admin" ? "md:grid-cols-2" : ""} gap-3`}>
            <Input
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
            />
            {user.role !== "admin" && (
              <Select
                label="الصف الدراسي"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                options={classOptions}
              />
            )}
          </div>

          <Input
            label="كلمة المرور الجديدة (اتركها فارغة إذا كنت لا تريد التغيير)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdating}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdating}
            >
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
