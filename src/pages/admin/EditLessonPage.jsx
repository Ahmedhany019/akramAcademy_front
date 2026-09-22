import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetLessonQuery,
  useUpdateLessonMutation,
  useGetClassesQuery,
  useGetClassUnitsQuery,
  useGetPeriodsQuery,
  useUploadLessonPdfMutation,
  useSetLessonVideoMutation,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/common/Button";
import LessonVideo from "../../components/lessons/LessonVideo";
import Skeleton from "../../components/common/Skeleton";

export default function EditLessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lessonData, isLoading: loadingLesson } = useGetLessonQuery(id);
  const lesson = lessonData?.data || lessonData;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState("published");
  const [videoUrl, setVideoUrl] = useState("");
  const [newPdfFile, setNewPdfFile] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [step, setStep] = useState("");

  const pendingUnitId = useRef(null);
  const [resolvedClassId, setResolvedClassId] = useState("");

  const { data: classesData } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  // Probe each class to find which one contains our unit_id
  const [probeClassIndex, setProbeClassIndex] = useState(0);
  const probeClassId = !classId && classes[probeClassIndex]?.id
    ? String(classes[probeClassIndex].id)
    : null;
  const { data: probeUnitsData } = useGetClassUnitsQuery(probeClassId, {
    skip: !!classId || !probeClassId || !pendingUnitId.current,
  });

  // When probe returns, check if target unit is in this class
  useEffect(() => {
    if (!pendingUnitId.current || classId) return;
    const probeUnits = Array.isArray(probeUnitsData?.data)
      ? probeUnitsData.data
      : probeUnitsData?.data?.units || probeUnitsData || [];
    const found = Array.isArray(probeUnits) && probeUnits.some((u) => String(u.id) === pendingUnitId.current);
    if (found) {
      setClassId(probeClassId);
    } else if (classes[probeClassIndex + 1]) {
      setProbeClassIndex((i) => i + 1);
    }
  }, [probeUnitsData]);

  const { data: unitsData } = useGetClassUnitsQuery(classId, { skip: !classId });
  const { data: periodsData } = useGetPeriodsQuery({ classId }, { skip: !classId });

  const units = Array.isArray(unitsData?.data)
    ? unitsData.data
    : unitsData?.data?.units || unitsData || [];
  const periods = periodsData?.data || periodsData || [];

  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const [uploadPdf, { isLoading: isUploadingPdf }] = useUploadLessonPdfMutation();
  const [setVideoApi, { isLoading: isUpdatingVideo }] = useSetLessonVideoMutation();

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setDescription(lesson.description || "");
      setStatus(lesson.status || "published");
      setIsFree(Boolean(lesson.is_free));
      setVideoUrl(lesson.content?.video_link || "");

      if (lesson.class_id) {
        // Backend returned class_id directly
        setClassId(String(lesson.class_id));
        setUnitId(lesson.unit_id ? String(lesson.unit_id) : "");
      } else if (lesson.unit_id) {
        // Need to discover class_id by probing
        pendingUnitId.current = String(lesson.unit_id);
        setUnitId(String(lesson.unit_id));
        setProbeClassIndex(0);
      }

      setPeriodId(lesson.period_id ? String(lesson.period_id) : "");
    }
  }, [lesson]);

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const unitOptions = Array.isArray(units)
    ? units.map((u) => ({ value: String(u.id), label: u.name }))
    : [];

  const periodOptions = Array.isArray(periods)
    ? periods.map((p) => ({ value: String(p.id), label: p.type === "year" ? "سنة" : p.type === "term" ? "ترم" : "شهر" }))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setPdfError("");
    setVideoError("");

    // STEP 1 — Update lesson metadata (JSON)
    try {
      setStep("lesson");
      await updateLesson({
        id,
        unit_id: Number(unitId),
        period_id: periodId ? Number(periodId) : null,
        title,
        description,
        status,
        is_free: isFree,
      }).unwrap();
    } catch (err) {
      setStep("");
      setErrorMsg(err?.data?.message || err?.message || "حدث خطأ أثناء تحديث بيانات الدرس");
      return;
    }

    // STEP 2 — Upload new PDF if selected
    if (newPdfFile) {
      try {
        setStep("pdf");
        const fd = new FormData();
        fd.append("file", newPdfFile);
        await uploadPdf({ lessonId: id, formData: fd }).unwrap();
      } catch (err) {
        setPdfError(err?.data?.message || err?.message || "فشل رفع ملف PDF — باقي التعديلات تمت حفظها");
      }
    }

    // STEP 3 — Update video if provided
    if (videoUrl.trim()) {
      try {
        setStep("video");
        await setVideoApi({ lessonId: id, video_link: videoUrl, status: "active" }).unwrap();
      } catch (err) {
        setVideoError(err?.data?.message || err?.message || "فشل حفظ رابط الفيديو — باقي التعديلات تمت حفظها");
      }
    }

    setStep("");
    navigate("/admin/lessons");
  };

  if (loadingLesson) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`تعديل الدرس: ${lesson?.title || ""}`}
        subtitle="تعديل الشروحات ومرفقات ملفات الـ PDF والفيديو"
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin" },
          { label: "الدروس", href: "/admin/lessons" },
          { label: "تعديل الدرس" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
        {pdfError && (
          <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-200 text-xs font-semibold">
            ⚠️ {pdfError}
          </div>
        )}
        {videoError && (
          <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-200 text-xs font-semibold">
            ⚠️ {videoError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                البيانات الأساسية
              </h3>

              <Input
                label="عنوان الدرس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Textarea
                label="وصف الدرس"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                فيديو الشرح (YouTube)
              </h3>

              <Input
                label="رابط الفيديو"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              {videoUrl && (
                <div className="mt-4">
                  <LessonVideo videoUrl={videoUrl} />
                </div>
              )}
            </div>

            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
              <h3 className="text-base font-bold text-primary mb-3">
                ملف المذكرة (PDF)
              </h3>
              {lesson?.pdfUrl && !newPdfFile && (
                <div className="mb-3 p-3 bg-gray-50 border border-surface-border rounded-xl text-xs text-textSecondary flex items-center justify-between">
                  <span>الملف الحالي محفوظ في السيرفر</span>
                  <a
                    href={lesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyanAccent font-bold hover:underline"
                  >
                    معاينة الملف الحالي
                  </a>
                </div>
              )}
              <FileUpload
                label="استبدال أو رفع مذكرة جديدة"
                file={newPdfFile}
                onChange={(file) => setNewPdfFile(file)}
                onRemove={() => setNewPdfFile(null)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                التصنيف والترتيب
              </h3>

              <Select
                label="الصف الدراسي"
                options={classOptions}
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setUnitId("");
                  setPeriodId("");
                }}
                required
              />

              <Select
                label="الوحدة الدراسية"
                options={unitOptions}
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
              />

              <Select
                label="الفترة الدراسية (اختياري)"
                options={periodOptions}
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
              />


              <Select
                label="نوع الدرس وإمكانية الوصول"
                options={[
                  { value: "paid", label: "محتوى مدفوع (يتطلب اشتراك نشط)" },
                  { value: "free", label: "درس مجاني (متاح لجميع الطلاب بدون اشتراك)" },
                ]}
                value={isFree ? "free" : "paid"}
                onChange={(e) => setIsFree(e.target.value === "free")}
              />

              <Select
                label="حالة النشر"
                options={[
                  { value: "published", label: "منشور" },
                  { value: "draft", label: "مسودة" },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/lessons")}
              disabled={isUpdating || isUploadingPdf || isUpdatingVideo}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdating || isUploadingPdf || isUpdatingVideo}
              >
                {step === "lesson" ? "جاري حفظ التعديلات..." : step === "pdf" ? "جاري رفع PDF..." : step === "video" ? "جاري حفظ الفيديو..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
