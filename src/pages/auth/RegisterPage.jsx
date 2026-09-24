import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation, useGetClassesQuery } from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { heroImage, loginImage, loginn, logo, logo2 } from "../../assets/images";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const { data: classesResponse } = useGetClassesQuery();
  const classes = classesResponse?.data || classesResponse || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({ value: c.id, label: c.name }))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !phone || !password ) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const response = await register({
        name,
        phone,
        parent_phone: parentPhone,
        email,
        password,
        grade_level: classId,
      }).unwrap();

      const userData = response.data?.user || response.user;
      const token = response.data?.accessToken || response.accessToken;

      dispatch(setCredentials({ user: userData, accessToken: token }));
      navigate("/login");
    } catch (err) {
      setErrorMsg(
        err.data?.message || err.message || "حدث خطأ أثناء إنشاء الحساب"
      );
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${loginn})` }}
      className="bg-no-repeat bg-cover min-h-screen flex items-center justify-center p-4 bg-surface-bg"
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-card border border-surface-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Form Container */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <img src={logo2} alt="Logo" className="h-10 w-auto mb-4" />
            <h1 className="text-2xl font-black text-primary">إنشاء حساب جديد</h1>
            <p className="text-xs text-textSecondary mt-1">
              سجل بياناتك للوصول إلى كافة الدروس والمذكرات
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="الاسم بالكامل"
              placeholder="أحمد محمد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="رقم هاتف الطالب"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="number"
              />
              <Input
                label="رقم ولي الأمر"
                placeholder="01xxxxxxxxx"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                type="number"
                required
              />

            </div>
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Select
              label="الصف الدراسي"
              options={classOptions}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="اختر الصف الدراسي"
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
              إنشاء الحساب
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-surface-border pt-4">
            <p className="text-xs text-textSecondary">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="font-bold text-cyanAccent hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-primary text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xs">
            <img
              src={heroImage}
              alt="Register"
              className="w-52 h-auto mx-auto mb-6 rounded-2xl shadow-xl border border-white/10"
            />
            <h2 className="text-xl font-black mb-2">رحلتك نحو التفوق تبدأ هنا</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              شروحات وافية ومتابعة دورية مستمرة لضمان تحقيق أعلى الدرجات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
