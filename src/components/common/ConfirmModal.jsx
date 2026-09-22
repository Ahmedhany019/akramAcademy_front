import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد العملية",
  message = "هل أنت متأكد من تنفيذ هذا الإجراء؟ لا يمكن التراجع عن هذه الخطوة.",
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  isLoading = false,
  variant = "danger",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-textSecondary leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
