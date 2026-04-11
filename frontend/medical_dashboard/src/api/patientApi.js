// api/patientApi.js
import api from "./api";

export const getPatients = (filters = {}) => {
  return api.get("/patients/", { params: filters });
};
