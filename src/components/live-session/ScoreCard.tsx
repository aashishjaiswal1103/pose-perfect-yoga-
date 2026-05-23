import React from 'react';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-xl font-bold tracking-widest uppercase text-white">Alignment</span>
        <span className="text-xl font-bold text-green-500">{score}%</span>
      </div>
      <div className="flex gap-4 h-3">
        <div className={`flex-1 rounded-full transition-all duration-300 ${score > 0 ? 'bg-red-600' : 'bg-white/20 shadow-inner'}`}></div>
        <div className={`flex-1 rounded-full transition-all duration-300 ${score > 25 ? 'bg-orange-500' : 'bg-white/20 shadow-inner'}`}></div>
        <div className={`flex-1 rounded-full transition-all duration-300 ${score > 50 ? 'bg-yellow-400' : 'bg-white/20 shadow-inner'}`}></div>
        <div className={`flex-1 rounded-full transition-all duration-300 ${score > 75 ? 'bg-green-500' : 'bg-white/20 shadow-inner'}`}></div>
      </div>
    </div>
  );
}
