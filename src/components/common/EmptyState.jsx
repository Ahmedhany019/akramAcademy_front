import React from "react";
import Button from "./Button";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "لا توجد بيانات",
  description = "لم يتم إضافة أي عناصر حتى الآن.",
  actionText,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-surface-border my-4 shadow-soft">
      <div className="p-4 bg-gray-50 rounded-2xl mb-4 text-gray-400">
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="text-base font-bold text-primary mb-1">{title}</h4>
      <p className="text-sm text-textSecondary max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
