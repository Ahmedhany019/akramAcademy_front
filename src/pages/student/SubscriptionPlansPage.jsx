import React, { useState } from "react";
import {
  useGetPlansQuery,
  useGetClassesQuery,
  useGetSubscriptionsQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetMeQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../components/common/PageHeader";
import PlanCard from "../../components/subscriptions/PlanCard";
import Skeleton from "../../components/common/Skeleton";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import { formatPrice } from "../../utils/cn";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPlansPage() {
  const { data: meData } = useGetMeQuery();
  const user = meData?.data?.user || meData?.user || meData?.data || {};
  const studentGradeId = user?.profile?.grade_level || user?.grade_level || user?.profile?.grade_level_id || user?.class_id;

  const { data: plansData, isLoading: isLoadingPlans } = useGetPlansQuery();
  const { data: classesData, isLoading: isLoadingClasses } = useGetClassesQuery();
  const { data: subsData } = useGetSubscriptionsQuery();
  const { data: ordersData } = useGetOrdersQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const plans = plansData?.data || plansData || [];
  const allClasses = classesData?.data || classesData || [];
  const subscriptions = subsData?.data || subsData || [];
  const orders = ordersData?.data || ordersData || [];
  const navigate = useNavigate();

  const isStudentRestricted = user?.role !== "admin" && Boolean(studentGradeId);

  const classes = Array.isArray(allClasses)
    ? isStudentRestricted
      ? allClasses.filter((cls) => String(cls.id) === String(studentGradeId))
      : allClasses
    : [];

  const [selectedClassId, setSelectedClassId] = useState("all");

  const effectiveClassFilter = isStudentRestricted
    ? String(studentGradeId)
    : selectedClassId;

  const classOptions = [
    { value: "all", label: "جميع الصفوف الدراسية" },
    ...(Array.isArray(classes)
      ? classes.map((cls) => ({
          value: String(cls.id),
          label: cls.name,
        }))
      : []),
  ];

  const filteredPlans = Array.isArray(plans)
    ? effectiveClassFilter === "all"
      ? plans
      : plans.filter(
          (p) => String(p.class?.id || p.class_id) === String(effectiveClassFilter)
        )
    : [];

  const activePlanIds = subscriptions
    .filter((s) => s.status === "active")
    .map((s) => Number(s.plan_id || s.plan?.id));

  const pendingPlanIds = orders
    .filter((o) => o.status === "pending" || o.status === "awaiting_payment")
    .map((o) => Number(o.subscription_plan_id || o.plan?.id));

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleSubscribeClick = (plan) => {
    if (activePlanIds.includes(Number(plan.id))) {
      alert("أنت مشترك بالفعل في هذه الخطة.");
      return;
    }
    if (pendingPlanIds.includes(Number(plan.id))) {
      alert("لديك طلب اشتراك قيد المراجعة بالفعل لهذه الخطة. يرجى متابعة حالة الطلب في صفحة الطلبات.");
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;
    try {
      const res = await createOrder({ subscription_plan_id: selectedPlan.id }).unwrap();
      setCreatedOrder(res.data || res);
      setSelectedPlan(null);
      setSuccessModal(true);
    } catch (err) {
      alert(err?.data?.message || err?.message || "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.");
    }
  };

  const isLoading = isLoadingPlans || isLoadingClasses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="خطط الاشتراك"
        subtitle="اختر الخطة المناسبة لصفك الدراسي وابدأ التعلم فوراً"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "خطط الاشتراك" },
        ]}
      />

      {/* Class Filter Select - only shown if not restricted to a single grade */}
      {!isStudentRestricted && (
        <div className="w-full sm:w-72">
          <Select
            label="تصفية حسب الصف الدراسي"
            options={classOptions}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            placeholder="اختر الصف الدراسي..."
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSubscribed={activePlanIds.includes(Number(plan.id))}
              isPending={pendingPlanIds.includes(Number(plan.id))}
              onSubscribe={handleSubscribeClick}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-surface-border rounded-2xl text-textSecondary text-sm">
          لا توجد خطط اشتراك متاحة لهذا الصف حالياً
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedPlan && (
        <Modal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title="تأكيد الاشتراك"
        >
          <div className="space-y-4">
            <p className="text-sm text-textSecondary leading-relaxed">
              أنت على وشك إنشاء طلب اشتراك في الخطة التالية:
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-surface-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">اسم الخطة:</span>
                <span className="font-bold text-primary">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">المبلغ المطلوب:</span>
                <span className="font-bold text-cyanAccent">
                  {formatPrice(selectedPlan.price)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
  <p className="font-bold">طريقة السداد:</p>

  <p>
    يرجى تحويل قيمة الاشتراك على الرقم التالي:
  </p>

  <p className="font-bold text-base">
    01018049632
  </p>

  <p>
    عبر <span className="font-bold">Vodafone Cash</span> أو{" "}
    <span className="font-bold">InstaPay</span>.
  </p>

  <p>
    بعد التحويل، يرجى إرسال إيصال التحويل أو لقطة شاشة للعملية عبر واتساب،
    ليتم مراجعة الطلب وتفعيل الحساب.
  </p>
</div>
            <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
              <Button
                variant="outline"
                onClick={() => setSelectedPlan(null)}
                disabled={isCreatingOrder}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmSubscription}
                isLoading={isCreatingOrder}
              >
                تأكيد وإنشاء الطلب
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="تم إنشاء الطلب بنجاح"
      >
        <div className="space-y-4 text-center py-2">
          <p className="text-sm text-textSecondary leading-relaxed">
            تم تسجيل طلب اشتراكك بنجاح برقم:{" "}
            <span className="font-bold text-primary">
              #{createdOrder?.id || ""}
            </span>
          </p>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-2 text-right">
            <p className="font-bold text-sm">خطوة تأكيد السداد:</p>
            <p>يرجى إرسال صورة التحويل مع ذكر رقم الطلب (#{createdOrder?.id || ""}) عبر واتساب لتفعيل الاشتراك مباشرة.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-surface-border">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`السلام عليكم، قمت بإنشاء طلب اشتراك رقم #${createdOrder?.id || ""} وأريد تأكيد الدفع.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-soft"
            >
              إرسال إشعار الدفع عبر واتساب
            </a>
            <Button
              variant="outline"
              onClick={() => {
                setSuccessModal(false);
                navigate("/orders");
              }}
            >
              الذهاب إلى طلباتي
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
