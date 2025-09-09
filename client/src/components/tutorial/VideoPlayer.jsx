import React from 'react';

const VideoPlayer = ({ src, className = '' }) => {
  return (
    <video 
      className={`${className}`}
      src={src}
      autoPlay
      loop
      muted
    />
  );
};

export default VideoPlayer;