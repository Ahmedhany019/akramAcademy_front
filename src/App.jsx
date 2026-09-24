import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import StudentLayout from "./components/layout/StudentLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { StudentRoute, AdminRoute } from "./components/common/RouteGuards";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ClassContentPage from "./pages/student/ClassContentPage";
import LessonViewPage from "./pages/student/LessonViewPage";
import SubscriptionPlansPage from "./pages/student/SubscriptionPlansPage";
import SubscriptionsPage from "./pages/student/SubscriptionsPage";
import OrdersPage from "./pages/student/OrdersPage";
import ProfilePage from "./pages/student/ProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClassesPage from "./pages/admin/AdminClassesPage";
import AdminUnitsPage from "./pages/admin/AdminUnitsPage";
import AdminLessonsPage from "./pages/admin/AdminLessonsPage";
import CreateLessonPage from "./pages/admin/CreateLessonPage";
import EditLessonPage from "./pages/admin/EditLessonPage";
import AdminLessonViewPage from "./pages/admin/AdminLessonViewPage";
import AdminPeriodsPage from "./pages/admin/AdminPeriodsPage";
import AdminPlansPage from "./pages/admin/AdminPlansPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminStudentDetailsPage from "./pages/admin/AdminStudentDetailsPage";
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import LandingPage from "./pages/landing/Landing";
export default function App() {
  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* STUDENT ROUTES — admins redirected to /admin */}
      <Route element={<StudentRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/classes/:classId" element={<ClassContentPage />} />
          <Route path="/classes/:classId/periods" element={<ClassContentPage />} />
          <Route path="/classes/:classId/units/:unitId" element={<ClassContentPage />} />
          <Route path="/units/:unitId" element={<ClassContentPage />} />
          <Route path="/lessons/:lessonId" element={<LessonViewPage />} />
          <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ADMIN PROTECTED ROUTES */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="classes" element={<AdminClassesPage />} />
          <Route path="units" element={<AdminUnitsPage />} />
          <Route path="lessons" element={<AdminLessonsPage />} />
          <Route path="lessons/create" element={<CreateLessonPage />} />
          <Route path="lessons/:id" element={<AdminLessonViewPage />} />
          <Route path="lessons/:id/edit" element={<EditLessonPage />} />
          <Route path="periods" element={<AdminPeriodsPage />} />
          <Route path="subscription-plans" element={<AdminPlansPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="students/:id" element={<AdminStudentDetailsPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
