import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/pinia/stores/user";
import { getToken } from "@/common/utils/cache/cookies";
import axios from "axios";
import { get, merge } from "lodash-es";

function logout() {
  useUserStore().logout();
  location.reload();
}

function createInstance() {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => {
      const apiData = response.data;
      const responseType = response.request?.responseType;
      if (responseType === "blob" || responseType === "arraybuffer")
        return apiData;

      const code = apiData.code;
      if (code === undefined) {
        ElMessage.error("Code Error");
        return Promise.reject(new Error("Code Error"));
      }
      switch (code) {
        case 0:
          return apiData;
        case 401:
          return logout();
        default:
          ElMessage.error(apiData.message || "Error");
          return Promise.reject(new Error("Error"));
      }
    },
    (error) => {
      const status = get(error, "response.status");
      const message = get(error, "response.data.message");

      switch (status) {
        case 400:
          error.message = "BAD REQUEST";
          break;
        case 401:
          error.message = message || "Unauthorized";
          logout();
          break;
        case 403:
          error.message = message || "Forbidden";
          break;
        case 404:
          error.message = "404 Not Found";
          break;
        case 500:
          error.message = "500 Internal Server Error";
          break;
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    },
  );
  return instance;
}

function createRequest(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = getToken();
    const defaultConfig: AxiosRequestConfig = {
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      },
      data: {},
      timeout: 5000,
      withCredentials: false,
    };
    const mergeConfig = merge(defaultConfig, config);
    return instance(mergeConfig);
  };
}
const instance = createInstance();

export const request = createRequest(instance);
