import React from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { formatPrice } from "../../utils/cn";

export default function PlanCard({
  plan,
  onSubscribe,
  isSubscribing = false,
  isSubscribed = false,
  isPending = false,
}) {
  const periodLabel = {
    month: "شهرياً",
    term: "ترم دراسي",
    year: "سنوياً",
  }[plan.period?.type] || plan.period?.name || "فترة محددة";

  return (
    <div className="relative bg-white border border-surface-border rounded-2xl p-6 shadow-card hover:border-cyanAccent transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="cyan">{periodLabel}</Badge>
          {isSubscribed ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              مشترك حالياً
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              قيد المراجعة
            </span>
          ) : plan.isPopular ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-cyanAccent bg-cyan-50 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              الأكثر طلباً
            </span>
          ) : null}
        </div>

        <h3 className="text-xl font-black text-primary group-hover:text-cyanAccent transition-colors">
          {plan.name}
        </h3>
        {plan.class?.name && (
          <p className="text-xs text-textSecondary mt-1 font-medium">
            الصف: {plan.class.name}
          </p>
        )}

        <div className="mt-6 mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary">
              {formatPrice(plan.price)}
            </span>
            <span className="text-xs text-textSecondary font-medium">
              / {periodLabel}
            </span>
          </div>
        </div>

        <ul className="space-y-3 border-t border-surface-border pt-5 mb-6 text-xs text-textSecondary">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>مشاهدة غير محدودة لجميع شروحات الفترة</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>تحميل مذكرات ومرفقات PDF الأصلية</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>محتوى منظم ومفهرس طبقاً للمنهج الوزاري</span>
          </li>
        </ul>
      </div>

      <Button
        variant={isSubscribed ? "outline" : "primary"}
        size="md"
        isLoading={isSubscribing}
        disabled={isSubscribed || isPending}
        onClick={() => onSubscribe(plan)}
        className="w-full"
      >
        {isSubscribed ? "أنت مشترك بالفعل" : isPending ? "الطلب قيد المراجعة" : "اشترك الآن"}
      </Button>
    </div>
  );
}
