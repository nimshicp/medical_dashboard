import React, { useState } from "react";
import { uploadMedia } from "../../api/mediaApi";

const MediaUpload = ({ patientId, refresh }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient", patientId);

    try {
      await uploadMedia(formData);
      alert("Uploaded successfully");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h3>Upload Media</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default MediaUpload;