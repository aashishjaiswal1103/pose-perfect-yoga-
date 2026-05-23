import { useEffect, useState, useRef } from "react";

interface HoldTimerProps {
  score: number;
  poseName: string;
  holdTime: number;
}

export default function HoldTimer({ score, poseName, holdTime }: HoldTimerProps) {

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const isHolding = score >= 40;
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  // Fill 0 to 100% over 60 seconds 
  const maxTime = 60;
  const progress = (holdTime % maxTime) / maxTime;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center bg-black/40 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
       <div className="relative w-16 h-16 flex items-center justify-center mb-2">
         {/* Background Circle */}
         <svg className="w-full h-full transform -rotate-90 absolute">
           <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
           {/* Progress Circle */}
           <circle 
             cx="32" cy="32" r="28" 
             stroke={isHolding ? "#22c55e" : "#ef4444"} 
             strokeWidth="4" fill="none" 
             strokeDasharray={circumference}
             strokeDashoffset={strokeDashoffset}
             strokeLinecap="round"
             className="transition-all duration-1000 ease-linear"
           />
         </svg>
         <div className="absolute text-white text-sm font-bold font-mono tracking-wider">
            {formatTime(holdTime)}
         </div>
       </div>
       <div className="text-xs font-semibold px-2 py-1 rounded-full bg-black/50 text-white flex items-center gap-1.5 whitespace-nowrap">
          {isHolding ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Holding Well!
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Paused
            </>
          )}
       </div>
    </div>
  );
}
