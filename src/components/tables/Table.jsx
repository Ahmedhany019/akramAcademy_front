import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import Skeleton from "../common/Skeleton";
import EmptyState from "../common/EmptyState";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Table({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "لا توجد سجلات متوفرة",
  className = "",
  pageSize = 10,
  enablePagination = true,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);

  const totalItems = data?.length || 0;
  const totalPages = enablePagination ? Math.ceil(totalItems / pageSize) || 1 : 1;

  const displayData = enablePagination
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-white border border-surface-border rounded-2xl shadow-soft flex flex-col justify-between",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50/75 border-b border-surface-border text-xs font-semibold text-textSecondary uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "py-3.5 px-4 font-bold text-primary",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData && displayData.length > 0 ? (
              displayData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-cyan-50/20 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        "py-3.5 px-4 text-textPrimary",
                        col.cellClassName
                      )}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8">
                  <EmptyState title={emptyMessage} description="" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {enablePagination && totalItems > 0 && (
        <div className="p-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/40 text-xs">
          <div className="text-textSecondary font-semibold">
            عرض <span className="text-primary font-bold">{startIndex}</span> إلى{" "}
            <span className="text-primary font-bold">{endIndex}</span> من أصل{" "}
            <span className="text-primary font-bold">{totalItems}</span> سجل
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 rounded-lg border border-surface-border bg-white text-textPrimary hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                // Show first, last, and around current page
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - currentPage) > 1
                ) {
                  if (
                    pageNum === 2 && currentPage > 3 ||
                    pageNum === totalPages - 1 && currentPage < totalPages - 2
                  ) {
                    return (
                      <span key={pageNum} className="px-1 text-textSecondary">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "min-w-[32px] h-8 px-2 rounded-lg font-bold transition-colors border text-xs",
                      currentPage === pageNum
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white border-surface-border text-textSecondary hover:bg-gray-100"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              className="p-1.5 rounded-lg border border-surface-border bg-white text-textPrimary hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
