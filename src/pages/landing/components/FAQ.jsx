import React, { useState } from "react";
import { ChevronDown, HelpCircle, UserPlus, LogIn, CreditCard } from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "إزاي أعمل إنشاء حساب في المنصة؟",
    icon: UserPlus,
    answer:
      "1. اضغط على زر 'سجل الآن' أو 'إنشاء حساب' الموجود في أعلى الصفحة.\n2. املأ بياناتك الأساسية (الاسم، البريد الإلكتروني، رقم الهاتف، ورقم ولي الأمر، وكلمة المرور).\n3. اختر المرحلة الدراسية الخاصة بك.\n4. اضغط على 'تأكيد التسجيل' وسيتم تفعيل حسابك مباشرة للبدء في تصفح المنصة والمحتوى.",
  },
  {
    id: 2,
    question: "إزاي أعمل تسجيل دخول؟",
    icon: LogIn,
    answer:
      "1. اضغط على زر 'سجل دخول' من القائمة الرئيسية.\n2. اكتب البريد الإلكتروني وكلمة المرور.\n3. اضغط على 'دخول' للانتقال إلى لوحة التحكم الخاصة بك ومتابعة دروسك ومحاضراتك.",
  },
  {
    id: 3,
    question: "إزاي هشترك في المنصة؟",
    icon: CreditCard,
    answer:
      "1. بعد تسجيل الدخول، تصفح قسم 'الاشتراكات' أو 'الكورسات' المتاحة لمرحلتك الدراسية.\n2. اختر الباقة المناسبة لك (شهرية، ترم كامل، أو كورس تأسيسي) واضغط على 'اشترك الآن'.\n3. هتعمل طلب عن طريق ارسال سعر الاشتراك علي الرقم الي ظاهر\n4. يتم تفعيل محتوى الباقة في حسابك فور قبول الطلب من الادمن  .",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section dir="rtl" className="w-full bg-white py-16 px-4 md:px-8 border-t border-gray-100">
      <div className="max-w-[900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#5551ff]/10 text-[#5551ff] px-4 py-1.5 rounded-full text-xs font-bold mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة الأكثر شيوعاً</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b]">
            الأسئلة الشائعة والمتكررة
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            كل ما تريد معرفته عن كيفية التسجيل والاشتراك واستخدام المنصة
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#5551ff] bg-[#f8faff] shadow-md shadow-[#5551ff]/5"
                    : "border-gray-200/80 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-[#5551ff] text-white"
                          : "bg-gray-100 text-[#1e293b]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-base md:text-lg font-bold text-[#1e293b]">
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-[#5551ff]/10 text-[#5551ff]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100/80 mt-1 whitespace-pre-line font-medium">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
