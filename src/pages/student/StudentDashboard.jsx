import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Layers,
  BookOpen,
  CreditCard,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  useGetSubscriptionsQuery,
  useGetLessonsQuery,
  useGetPlansQuery,
  useGetClassesQuery,
} from "../../redux/api/apiSlice";
import { heroImage } from "../../assets/images";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";

export default function StudentDashboard() {
  const user = useSelector((state) => state.auth.user);

  const { data: subsData, isLoading: loadingSubs } = useGetSubscriptionsQuery();
  const { data: lessonsData, isLoading: loadingLessons } = useGetLessonsQuery();
  const { data: plansData, isLoading: loadingPlans } = useGetPlansQuery();
  const { data: classesData, isLoading: loadingClasses } = useGetClassesQuery();

  const subscriptions = subsData?.data || subsData || [];
  const lessons = lessonsData?.data || lessonsData || [];
  const plans = plansData?.data || plansData || [];
  const classes = classesData?.data || classesData || [];

  const activeSubs = Array.isArray(subscriptions)
    ? subscriptions.filter((s) => s.status === "active").length
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-primary rounded-3xl p-6 sm:p-10 text-white shadow-card border border-primary-dark">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyanAccent text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              منصة التميز في التعلم
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              أهلاً يا {user?.name ? user.name.split(" ")[0] : "طالب"} 👋
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              استمر في التعلم، كل خطوة تقربك من هدفك. تابع جدول دروسك ومذكراتك بانتظام لتحقيق أعلى النتائج.
            </p>
            <div className="pt-2">
              <Link to="/subscription-plans">
                <Button variant="secondary" size="md" className="gap-2">
                  استكمال التعلم
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={heroImage}
              alt="Education"
              className="w-48 sm:w-64 h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Active subscriptions */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              الاشتراكات النشطة
            </span>
            <div className="p-2.5 bg-cyan-50 text-cyanAccent rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {loadingSubs ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-black text-primary">{activeSubs}</p>
            )}
          </div>
        </div>

        {/* Available Lessons */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              الدروس المتاحة
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {loadingLessons ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-black text-primary">
                {Array.isArray(lessons) ? lessons.length : 0}
              </p>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">
              الخطط المتاحة
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {loadingPlans ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-black text-primary">
                {Array.isArray(plans) ? plans.length : 0}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Educational Content Shortcut */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">المحتوى التعليمي</h2>
          <span className="text-xs text-textSecondary">
            اختر الصف الدراسي لبدء المشاهدة
          </span>
        </div>

        {loadingClasses ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Link
                key={cls.id}
                to={`/classes/${cls.id}`}
                className="bg-white border border-surface-border hover:border-cyanAccent rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-200 flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-base font-bold text-primary group-hover:text-cyanAccent transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">
                    تصفح الوحدات والدروس المتاحة
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-cyan-50 group-hover:text-cyanAccent transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-surface-border rounded-2xl text-center text-textSecondary text-xs">
            لا توجد صفوف دراسية مسجلة حالياً
          </div>
        )}
      </div>
    </div>
  );
}
