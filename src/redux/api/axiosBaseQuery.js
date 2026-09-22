import { axiosInstance } from "../../utils/axiosInstance";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      return {
        data: result.data,
      };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || {
            message: axiosError.message || "حدث خطأ غير متوقع",
          },
        },
      };
    }
  };
