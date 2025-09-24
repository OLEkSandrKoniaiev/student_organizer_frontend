import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://student-organizer-backend.onrender.com";

export interface IUserProfile {
  username: string;
  email: string;
  photo: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  done: boolean;
  files: string[] | null;
}

export interface ITasksResponse {
  tasks: ITask[];
  taskTotalCount: number;
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

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data; // { message: "...", accessToken: "..." }
};

export const getCurrentUser = async (): Promise<IUserProfile> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const deleteUserPhoto = async (): Promise<void> => {
  await api.delete("/users/photo");
};

export const getTasks = async (
  page: number,
  tasksPerPage: number,
): Promise<ITasksResponse> => {
  const response = await api.get("/tasks/all", {
    params: { page, tasksPerPage },
  });
  return response.data;
};

export const markTaskDone = async (taskId: string): Promise<void> => {
  await api.patch(`/tasks/${taskId}/done`);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

export const toggleTaskDone = async (
  taskId: string,
  done: boolean,
): Promise<ITask> => {
  const formData = new FormData();
  formData.append("done", String(done));

  const { data } = await api.patch(`/tasks/${taskId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getTaskById = async (taskId: string): Promise<ITask> => {
  const { data } = await api.get(`/tasks/${taskId}`);
  return {
    ...data,
    files: data.files ? JSON.parse(data.files) : [],
  };
};

export default api;
