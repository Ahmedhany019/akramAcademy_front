import React from "react";
import { cn } from "../../utils/cn";

export default function Input({
  label,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  disabled = false,
  defaultValue,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-right">
      {label && (
        <label className="text-xs font-semibold text-textPrimary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        required={required}
        min={type === "number" && 0}
        className={cn(
          "w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-textPrimary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyanAccent focus:border-cyanAccent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed",
          error ? "border-red-500 focus:ring-red-500" : "border-surface-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
