import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary", // primary, secondary, outline, danger, ghost
  size = "md", // sm, md, lg
  isLoading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-hover focus:ring-cyanAccent shadow-sm",
    secondary:
      "bg-cyanAccent text-white hover:bg-cyanAccent-hover focus:ring-cyanAccent shadow-sm",
    outline:
      "border border-surface-border text-primary hover:bg-gray-50 focus:ring-primary",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost:
      "text-textSecondary hover:text-primary hover:bg-gray-100 focus:ring-gray-300",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
}
