import api from "./api";

export const register = (data) =>
  api.post("/auth/register/", data);

export const login = (data) =>
  api.post("/auth/login/", data);

export const logout = () =>
  api.post("/auth/logout/");

export const refreshToken = () =>
  api.post("/auth/refresh/");

export const getMe = () =>
  api.get("/auth/me/");

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password/", data);

export const resetPassword = (uid, token, data) =>
  api.post(`/auth/reset-password/${uid}/${token}/`, data);

export const getDoctors = () =>
  api.get("/auth/doctors/");
