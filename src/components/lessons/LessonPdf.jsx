import React from "react";
import { FileText, Download, AlertCircle } from "lucide-react";
import Button from "../common/Button";
import Skeleton from "../common/Skeleton";

export default function LessonPdf({
  pdfUrl,
  title = "المذكرة والمرفقات",
  isLoading = false,
  error = null,
}) {
  if (isLoading) {
    return <Skeleton className="w-full h-20 rounded-2xl" />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">تعذر تحميل رابط المذكرة المرفقة</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-surface-border rounded-2xl shadow-soft gap-4">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl flex-shrink-0 border border-red-100">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary">{title}</h4>
          <p className="text-xs text-textSecondary mt-0.5">ملف PDF مرفق مع الدرس</p>
        </div>
      </div>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto"
      >
        <Button variant="secondary" size="sm" className="w-full sm:w-auto gap-2">
        <Download className="w-4 h-4" />
        عرض / تحميل الملف
      </Button>
      </a>
    </div>
  );
}
