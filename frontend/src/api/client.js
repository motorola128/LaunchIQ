import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const apiClient = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
  },
  predict: {
    run: (payload) => api.post("/api/predict", payload),

    getHistory: () => api.get("/api/history"),

    getPrediction: (id) =>
    api.get(`/api/history/${id}`),
    getDashboard: () =>
    api.get("/api/dashboard"),
  },
};

export default apiClient;

