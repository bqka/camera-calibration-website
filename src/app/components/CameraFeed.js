"use client";

import React, { useRef, useState, useEffect } from "react";
import CameraControl from "./CameraControl";
import ScreenshotList from "./ScreenshotList";
import Canvas from "./Canvas";

export default function CameraFeed() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error fetching cameras", err);
      }
    };

    getCameras();
  }, []);

  const enableVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const disableVideoStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);

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

  const clearScreenshots = () => {
    setCapturedImages([]);
  };

  const deleteScreenshot = (index) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-center justify-center rounded-2xl p-4">
        <div className="flex flex-col gap-4 w-[595px]">
          <div className={`relative h-[335px] max-w-full bg-background-100 rounded-xl -z-10 overflow-hidden -scale-x-100`}>
            {mediaStream != null ? (
              <video ref={videoRef} autoPlay={true} className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <div className="h-full w-full bg-gray-700 -scale-x-100 flex justify-center items-center text-text-50 font-semibold">
                <div>Camera is Off</div>
              </div>
            )}
          </div>

          <CameraControl
            isCameraOn={isCameraOn}
            enableVideoStream={enableVideoStream}
            disableVideoStream={disableVideoStream}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            cameras={cameras}
            handleScreenshot={handleScreenshot}
          />
        </div>
      </div>

      <ScreenshotList
        capturedImages={capturedImages}
        clearScreenshots={clearScreenshots}
        deleteScreenshot={deleteScreenshot}
      />

      <Canvas videoRef={videoRef} canvasRef={canvasRef} setCapturedImages={setCapturedImages} />
    </div>
  );
}