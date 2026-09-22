import React from "react";
import { Phone, MessageCircle, Crown, Send, Clock, Sparkles } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      dir="rtl"
      className="w-full relative py-16 px-4 md:px-8 bg-gradient-to-b from-[#0f1d41] to-[#0a142e] text-white overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f1c40f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1250px] mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-inner">
            <Crown className="w-4 h-4 text-[#f1c40f]" />
            <span className="text-xs font-bold text-[#f1c40f] tracking-wide">
              تواصل معنا مباشرة
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#f1c40f]" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white mb-3">
            جاهز تبدأ رحلتك في{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1c40f] via-amber-300 to-[#f1c40f]">
              الفرنسية؟
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 font-medium">
            فريق الدعم والمسيو في انتظارك للإجابة على جميع استفساراتك وحجز مكانك في الكورسات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Support Card */}
          <a
            href="https://wa.me/201505620105"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#25D366]/50 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 shadow-xl backdrop-blur-lg flex items-center justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-2xl group-hover:bg-[#25D366]/20 transition-colors pointer-events-none" />

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <MessageCircle className="w-8 h-8 fill-current" />
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#25D366]/20 text-[#25D366]">
                    دعم واتساب
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" /> متاح الآن
                  </span>
                </div>
                <div className="text-xl md:text-2xl font-black text-white font-mono tracking-wider mb-1">
                  01505620105
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  للدعم الفني وحجز الكورسات والاشتراكات
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-[#25D366] transition-all shrink-0 mr-2">
              <Send className="w-4 h-4 transform rotate-180" />
            </div>
          </a>

          {/* Direct Phone Card */}
          <a
            href="tel:01018049632"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f1c40f]/50 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 shadow-xl backdrop-blur-lg flex items-center justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f1c40f]/10 rounded-full blur-2xl group-hover:bg-[#f1c40f]/20 transition-colors pointer-events-none" />

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#f1c40f] text-[#0f1d41] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <Phone className="w-8 h-8 fill-current" />
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#f1c40f]/20 text-[#f1c40f]">
                    خط المسيو المباشر
                  </span>
                </div>
                <div className="text-xl md:text-2xl font-black text-white font-mono tracking-wider mb-1">
                  01018049632
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  للتواصل والاستفسارات الأكاديمية والمتابعة
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#0f1d41] group-hover:bg-[#f1c40f] transition-all shrink-0 mr-2">
              <Phone className="w-4 h-4" />
            </div>
          </a>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 max-w-4xl mx-auto rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-6 rounded-xs overflow-hidden border border-white/20 shrink-0">
              <span className="w-1/3 bg-[#0055A4]" />
              <span className="w-1/3 bg-white" />
              <span className="w-1/3 bg-[#EF4135]" />
            </span>
            <p className="text-xs md:text-sm text-gray-200 font-medium">
              كورسات أونلاين وسنتر لجميع المراحل الثانوية والإعدادية
            </p>
          </div>

          <a
            href="https://wa.me/201505620105"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#f1c40f] to-amber-400 text-[#0f1d41] font-extrabold text-xs md:text-sm hover:brightness-105 transition-all shadow-md shrink-0"
          >
            احجز مكانك الآن
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
