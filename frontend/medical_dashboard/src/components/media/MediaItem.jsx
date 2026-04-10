import React from "react";

const MediaItem = ({ item }) => {
  return (
    <div style={{ border: "1px solid gray", margin: "5px", padding: "5px" }}>
      <p>{item.file}</p>
      <p>Status: {item.status}</p>
    </div>
  );
};

export default MediaItem;