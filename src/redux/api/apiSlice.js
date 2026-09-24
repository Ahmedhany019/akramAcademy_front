import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "User",
    "Classes",
    "Units",
    "Lessons",
    "LessonDetails",
    "Periods",
    "Plans",
    "Subscriptions",
    "Orders",
    "Students",
    "Analytics",
  ],
  endpoints: (builder) => ({
    // AUTH
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // CLASSES
    getClasses: builder.query({
      query: () => ({
        url: "/classes",
        method: "GET",
      }),
      providesTags: ["Classes"],
    }),
    getClassUnits: builder.query({
      query: (classId) => ({
        url: `/classes/${classId}/units`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        { type: "Units", id: classId },
        "Units",
      ],
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: "/classes",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Classes"],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Classes"],
    }),

    // UNITS
    createUnit: builder.mutation({
      query: (data) => ({
        url: "/units",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Units", "Classes"],
    }),
    updateUnit: builder.mutation({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Units", "Classes"],
    }),

    // LESSONS
    getLessons: builder.query({
      query: (params) => ({
        url: "/lessons",
        method: "GET",
        params,
      }),
      providesTags: ["Lessons"],
    }),
    getLesson: builder.query({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LessonDetails", id }],
    }),
    getLessonPdf: builder.query({
      query: (id) => ({
        url: `/lessons/${id}/pdf`,
        method: "GET",
      }),
    }),
    getLessonVideo: builder.query({
      query: (id) => ({
        url: `/lessons/${id}/video`,
        method: "GET",
      }),
    }),
    createLesson: builder.mutation({
      query: (data) => ({
        url: "/lessons",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Lessons", "Units"],
    }),
    updateLesson: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Lessons",
        "Units",
        { type: "LessonDetails", id },
      ],
    }),
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lessons", "Units"],
    }),
    publishLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "Lessons",
        "Units",
        { type: "LessonDetails", id },
      ],
    }),
    unpublishLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}/unpublish`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "Lessons",
        "Units",
        { type: "LessonDetails", id },
      ],
    }),
    uploadLessonPdf: builder.mutation({
      query: ({ lessonId, formData }) => ({
        url: `/lessons/${lessonId}/pdf`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        { type: "LessonDetails", id: lessonId },
        "Lessons",
      ],
    }),
    setLessonVideo: builder.mutation({
      query: ({ lessonId, video_link, status = "active" }) => ({
        url: `/lessons/${lessonId}/video`,
        method: "POST",
        data: { video_link, status },
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        { type: "LessonDetails", id: lessonId },
        "Lessons",
      ],
    }),

    // PERIODS
    getPeriods: builder.query({
      query: (params) => ({
        url: "/subscription-periods",
        method: "GET",
        params,
      }),
      providesTags: ["Periods"],
    }),
    createPeriod: builder.mutation({
      query: (data) => ({
        url: "/subscription-periods",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Periods"],
    }),
    updatePeriod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription-periods/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Periods"],
    }),

    // PLANS
    getPlans: builder.query({
      query: (params) => ({
        url: "/subscription-plans",
        method: "GET",
        params,
      }),
      providesTags: ["Plans"],
    }),
    createPlan: builder.mutation({
      query: (data) => ({
        url: "/subscription-plans",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription-plans/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Plans"],
    }),

    // ORDERS
    getOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Orders", "Subscriptions"],
    }),
    approveOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders", "Subscriptions", "Analytics"],
    }),
    rejectOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders", "Subscriptions", "Analytics"],
    }),

    // SUBSCRIPTIONS
    getSubscriptions: builder.query({
      query: (params) => ({
        url: "/subscriptions",
        method: "GET",
        params,
      }),
      providesTags: ["Subscriptions"],
    }),

    // STUDENTS (ADMIN)
    getStudents: builder.query({
      query: (params) => ({
        url: "/students",
        method: "GET",
        params,
      }),
      providesTags: ["Students"],
    }),
    getStudentById: builder.query({
      query: (id) => ({
        url: `/students/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Students", id }],
    }),
    getStudentOrdersAndSubscriptions: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/orders-and-subscriptions`,
        method: "GET",
      }),
      providesTags: (result, error, studentId) => [
        { type: "Students", id: studentId },
        "Orders",
        "Subscriptions",
      ],
    }),

    // ANALYTICS
    getDashboard: builder.query({
      query: () => ({
        url: "/analytics/dashboard",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetClassesQuery,
  useGetClassUnitsQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useGetLessonsQuery,
  useGetLessonQuery,
  useGetLessonPdfQuery,
  useGetLessonVideoQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  usePublishLessonMutation,
  useUnpublishLessonMutation,
  useUploadLessonPdfMutation,
  useSetLessonVideoMutation,
  useGetPeriodsQuery,
  useCreatePeriodMutation,
  useUpdatePeriodMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useApproveOrderMutation,
  useRejectOrderMutation,
  useGetSubscriptionsQuery,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentOrdersAndSubscriptionsQuery,
  useGetDashboardQuery,
} = apiSlice;
