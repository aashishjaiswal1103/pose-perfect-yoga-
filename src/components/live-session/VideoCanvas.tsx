"use client";

import { useEffect, useRef } from "react";
import { ScoreCard } from "./ScoreCard";
import HoldTimer from "./HoldTimer";

interface Props {
  activePose: { name: string };
  holdTime: number;
  formatTime: (s: number) => string;
  frame: string | null;
  connected: boolean;
  predictedPose: string;
  confidence: number;
  score?: number;
  landmarks?: any[];
  jointColors?: Record<string, string>;
}

export default function VideoCanvas({
  activePose,
  holdTime,
  formatTime,
  frame,
  connected,
  predictedPose,
  confidence,
  score = 0,
  landmarks,
  jointColors
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (frame && imgRef.current) {
      imgRef.current.src = `data:image/jpeg;base64,${frame}`;
    }
  }, [frame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !landmarks || landmarks.length === 0) {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    if (imgRef.current) {
      canvas.width = imgRef.current.clientWidth;
      canvas.height = imgRef.current.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const JOINT_MAP: Record<string, number> = {
      "left_knee_angle": 25,
      "right_knee_angle": 26,
      "left_shoulder_angle": 11,
      "right_shoulder_angle": 12,
      "left_elbow_angle": 13,
      "right_elbow_angle": 14,
      "left_hip_angle": 23,
      "right_hip_angle": 24,
    };

    const CONNECTIONS = [
      [11, 12], [11, 23], [12, 24], [23, 24],
      [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
      [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
      [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
      [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
    ];

    const getX = (lm: any) => (1.0 - lm.x) * canvas.width;
    const getY = (lm: any) => lm.y * canvas.height;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    CONNECTIONS.forEach(([i, j]) => {
      const lm1 = landmarks[i];
      const lm2 = landmarks[j];
      if (lm1 && lm2 && lm1.visibility > 0.5 && lm2.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(getX(lm1), getY(lm1));
        ctx.lineTo(getX(lm2), getY(lm2));
        ctx.stroke();
      }
    });

    const colorMap: Record<number, string> = {};
    if (jointColors) {
      Object.entries(jointColors).forEach(([jointName, color]) => {
        const idx = JOINT_MAP[jointName];
        if (idx !== undefined) {
          colorMap[idx] = color;
        }
      });
    }

    for (let i = 11; i <= 32; i++) {
      const lm = landmarks[i];
      if (!lm || lm.visibility < 0.5) continue;
      
      const x = getX(lm);
      const y = getY(lm);
      
      const color = colorMap[i] || "white";
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.stroke();
    }
  }, [landmarks, jointColors]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black rounded-xl overflow-hidden">

      {/* Real camera feed from backend */}
      {frame ? (
        <>
          <img
            ref={imgRef}
            alt="Live pose feed"
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-lg">
            {connected ? "Starting camera..." : "Connecting to backend..."}
          </p>
        </div>
      )}

      {/* Top left — LIVE badge + pose name */}
      <div className="absolute top-4 left-4 flex gap-2 flex-wrap items-center">
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </span>
        <span className="text-white text-sm font-semibold">
          {activePose.name}
        </span>
      </div>

      {/* Top right — Hold Timer */}
      <HoldTimer score={score} poseName={activePose.name} holdTime={holdTime} />

      <ScoreCard score={score} />
    </div>
  );
}