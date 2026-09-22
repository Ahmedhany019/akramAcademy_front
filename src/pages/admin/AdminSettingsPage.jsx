import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("منصة الأستاذ أكرم إبراهيم التعليمية");
  const [teacherName, setTeacherName] = useState("أ. أكرم إبراهيم");
  const [contactPhone, setContactPhone] = useState("01000000000");
  const [supportEmail, setSupportEmail] = useState("support@akramibrahim.com");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="إعدادات المنصة"
        subtitle="تخصيص البيانات العامة للمنصة ومعلومات التواصل"
      />

      <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              تم حفظ الإعدادات بنجاح
            </div>
          )}

          <Input
            label="اسم المنصة"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            required
          />

          <Input
            label="اسم المعلم / المحاضر"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
          />

          <Input
            label="رقم هاتف الدعم الفني"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />

          <Input
            label="البريد الإلكتروني للدعم"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />

          <div className="pt-4 border-t border-surface-border flex justify-end">
            <Button type="submit" variant="primary" className="gap-2">
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
