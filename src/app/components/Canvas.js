import React, { useRef, useEffect } from 'react';

const Canvas = ({ videoRef, canvasRef, setCapturedImages }) => {
  const handleScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const screenshot = canvas.toDataURL("image/png");

      setCapturedImages((prevImages) => [...prevImages, screenshot]);
    }
  };

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default Canvas;