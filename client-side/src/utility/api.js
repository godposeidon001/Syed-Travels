import axios from "axios";
import { auth } from "../firebase/firebase.config";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config?.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
