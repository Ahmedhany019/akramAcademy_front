import React from "react";
import { Target, Headphones, Monitor, Users, Crown } from "lucide-react";
import { flag, brush } from "../../../assets/images";

const featuresData = [
  {
    icon: Target,
    title: "نتائج مضمونة",
    desc: "بخبرة 10 سنين من قلب الميدان",
  },
  {
    icon: Headphones,
    title: "متابعة مستمرة",
    desc: "دعم دائم و حل لجميع استفساراتك",
  },
  {
    icon: Monitor,
    title: "أونلاين - سنتر",
    desc: "اختر ما يناسبك وتعلم بكل راحة",
  },
  {
    icon: Users,
    title: "مناهج متكاملة",
    desc: "شرح مبسط وشرح كامل لكل أجزاء المنهج",
  },
];

const Features = () => {
  return (
    <div className="w-full relative z-[888] rounded-tr-[50px]">
      <img
        className="w-[200px] absolute z-[999] top-[-168px] left-0 hidden sm:block"
        src={flag}
        alt="french flag"
      />
      <div className="bg-white rounded-tr-[40px] md:rounded-tr-[60px] md:px-8 py-6 mx-auto">
        <div
          dir="rtl"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#7656ff]/30"
        >
          {/* Badge Section */}
          <div className="flex flex-col items-center text-center px-3">
            <div
              style={{
                backgroundImage: `url(${brush})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className=" text-white w-[200px] justify-center px-5 py-4 rounded-xl flex items-center gap-2 relative overflow-hidden mb-2 transition-transform -rotate-[8deg]"
            >
              <Crown className="w-4 h-4 text-[#f1c40f] mt-1" />
              <span className="font-extrabold pl-4 text-sm tracking-wide">
                #ملك_فرنسا
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-700 leading-snug">
              أقوى كورسات اللغة الفرنسية
              <br />
              لكافة المراحل الثانوية والإعدادية
            </p>
          </div>

          {/* Features Items */}
          {featuresData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0f1d41] text-white flex items-center justify-center mb-2.5 shadow-sm transition-transform duration-300 hover:scale-110">
                  <Icon className="w-6 h-6 " />
                </div>
                <h4 className="font-extrabold text-[#31377a] text-lg mb-1">
                  {item.title}
                </h4>
                <p className="text-[14px] text-[#31377a] font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
