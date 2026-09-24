import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { loginImage, logo, loginn, logo2, heroImage } from "../../assets/images";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      const userData = response.data?.user || response.user;
      const token = response.data?.accessToken || response.accessToken;

      dispatch(setCredentials({ user: userData, accessToken: token }));

      if (userData?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات"
      );
    }
  };

  return (
    <div style={{backgroundImage:`url(${loginn})`}} className="bg-no-repeat bg-cover min-h-screen flex items-center justify-center p-4 bg-surface-bg">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-card border border-surface-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Right side form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <img src={logo2} alt="Logo" className="h-12 w-auto mb-6" />
            <h1 className="text-2xl font-black text-primary">تسجيل الدخول</h1>
            <p className="text-sm text-textSecondary mt-2">
              أهلاً بك مجدداً، أدخل بياناتك للمتابعة
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="البريد الالكتروني"
              type="email"
              placeholder="ادخل البريد الالكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-surface-border pt-6">
            <p className="text-xs text-textSecondary">
              ليس لديك حساب بعد؟{" "}
              <Link
                to="/register"
                className="font-bold text-cyanAccent hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        {/* Left side banner */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-primary text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xs">
            <img
              src={heroImage}
              alt="Education"
              className="w-56 h-auto mx-auto mb-8 rounded-2xl shadow-xl border border-white/10"
            />
            <h2 className="text-xl font-black mb-2">تعليم متميز لغد أفضل</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              انضم إلى منصة الأستاذ أكرم إبراهيم وتابع دروسك أولاً بأول بأعلى معايير الجودة والوضوح.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
