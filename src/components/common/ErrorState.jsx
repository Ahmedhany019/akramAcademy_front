import React from "react";
import Button from "./Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "حدث خطأ أثناء تحميل البيانات",
  message = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-2xl border border-red-100 my-4">
      <div className="p-3 bg-red-50 text-red-500 rounded-2xl mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-textSecondary max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
