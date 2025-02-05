import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

const TryOn = ({ clothingImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: "tfjs" }
      );

      setLoading(false);

      const detectPose = async () => {
        if (videoRef.current && detector) {
          const poses = await detector.estimatePoses(videoRef.current);
          if (poses.length > 0) {
            drawPose(poses[0]);
          }
        }
        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    loadModel();

    // Start webcam stream
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        });
    }
  }, []);

  const drawPose = (pose) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw clothing on body keypoints
    const shoulders = pose.keypoints.filter((kp) =>
      ["left_shoulder", "right_shoulder"].includes(kp.name)
    );

    if (shoulders.length === 2) {
      const x = (shoulders[0].x + shoulders[1].x) / 2 - 50; // Center clothing
      const y = (shoulders[0].y + shoulders[1].y) / 2;
      const img = new Image();
      img.src = clothingImage;
      img.onload = () => {
        ctx.drawImage(img, x, y, 150, 200); // Adjust width & height as needed
      };
    }
  };

  return (
    <div className="relative w-full flex justify-center items-center">
      {loading && <p>Loading AI Model...</p>}
      <video ref={videoRef} autoPlay className="hidden"></video>
      <canvas ref={canvasRef} width={640} height={480} className="border"></canvas>
    </div>
  );
};

export default TryOn;
