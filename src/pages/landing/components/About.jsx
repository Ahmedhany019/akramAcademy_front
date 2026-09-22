import React from "react";
import { about, certificate1, certificate2, line } from "../../../assets/images";

const About = () => {
  return (
    <div className="md:px-8 py-6 mx-auto bg-[#0f1d41]">
      <div className="flex mt-10 flex-col md:flex-row gap-8 w-full h-full justify-between items-center text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[720px] rounded-2xl border border-[#587aa9] px-5 pb-5 pt-8">

            {/* Title */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0f1d41] px-6">
              <h2 className="text-2xl font-bold text-[#f1c40f]">
                شهاداتي ✎
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* DELF */}
              <div className="text-center">
                <div className="h-[130px] w-full overflow-hidden rounded-lg bg-white p-2">
                  <img
                    src={certificate2}
                    alt="DELF Certificate"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mt-3 text-sm leading-5">
                  حاصل على شهادة
                  <br />
                  <span className="font-bold">
                    DELF A1/A2
                  </span>
                  <br />
                  من المركز الثقافي الفرنسي
                </p>
              </div>

              {/* Mansoura */}
              <div className="text-center">
                <div className="h-[130px] w-full overflow-hidden rounded-lg bg-white p-2">
                  <img
                    src={certificate1}
                    alt="Mansoura University Certificate"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mt-3 text-sm leading-5">
                  خريج كلية التربية
                  <br />
                  <span className="font-bold">
                    جامعة المنصورة
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-4 justify-center relative">
          <div className="">
            <h1 className="text-4xl font-bold text-start mb-10 relative">
              من أنا؟
              <img
                src={line}
                alt="line"
                className="absolute -right-5 -bottom-[30px] w-[50%] "
              />
            </h1>
            <p className="text-md w-full text-start">
              أنا أكرم ابراهيم .. مدرس اللغه الفرنسية
              <br />
              خبرة 10 سنين في تدريس جميع المراحل..
              <br />
              اهدف دائما الي تقديم أسلوب تعليمي بسيط
              <br />
              وممتع يحقق لك أفضل النتائج
            </p>
          </div>
          <div className=" w-[200px] h-[200px] overflow-hidden">
            <img
              src={about}
              alt="about"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
