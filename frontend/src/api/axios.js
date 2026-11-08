import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate Axios instance for refreshing tokens
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple refresh requests at the same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/token/refresh/")
    ) {
      return Promise.reject(error);
    }

    // If another request is already refreshing the token,
    // wait for that refresh request to complete.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const response = await refreshApi.post(
        "/api/auth/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      // Save newly generated tokens
      localStorage.setItem("access_token", newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      // Resolve all requests waiting for refresh
      processQueue(null, newAccessToken);

      // Retry original failed request
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;