import React from "react";
import { cn } from "../../utils/cn";
import Skeleton from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

export default function Table({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "لا توجد سجلات متوفرة",
  className = "",
}) {
  return (
    <div className={cn("w-full overflow-hidden bg-white border border-surface-border rounded-2xl shadow-soft", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50/75 border-b border-surface-border text-xs font-semibold text-textSecondary uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn("py-3.5 px-4 font-bold text-primary", col.className)}
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
            ) : data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-cyan-50/20 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn("py-3.5 px-4 text-textPrimary", col.cellClassName)}
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
    </div>
  );
}
