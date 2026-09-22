import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Lock, FileText, CheckCircle2, Sparkles } from "lucide-react";
import Badge from "../common/Badge";

export default function LessonCard({ lesson, isLocked = false }) {
  const isFree = Boolean(lesson.is_free);

  const cardContent = (
    <div
      className={`p-4 bg-white border rounded-2xl transition-all duration-200 shadow-soft flex items-center justify-between gap-4 ${
        isLocked
          ? "bg-gray-50/80 border-gray-200 opacity-80 cursor-not-allowed select-none"
          : "border-surface-border hover:border-cyanAccent hover:shadow-card group cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`p-3 rounded-xl transition-colors ${
            isLocked
              ? "bg-amber-50 text-amber-600"
              : isFree
              ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
              : "bg-cyan-50 text-cyanAccent group-hover:bg-primary group-hover:text-white"
          }`}
        >
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <PlayCircle className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-bold ${
                isLocked
                  ? "text-gray-700"
                  : "text-primary group-hover:text-cyanAccent transition-colors"
              }`}
            >
              {lesson.title}
            </h4>
          </div>
          {lesson.description && (
            <p className="text-xs text-textSecondary line-clamp-1 mt-0.5 max-w-md">
              {lesson.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
            {lesson.has_pdf || lesson.pdfUrl ? (
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                مذكرة متوفرة
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        {isFree ? (
          <Badge variant="success" className="gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="w-3 h-3" />
            مجاني
          </Badge>
        ) : isLocked ? (
          <Badge variant="warning" className="gap-1 bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-3 h-3" />
            محتوى مشتركين
          </Badge>
        ) : (
          <Badge variant="cyan" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            متاح
          </Badge>
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return <div>{cardContent}</div>;
  }

  return <Link to={`/lessons/${lesson.id}`} className="block">{cardContent}</Link>;
}
