import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let storeRef = null;

export const injectStore = (store) => {
  storeRef = store;
};

// Request interceptor to add access token from Redux auth slice
axiosInstance.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.accessToken;
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Let browser/Axios set the correct Content-Type + boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignore refresh endpoint itself to avoid infinite loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt token refresh
        const res = await axiosInstance.post("/auth/refresh");
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;

        if (newToken && storeRef) {
          // Dynamic import to avoid circular dependencies
          const { setCredentials } = await import("../redux/slices/authSlice.js");
          storeRef.dispatch(
            setCredentials({
              accessToken: newToken,
              user: res.data?.data?.user || res.data?.user || storeRef.getState().auth.user,
            })
          );

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("No token returned from refresh");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (storeRef) {
          const { logout } = await import("../redux/slices/authSlice.js");
          storeRef.dispatch(logout());
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
