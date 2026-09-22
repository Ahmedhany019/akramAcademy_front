import React from "react";
import Button from "./Button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-surface-border sm:px-6 rounded-b-2xl">
      <div className="flex items-center gap-2">
        <span className="text-xs text-textSecondary">
          صفحة {currentPage} من {totalPages}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronRight className="w-4 h-4 ml-1" />
          السابق
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          التالي
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
}
