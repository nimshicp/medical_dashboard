import axiosInstance from "./axios";

export const register = (data) =>
  axiosInstance.post("/api/auth/register/", data);

export const login = (data) =>
  axiosInstance.post("/api/auth/login/", data);

export const logout = () =>
  axiosInstance.post("/api/auth/logout/");

export const refreshToken = () =>
  axiosInstance.post("/api/auth/refresh/");

export const getMe = () =>
  axiosInstance.get("/api/auth/me/");

export const forgotPassword = (data) =>
  axiosInstance.post("/api/auth/forgot-password/", data);

export const resetPassword = (uid, token, data) =>
  axiosInstance.post(`/api/auth/reset-password/${uid}/${token}/`, data);

export const getDoctors = () =>
  axiosInstance.get("/api/auth/doctors/");