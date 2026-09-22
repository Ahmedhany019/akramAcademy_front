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
import Badge from "../../components/common/Badge";
import { Edit, BookOpen, Layers, Calendar, CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "../../utils/cn";

export default function AdminLessonViewPage() {
  const { id } = useParams();

  const {
    data: lessonData,
    isLoading: loadingLesson,
    error: lessonError,
    refetch,
  } = useGetLessonQuery(id);

  const lesson = lessonData?.data || lessonData;

  const { data: pdfData, isLoading: loadingPdf } = useGetLessonPdfQuery(id, {
    skip: !id,
  });

  const { data: videoData, isLoading: loadingVideo } = useGetLessonVideoQuery(id, {
    skip: !id,
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
        message="قد يكون هذا الدرس غير متوفر أو تم حذفه."
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
          { label: "لوحة الإدارة", href: "/admin" },
          { label: "الدروس التعليمية", href: "/admin/lessons" },
          { label: lesson.title },
        ]}
        action={
          <Link to={`/admin/lessons/${id}/edit`}>
            <Button variant="primary" size="md" className="gap-2">
              <Edit className="w-4 h-4" />
              تعديل الدرس والمرفقات
            </Button>
          </Link>
        }
      />

      {/* Lesson Details & Badges */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {lesson.unit?.name && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-gray-50 px-3 py-1.5 rounded-xl border border-surface-border">
              <BookOpen className="w-4 h-4 text-cyanAccent" />
              <span>{lesson.unit.name}</span>
            </div>
          )}

          {lesson.class?.name && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-gray-50 px-3 py-1.5 rounded-xl border border-surface-border">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>{lesson.class.name}</span>
            </div>
          )}

          <Badge variant={lesson.is_free ? "success" : "neutral"}>
            {lesson.is_free ? "محتوى مجاني" : "محتوى مدفوع"}
          </Badge>

          <Badge variant={lesson.status === "published" ? "success" : "neutral"}>
            {lesson.status === "published" ? "منشور للطلاب" : "مسودة (غير منشور)"}
          </Badge>
        </div>

        {lesson.created_at && (
          <div className="flex items-center gap-1.5 text-xs text-textSecondary">
            <Calendar className="w-3.5 h-3.5" />
            <span>تاريخ الإنشاء: {formatDate(lesson.created_at)}</span>
          </div>
        )}
      </div>

      {/* Video Player */}
      <div className="bg-white border border-surface-border rounded-3xl p-4 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-primary">فيديو الشرح</h3>
          {videoUrl ? (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              تم رفع الفيديو
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              لا يوجد رابط فيديو
            </span>
          )}
        </div>

        <LessonVideo
          videoUrl={videoUrl}
          title={lesson.title}
          isLoading={loadingVideo}
        />

        {lesson.description && (
          <div className="pt-4 border-t border-surface-border text-right">
            <h4 className="text-xs font-bold text-primary mb-1">وصف الدرس:</h4>
            <p className="text-xs text-textSecondary leading-relaxed">
              {lesson.description}
            </p>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="space-y-2">
        <LessonPdf
          pdfUrl={pdfUrl}
          title={lesson.title ? `مذكرة: ${lesson.title}` : "المذكرة والمرفقات"}
          isLoading={loadingPdf}
        />
      </div>
    </div>
  );
}
