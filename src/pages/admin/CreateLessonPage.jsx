import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateLessonMutation,
  useUploadLessonPdfMutation,
  useSetLessonVideoMutation,
  useGetClassesQuery,
  useGetClassUnitsQuery,
  useGetPeriodsQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/common/Button";
import LessonVideo from "../../components/lessons/LessonVideo";
import { formatDate } from "../../utils/cn";

export default function CreateLessonPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState("published");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [step, setStep] = useState("");

  const { data: classesData } = useGetClassesQuery();
  const { data: unitsData } = useGetClassUnitsQuery(classId, { skip: !classId });
  const { data: periodsData } = useGetPeriodsQuery();

  const classes = classesData?.data || classesData || [];
  const units = Array.isArray(unitsData?.data)
    ? unitsData.data
    : unitsData?.data?.units || unitsData || [];
  const periods = periodsData?.data || periodsData || [];

  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const [uploadLessonPdf, { isLoading: isUploadingPdf }] = useUploadLessonPdfMutation();
  const [setLessonVideo, { isLoading: isSavingVideo }] = useSetLessonVideoMutation();

  const isLoading = isCreating || isUploadingPdf || isSavingVideo;

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: String(c.id), label: c.name }))
    : [];

  const unitOptions = Array.isArray(units)
    ? units.map((u) => ({ value: String(u.id), label: u.name }))
    : [];

  const filteredPeriods = Array.isArray(periods)
    ? classId
      ? periods.filter((p) => String(p.class_id || p.class?.id) === String(classId))
      : periods
    : [];

  const periodOptions = filteredPeriods.map((p) => ({
    value: String(p.id),
    label: `${p.type === "year" ? "سنة" : p.type === "term" ? "ترم" : "شهر"} (${formatDate(p.start_date)} - ${formatDate(p.end_date)})`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setPdfError("");
    setVideoError("");

    if (!title.trim() || !classId || !unitId) {
      setErrorMsg("يرجى ملء الحقول الإلزامية (عنوان الدرس، الصف، الوحدة)");
      return;
    }

    let lessonId;

    // STEP 1 — Create lesson (JSON)
    try {
      setStep("lesson");
      const res = await createLesson({
        unit_id: Number(unitId),
        period_id: periodId ? Number(periodId) : null,
        title,
        description,
        status,
        is_free: isFree,
      }).unwrap();
      lessonId = res?.data?.id ?? res?.id;
    } catch (err) {
      setStep("");
      setErrorMsg(err?.data?.message || err?.message || "حدث خطأ أثناء إنشاء الدرس");
      return;
    }

    // STEP 2 — Upload PDF (multipart/form-data)
    if (pdfFile) {
      try {
        setStep("pdf");
        const fd = new FormData();
        fd.append("file", pdfFile);
        await uploadLessonPdf({ lessonId, formData: fd }).unwrap();
      } catch (err) {
        setPdfError(err?.data?.message || err?.message || "فشل رفع ملف PDF — الدرس تم إنشاؤه بنجاح");
      }
    }

    // STEP 3 — Set YouTube video (JSON)
    if (videoUrl.trim()) {
      try {
        setStep("video");
        await setLessonVideo({ lessonId, video_link: videoUrl, status: "active" }).unwrap();
      } catch (err) {
        setVideoError(err?.data?.message || err?.message || "فشل حفظ رابط الفيديو — الدرس تم إنشاؤه بنجاح");
      }
    }

    setStep("");
    navigate("/admin/lessons");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة درس جديد"
        subtitle="إدخال بيانات الشرح، الفيديو والمرفقات بصيغة PDF"
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin" },
          { label: "الدروس", href: "/admin/lessons" },
          { label: "درس جديد" },
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
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                البيانات الأساسية للدرس
              </h3>

              <Input
                label="عنوان الدرس"
                placeholder="مثال: شرح قانون نيوتن الأول وحل المسائل"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Textarea
                label="وصف الدرس وملاحظات الشرح"
                placeholder="محتوى وأهداف هذا الدرس..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Video & PDF Resource */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                فيديو الشرح (YouTube)
              </h3>

              <Input
                label="رابط فيديو يوتيوب"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              {videoUrl && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-textSecondary mb-2">
                    معاينة الفيديو المباشرة:
                  </p>
                  <LessonVideo videoUrl={videoUrl} />
                </div>
              )}
            </div>

            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft">
              <h3 className="text-base font-bold text-primary mb-3">
                ملف المذكرة (PDF)
              </h3>
              <FileUpload
                file={pdfFile}
                onChange={(file) => setPdfFile(file)}
                onRemove={() => setPdfFile(null)}
              />
            </div>
          </div>

          {/* Classification & Settings */}
          <div className="space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-primary mb-2">
                التصنيف والتبويب
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
                placeholder="اختر الصف أولاً"
                required
              />

              <Select
                label="الوحدة الدراسية"
                options={unitOptions}
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                placeholder={classId ? "اختر الوحدة" : "اختر الصف أولاً"}
                disabled={!classId}
                required
              />

              <Select
                label="الفترة الدراسية"
                options={periodOptions}
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                placeholder={classId ? "اختر الفترة" : "اختر الصف أولاً"}
                disabled={!classId}
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
                  { value: "published", label: "منشور ومتاح للطلاب" },
                  { value: "draft", label: "مسودة غير معلنة" },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-soft flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/lessons")}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                {step === "lesson" ? "جاري إنشاء الدرس..." : step === "pdf" ? "جاري رفع PDF..." : step === "video" ? "جاري حفظ الفيديو..." : "حفظ وإنشاء الدرس"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
