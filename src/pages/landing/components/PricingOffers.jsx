import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useGetClassesQuery, useGetClassUnitsQuery } from "../../../redux/api/apiSlice";
import Button from "../../../components/common/Button";

const PricingOffers = () => {
  const { data: classesData, isLoading: loadingClasses } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: unitsData, isLoading: loadingUnits } = useGetClassUnitsQuery(
    selectedClassId,
    { skip: !selectedClassId }
  );

  const units = unitsData?.data?.units || unitsData?.units || [];
  const currentClass = Array.isArray(classes)
    ? classes.find((c) => String(c.id) === String(selectedClassId))
    : null;

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
    : "http://localhost:8000";

  return (
    <section id="courses" dir="rtl" className="w-full bg-[#f8fafc] py-20 px-4 md:px-8 border-t border-slate-200/60 scroll-mt-[90px]">
      <div className="max-w-[1250px] mx-auto">
        {/* Login And Register */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="primary" onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" onClick={() => navigate("/register")}>
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0f1d41]/10 text-[#0f1d41] px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <Sparkles className="w-4 h-4 text-[#f1c40f]" />
            <span>المناهج والوحدات الدراسية</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f1d41] leading-tight">
            استكشف <span className="text-[#1a45c4]">الوحدات والدروس</span> المتاحة
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-3 max-w-xl mx-auto font-medium">
            تصفح المحتوى التعليمي لكل صف دراسي مع تفاصيل الوحدات والدروس لشرح وتبسيط مادة اللغة الفرنسية
          </p>
        </div>

        {/* Grade Tabs */}
        {loadingClasses ? (
          <div className="flex justify-center gap-3 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-44 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-14">
            {Array.isArray(classes) &&
              classes.slice(0,8).map((cls) => {
                const isActive = String(selectedClassId) === String(cls.id);
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    type="button"
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 shadow-sm cursor-pointer ${
                      isActive
                        ? "bg-[#0f1d41] text-white shadow-lg shadow-[#0f1d41]/20 scale-105 border-2 border-[#f1c40f]"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/80"
                    }`}
                  >
                    <GraduationCap
                      className={`w-5 h-5 ${isActive ? "text-[#f1c40f]" : "text-gray-400"}`}
                    />
                    <span>{cls.name}</span>
                  </button>
                );
              })}
          </div>
        )}

        {/* Units / Content Container */}
        {loadingUnits ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : units && units.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {units.map((unit, index) => {
              const lessons = unit.lessons || [];
              return (
                <div
                  key={unit.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  {unit.thumbnail && (
                    <div className="w-full h-44 overflow-hidden bg-slate-100">
                      <img
                        src={
                          unit.thumbnail.startsWith("http")
                            ? unit.thumbnail
                            : `${BASE_URL}${unit.thumbnail}`
                        }
                        alt={unit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {/* Unit Header Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-black px-3.5 py-1 rounded-full bg-[#1a45c4]/10 text-[#1a45c4]">
                        الوحدة {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <BookOpen className="w-3.5 h-3.5 text-[#1a45c4]" />
                        <span>{lessons.length} درس</span>
                      </div>
                    </div>

                    {/* Unit Title */}
                    <h3 className="text-xl font-black text-[#0f1d41] mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#f1c40f] shrink-0" />
                      <span>{unit.name}</span>
                    </h3>

                    <div className="border-t border-slate-100 my-4" />

                    {/* Lessons List Preview */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-gray-400 mb-2">الدروس والمحاضرات:</p>
                      {lessons.length > 0 ? (
                        lessons.slice(0, 4).map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-gray-700"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <PlayCircle className="w-4 h-4 text-[#1a45c4] shrink-0" />
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            {lesson.is_free ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md shrink-0">
                                مجاني
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 py-3 text-center">
                          جاري إضافة دروس هذه الوحدة قريباً
                        </p>
                      )}

                      {lessons.length > 4 && (
                        <p className="text-[11px] font-bold text-[#1a45c4] text-center pt-1">
                          + {lessons.length - 4} دروس إضافية في هذه الوحدة
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0f1d41] text-white text-xs md:text-sm font-bold hover:bg-[#1a45c4] transition-all duration-300 shadow-md group-hover:shadow-lg"
                    >
                      <span>تصفح محتوى الوحدة كاملاً</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold text-[#0f1d41]">
              لا توجد وحدات متاحة حالياً لهذا الصف
            </p>
            <p className="text-xs text-gray-500 mt-1">
              سيتم نشر المحتوى التعليمي قريباً
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingOffers;
