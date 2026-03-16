import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL =
  typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL
    : "http://192.168.1.9:3000";

const api = axios.create({
  baseURL,
});

// Tự động chèn token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
