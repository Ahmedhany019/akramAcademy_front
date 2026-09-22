import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // أولًا نضيف المودال للـ DOM
      setShouldRender(true);

      // بعد ما يتضاف للـ DOM نشغل animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      document.body.style.overflow = "hidden";

      return () => clearTimeout(timer);
    }

    // Animation الخروج
    setIsVisible(false);

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 300);

    document.body.style.overflow = "unset";

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-xs",
          "transition-opacity duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-card",
          "border border-surface-border w-full z-10 p-6 text-right",

          // Animation
          "transition-all duration-300 ease-out",

          // Closed / Opening state
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0",

          maxWidth
        )}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
          <h3 className="text-lg font-bold text-primary">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}