// api/patientApi.js
import axiosInstance from "./axios";



export const getPatients = (filters = {}) => {
  return axiosInstance.get("/patients/", { params: filters });
};