import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetClassesQuery,
  useGetClassUnitsQuery,
  useGetPeriodsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import LessonCard from "../../components/lessons/LessonCard";
import { Calendar, Layers, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "../../utils/cn";

export default function ClassContentPage() {
  const { classId: rawClassId, unitId } = useParams();

  const { data: classesData } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  // When viewing a specific unit directly via /units/:unitId, find its classId
  const effectiveClassId = rawClassId;

  const { data: unitsData, isLoading: loadingUnits } = useGetClassUnitsQuery(
    effectiveClassId,
    { skip: !effectiveClassId }
  );
  const { data: periodsData, isLoading: loadingPeriods } = useGetPeriodsQuery(
    { classId: effectiveClassId },
    { skip: !effectiveClassId }
  );

  const units = unitsData?.data.units || unitsData || [];
  const periods = periodsData?.data || periodsData || [];

  const currentClass = Array.isArray(classes)
    ? classes.find((c) => String(c.id) === String(effectiveClassId))
    : null;

  const selectedUnit = unitId
    ? units.find((u) => String(u.id) === String(unitId))
    : null;

  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          selectedUnit
            ? selectedUnit.name
            : currentClass?.name || "محتوى الصف الدراسي"
        }
        subtitle={
          selectedUnit
            ? selectedUnit.description || "قائمة الدروس والمحتوى التعليمي التابع لهذه الوحدة"
            : "تصفح الوحدات والدروس المتاحة لهذا الصف الدراسي"
        }
        breadcrumbs={
          selectedUnit
            ? [
                { label: "الرئيسية", href: "/" },
                {
                  label: currentClass?.name || "الصف الدراسي",
                  href: `/classes/${effectiveClassId}`,
                },
                { label: selectedUnit.name },
              ]
            : [
                { label: "الرئيسية", href: "/" },
                { label: "الصفوف الدراسية" },
                { label: currentClass?.name || "الصف" },
              ]
        }
        action={
          selectedUnit ? (
            <Link to={`/classes/${effectiveClassId}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border bg-white text-xs font-bold text-primary hover:bg-gray-50 transition-colors shadow-soft">
                <ArrowRight className="w-4 h-4" />
                العودة للوحدات
              </button>
            </Link>
          ) : null
        }
      />

      {/* Academic Periods Filter */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-border">
          <Calendar className="w-5 h-5 text-cyanAccent" />
          <h2 className="text-base font-bold text-primary">الفترات الدراسية</h2>
        </div>

        {loadingPeriods ? (
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        ) : periods.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPeriodId(null)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border",
                selectedPeriodId === null
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-textSecondary border-surface-border hover:bg-gray-100"
              )}
            >
              الكل
            </button>
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriodId(period.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border",
                  selectedPeriodId === period.id
                    ? "bg-cyanAccent text-white border-cyanAccent"
                    : "bg-gray-50 text-textSecondary border-surface-border hover:bg-gray-100"
                )}
              >
                {period.type === "year"
                  ? "العام الدراسي"
                  : period.type === "term"
                  ? "الفصل الدراسي"
                  : "الشهر"}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-textSecondary">
            لا توجد فترات دراسية مضافة لهذا الصف
          </p>
        )}
      </div>

      {/* VIEW 1: Lessons inside Selected Unit */}
      {selectedUnit ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyanAccent" />
              دروس {selectedUnit.name}
            </h2>
            <span className="text-xs bg-gray-100 text-textSecondary font-semibold px-3 py-1 rounded-full">
              {(selectedUnit.lessons || []).length} درس
            </span>
          </div>

          {(() => {
            const lessons = selectedUnit.lessons || [];
            const filteredLessons = selectedPeriodId
              ? lessons.filter(
                  (l) =>
                    String(l.periodId ?? l.period_id) === String(selectedPeriodId)
                )
              : lessons;

            if (filteredLessons.length === 0) {
              return (
                <EmptyState
                  title="لا توجد دروس متوفرة"
                  description={
                    selectedPeriodId
                      ? "لا توجد دروس في هذه الوحدة للفترة المختارة."
                      : "لم يتم إضافة دروس لهذه الوحدة بعد."
                  }
                />
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isLocked={!lesson.is_free && lesson.has_access === false}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      ) : (
        /* VIEW 2: Units Grid of the Class */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyanAccent" />
              الوحدات الدراسية
            </h2>
            <span className="text-xs text-textSecondary">
              اضغط على الوحدة لعرض دروسها
            </span>
          </div>

          {loadingUnits ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          ) : units.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {units.map((unit) => {
                console.log(unit)
                const lessons = unit.lessons || [];
                const filteredLessons = selectedPeriodId
                  ? lessons.filter(
                      (l) =>
                        String(l.periodId ?? l.period_id) ===
                        String(selectedPeriodId)
                    )
                  : lessons;

                return (
                  <Link
                    key={unit.id}
                    to={`/classes/${effectiveClassId}/units/${unit.id}`}
                    className="bg-white border border-surface-border hover:border-cyanAccent rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-cyan-50 text-cyanAccent rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                          <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-gray-100 text-textSecondary font-semibold px-2.5 py-1 rounded-full group-hover:bg-cyan-50 group-hover:text-cyanAccent transition-colors">
                          {lessons.length} دروس
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-primary group-hover:text-cyanAccent transition-colors">
                        {unit.name}
                      </h3>

                      {unit.description && (
                        <p className="text-xs text-textSecondary mt-2 line-clamp-2 leading-relaxed">
                          {unit.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between text-xs font-bold text-cyanAccent">
                      <span>عرض الدروس</span>
                      <div className="p-1 rounded-lg bg-cyan-50 group-hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="لا توجد وحدات تعليمية"
              description="لم يتم إضافة وحدات لهذا الصف حتى الآن."
            />
          )}
        </div>
      )}
    </div>
  );
}
