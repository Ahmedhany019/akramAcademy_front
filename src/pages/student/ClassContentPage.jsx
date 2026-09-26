import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetClassesQuery,
  useGetClassUnitsQuery,
  useGetPeriodsQuery,
  useGetSubscriptionsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import LessonCard from "../../components/lessons/LessonCard";
import {
  Calendar,
  Layers,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { cn, formatDate } from "../../utils/cn";
import { useSelector } from "react-redux";

export default function ClassContentPage() {
  const { classId: rawClassId, unitId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const { data: classesData } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  // When viewing a specific unit directly via /units/:unitId, find its classId
  const effectiveClassId = rawClassId;

  const { data: subsData } = useGetSubscriptionsQuery();
  const subscriptions = subsData?.data || subsData || [];
  const hasActiveSubscription = isAdmin || (Array.isArray(subscriptions)
    ? subscriptions.some(
        (s) =>
          s.status === "active" &&
          (
            String(s.plan?.class_id || s.plan?.class?.id) === String(effectiveClassId) ||
            String(s.class_id) === String(effectiveClassId)
          )
      )
    : false);

  const { data: unitsData, isLoading: loadingUnits } = useGetClassUnitsQuery(
    effectiveClassId,
    { skip: !effectiveClassId },
  );
  const { data: periodsData, isLoading: loadingPeriods } =
    useGetPeriodsQuery();
    // { skip: !effectiveClassId }

  const units = unitsData?.data?.units || unitsData?.data || unitsData || [];
  const allPeriods = periodsData?.data || periodsData || [];

  const periods = Array.isArray(allPeriods)
    ? effectiveClassId
      ? allPeriods.filter(
          (p) => String(p.class_id || p.class?.id) === String(effectiveClassId)
        )
      : allPeriods
    : [];

  const currentClass = Array.isArray(classes)
    ? classes.find((c) => String(c.id) === String(effectiveClassId))
    : null;

  const selectedUnit = unitId
    ? units.find((u) => String(u.id) === String(unitId))
    : null;

  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
    : "http://localhost:8000";

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
            ? selectedUnit.description ||
              "قائمة الدروس والمحتوى التعليمي التابع لهذه الوحدة"
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
                  : "bg-gray-50 text-textSecondary border-surface-border hover:bg-gray-100",
              )}
            >
              الكل
            </button>
            {periods.map((period) => {
              const typeLabel =
                period.type === "year"
                  ? "العام الدراسي"
                  : period.type === "term"
                    ? "الفصل الدراسي"
                    : "الشهر";
              const dateRange =
                period.start_date && period.end_date
                  ? ` (${formatDate(period.start_date)} - ${formatDate(period.end_date)})`
                  : "";

              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriodId(period.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border",
                    selectedPeriodId === period.id
                      ? "bg-cyanAccent text-white border-cyanAccent"
                      : "bg-gray-50 text-textSecondary border-surface-border hover:bg-gray-100",
                  )}
                >
                  {typeLabel}
                  {dateRange}
                </button>
              );
            })}
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
          {/* Unit Hero Banner with Creative Thumbnail integration */}
          {selectedUnit.thumbnail ? (
            <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-6 sm:p-8 shadow-card border border-primary-dark/30">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 scale-105 blur-sm"
                style={{
                  backgroundImage: `url(${
                    selectedUnit.thumbnail.startsWith("http")
                      ? selectedUnit.thumbnail
                      : `${BASE_URL}${selectedUnit.thumbnail}`
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyanAccent text-xs font-bold border border-white/15">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{(selectedUnit.lessons || []).length} درس متاح</span>
                  </div>
                  <h2 className="text-2xl font-black">{selectedUnit.name}</h2>
                  {selectedUnit.description && (
                    <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                      {selectedUnit.description}
                    </p>
                  )}
                </div>
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/40 rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-white/10 backdrop-blur-md">
                    <img
                      src={
                        selectedUnit.thumbnail.startsWith("http")
                          ? selectedUnit.thumbnail
                          : `${BASE_URL}${selectedUnit.thumbnail}`
                      }
                      alt={selectedUnit.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyanAccent" />
                دروس {selectedUnit.name}
              </h2>
              <span className="text-xs bg-gray-100 text-textSecondary font-semibold px-3 py-1 rounded-full">
                {(selectedUnit.lessons || []).length} درس
              </span>
            </div>
          )}

          {(() => {
            const lessons = selectedUnit.lessons || [];
            const filteredLessons = selectedPeriodId
              ? lessons.filter(
                  (l) =>
                    String(l.periodId ?? l.period_id) ===
                    String(selectedPeriodId),
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
            //console.log(filteredLessons[0].end_date > Date.now()/1000)
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isLocked={!isAdmin && !lesson.is_free && lesson.has_access === false}
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
              <Skeleton className="h-44 rounded-3xl" />
              <Skeleton className="h-44 rounded-3xl" />
              <Skeleton className="h-44 rounded-3xl" />
            </div>
          ) : units.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {units.map((unit, index) => {
                const lessons = unit.lessons || [];
                const thumbnailUrl = unit.thumbnail
                  ? unit.thumbnail.startsWith("http")
                    ? unit.thumbnail
                    : `${BASE_URL}${unit.thumbnail}`
                  : null;

                return (
                  <Link
                    key={unit.id}
                    to={`/classes/${effectiveClassId}/units/${unit.id}`}
                    className="group bg-white border border-surface-border hover:border-cyanAccent/60 rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div>
                      {/* YouTube-style 16:9 Thumbnail Header */}
                      <div className="relative w-full aspect-video bg-gradient-to-br from-primary via-slate-900 to-primary-dark overflow-hidden">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={unit.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40">
                            <Layers className="w-12 h-12 text-cyanAccent/60 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-xs font-semibold text-white/60">الوحدة {index + 1}</span>
                          </div>
                        )}

                        {/* Top Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                        {/* Unit Index Badge (Top Right) */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-black border border-white/10 shadow-sm">
                            الوحدة {index + 1}
                          </span>
                        </div>

                        {/* Lessons Count Pill (Bottom Left YouTube timestamp style) */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-cyanAccent text-[11px] font-bold border border-cyanAccent/30 shadow-md">
                            <BookOpen className="w-3.5 h-3.5 text-cyanAccent" />
                            <span>{lessons.length} دروس</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base font-black text-primary group-hover:text-cyanAccent transition-colors line-clamp-1">
                          {unit.name}
                        </h3>

                        {unit.description ? (
                          <p className="text-xs text-textSecondary mt-2 line-clamp-2 leading-relaxed">
                            {unit.description}
                          </p>
                        ) : (
                          <p className="text-xs text-textSecondary/60 mt-2 italic">
                            انقر لاستكشاف دروس وتمارين هذه الوحدة
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Action */}
                    {!hasActiveSubscription ? (
                      <div
                        className="px-4 sm:px-5 pb-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="text-amber-600">يتطلب اشتراكاً</span>
                        <Link
                          to="/subscription-plans"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          اشترك الآن
                        </Link>
                      </div>
                    ) : (
                      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-bold text-cyanAccent">
                        <span className="group-hover:text-primary transition-colors">ابدأ الوحدة</span>
                        <div className="p-1.5 rounded-xl bg-cyan-50 group-hover:bg-primary group-hover:text-white group-hover:translate-x-[-4px] transition-all duration-300">
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
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
