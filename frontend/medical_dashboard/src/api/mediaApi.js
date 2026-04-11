import api from "./api";


export const getMedia = (patientId) => {
  return api.get(`/media/?patient=${patientId}`);
};


export const uploadMedia = (formData) => {
  return api.post("/media/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
