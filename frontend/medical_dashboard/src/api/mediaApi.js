// api/mediaApi.js
import axiosInstance from "./axios";

// Get media for a patient
export const getMedia = (patientId) => {
  return axiosInstance.get(`/media/?patient=${patientId}`);
};

// Upload media
export const uploadMedia = (formData) => {
  return axiosInstance.post("/media/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};