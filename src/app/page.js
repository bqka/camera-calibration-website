"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import trash from '@/assets/trash.svg'
import close from '@/assets/close.svg'

export default function cameraFeed() {
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
          if(videoDevices.length > 0){
            setSelectedCamera(videoDevices[0].deviceId);
          }
        } catch(err) {
          console.error("Error fetching cameras", err);
        }
    };

    getCameras();
    enableVideoStream();
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
    if(!isCameraOn) {
      alert("No Camera is selected");
      return;
    }
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
  }

  const clearScreenshots = () => {
    setCapturedImages([]);
  }

  const deleteScreenshot = (index) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }
  
  return (
      <div className="flex flex-row">
      <div className="flex flex-col items-center justify-center rounded-2xl p-4">
        <div className="flex flex-col gap-4 w-[595px]">
          <div className={`relative h-[335px] max-w-full bg-background-100 rounded-xl -z-10 overflow-hidden -scale-x-100`}>
            {mediaStream != null ? 
            <video ref={videoRef} autoPlay={true} className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
          : <div className="h-full w-full bg-gray-700 -scale-x-100 flex justify-center items-center text-text-50 font-semibold">
            <div>Camera is Off</div>
          </div>
          }
          </div>
          <div className="flex flex-row items-center gap-4 justify-items-start w-full">
            <button
              className="px-4 bg-secondary-50 text-text-950 font-semibold rounded-lg shadow-md py-2"
              onClick={isCameraOn ? disableVideoStream : enableVideoStream}
              >
              {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            </button>
            <button
              className="bg-accent-500 text-text-950 p-2 font-semibold rounded-lg shadow-md hover:bg-accent-400"
              onClick={handleScreenshot}>Take Screenshot</button>
              <div className="max-w-[180px]">
                <div className="relative">
                <select
                  className="px-2 bg-primary-50 py-2 rounded-lg w-full"
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  value={selectedCamera || ""}
                >
                  {cameras.map((camera, index) => (
                    <option 
                      key={camera.deviceId} 
                      value={camera.label} 
                    >
                      {camera.label || `Camera ${index + 1}`}
                    </option>
                  ))}
                </select>
                  </div>
              </div>
          </div>
        </div>

        </div>

      <div className="w-[260px] h-[460px] flex flex-col items-center">
        <div className="flex flex-row w-full">
          <h2 className="text-lg font-bold flex-1">Captured Screenshots</h2>
          {/* <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            onClick={clearScreenshots}
          >Clear Screenshots</button> */}
          <a onClick={clearScreenshots} className="hover:cursor-pointer">
            <Image src={trash} alt="Delte all Screenshots" className="h-[24px] w-auto"></Image>
          </a>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {capturedImages.map((image, index) => (
            <div key={index} className="group aspect-[1.60] h-[120px] relative">
              <img src={image} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              <a onClick={() => deleteScreenshot(index)}>
                <Image src={close} alt="Delete Screenshot" className="absolute opacity-0 group-hover:opacity-100 hover:cursor-pointer top-0 right-0 w-auto h-[25px] translate-x-1/2 -translate-y-1/2"></Image>
              </a>
            </div>
          ))}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

      </div>
    </div>
  );
}