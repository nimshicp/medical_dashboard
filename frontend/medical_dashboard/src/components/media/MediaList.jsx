import React, { useEffect, useState } from "react";
import { getMedia } from "../../api/mediaApi";
import MediaItem from "./MediaItem";

const MediaList = ({ patientId }) => {
  const [media, setMedia] = useState([]);

  const fetchMedia = async () => {
    try {
      const res = await getMedia(patientId);
      setMedia(res.data);
    } catch (err) {
      console.error("Error fetching media", err);
    }
  };

  useEffect(() => {
    fetchMedia();

    const interval = setInterval(fetchMedia, 5000); // polling
    return () => clearInterval(interval);
  }, [patientId]);

  return (
    <div>
      <h3>Media Files</h3>
      {media.length === 0 ? (
        <p>No media</p>
      ) : (
        media.map((m) => <MediaItem key={m.id} item={m} />)
      )}
    </div>
  );
};

export default MediaList;