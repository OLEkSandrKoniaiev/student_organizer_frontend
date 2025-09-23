import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:3000";

export interface IUserProfile {
  username: string;
  email: string;
  photo: string;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Додаємо interceptor для автоматичного додавання токена, якщо він є
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { accessToken: "..." }
};

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await api.post("/auth/register", { username, email, password });
  return response.data; // { message: "...", accessToken: "..." }
};

export const getCurrentUser = async (): Promise<IUserProfile> => {
  const response = await api.get("/users/me");
  return response.data;
};

export default api;
