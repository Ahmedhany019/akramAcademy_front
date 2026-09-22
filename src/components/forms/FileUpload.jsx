import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function FileUpload({
  label = "رفع ملف PDF",
  accept = ".pdf,application/pdf",
  file,
  onChange,
  onRemove,
  error,
  required = false,
  description = "صيغة PDF فقط حتى 50 ميجابايت",
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-right">
      {label && (
        <label className="text-xs font-semibold text-textPrimary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {file ? (
        <div className="flex items-center justify-between p-3.5 bg-cyan-50/50 border border-cyanAccent/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-cyanAccent shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary truncate max-w-xs">
                {file.name || "ملف مرفق"}
              </p>
              {file.size && (
                <p className="text-[11px] text-textSecondary">
                  {(file.size / (1024 * 1024)).toFixed(2)} ميجابايت
                </p>
              )}
            </div>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-gray-50/50 hover:bg-cyan-50/20",
            dragActive ? "border-cyanAccent bg-cyan-50/30" : "border-gray-200",
            error ? "border-red-400" : ""
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="p-3 bg-white rounded-full text-cyanAccent shadow-xs mb-2">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-primary">
            انقر لاختيار ملف أو اسحبه هنا
          </p>
          <p className="text-[11px] text-textSecondary mt-1">{description}</p>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
