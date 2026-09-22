import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetLessonQuery,
  useGetLessonPdfQuery,
  useGetLessonVideoQuery,
} from "../../redux/api/apiSlice";
import LessonVideo from "../../components/lessons/LessonVideo";
import LessonPdf from "../../components/lessons/LessonPdf";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/common/Button";
import { ChevronRight, ChevronLeft, BookOpen, Layers } from "lucide-react";

export default function LessonViewPage() {
  const { lessonId } = useParams();

  const {
    data: lessonData,
    isLoading: loadingLesson,
    error: lessonError,
    refetch,
  } = useGetLessonQuery(lessonId);

  const lesson = lessonData?.data || lessonData;
  const hasAccess = lesson?.has_access ?? false;

  const { data: pdfData, isLoading: loadingPdf, error: pdfError } = useGetLessonPdfQuery(lessonId, {
    skip: !lessonId || !hasAccess,
  });
  console.log(pdfData)

  const { data: videoData, isLoading: loadingVideo, error: videoError } = useGetLessonVideoQuery(lessonId, {
    skip: !lessonId || !hasAccess,
  });

  const videoUrl =
    videoData?.data?.video_link ||
    videoData?.video_link ||
    videoData?.data?.video_url ||
    videoData?.video_url ||
    lesson?.content?.video_link ||
    lesson?.video_url;

  const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/api\/v1\/?$/, "");

  const rawPdfUrl =
    pdfData?.data?.url ||
    pdfData?.url ||
    pdfData?.data?.file ||
    pdfData?.file ||
    lesson?.file;

  const pdfUrl = rawPdfUrl
    ? rawPdfUrl.startsWith("http")
      ? rawPdfUrl
      : `${apiOrigin}${rawPdfUrl}`
    : null;

  if (loadingLesson) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <ErrorState
        title="تعذر تحميل محتوى الدرس"
        message="قد يكون هذا الدرس غير متاح لاشتراكك الحالي أو تم نقله."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lesson.title}
        subtitle={lesson.unit?.name ? `الوحدة: ${lesson.unit.name}` : ""}
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          {
            label: lesson.class?.name || "الصف الدراسي",
            href: lesson.class?.id || lesson.classId ? `/classes/${lesson.class?.id || lesson.classId}` : "#",
          },
          { label: lesson.title },
        ]}
      />

      {!hasAccess ? (
        /* SUBSCRIPTION REQUIRED UI */
        <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 shadow-card text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-primary">
              هذا الدرس متاح للمشتركين فقط
            </h2>
            <p className="text-sm text-textSecondary leading-relaxed">
              اشترك في الخطة الدراسية الخاصة بهذا الصف للوصول إلى فيديو الشرح الكامل والمذكرة والمرفقات.
            </p>
          </div>

          {/* Lesson Description Preview if available */}
          {lesson.description && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-surface-border text-right max-w-lg mx-auto">
              <h4 className="text-xs font-bold text-primary mb-1">عن هذا الدرس:</h4>
              <p className="text-xs text-textSecondary leading-relaxed">
                {lesson.description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/subscription-plans" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                اشترك للوصول إلى محتوى الدرس
              </Button>
            </Link>
            <Link to={lesson.class?.id ? `/classes/${lesson.class.id}` : "/"} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                العودة للوحدة
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Video Stream Container */}
          <div className="bg-white border border-surface-border rounded-3xl p-4 sm:p-6 shadow-card space-y-4">
            <LessonVideo
              videoUrl={videoUrl}
              title={lesson.title}
              isLoading={loadingVideo}
            />

            {/* Lesson Description */}
            {lesson.description && (
              <div className="pt-4 border-t border-surface-border text-right">
                <h3 className="text-sm font-bold text-primary mb-1">وصف الدرس</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            )}
          </div>

          {/* PDF Resource Component */}
          <LessonPdf
            pdfUrl={pdfUrl}
            title={lesson.title ? `مذكرة: ${lesson.title}` : "المذكرة والمرفقات"}
            isLoading={loadingPdf}
          />
        </>
      )}

      {/* Navigation Buttons: Next / Previous */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        {lesson.previousLessonId ? (
          <Link to={`/lessons/${lesson.previousLessonId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronRight className="w-4 h-4" />
              الدرس السابق
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {lesson.nextLessonId ? (
          <Link to={`/lessons/${lesson.nextLessonId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              الدرس التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
