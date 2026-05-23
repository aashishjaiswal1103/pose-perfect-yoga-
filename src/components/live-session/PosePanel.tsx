import React from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { Pose } from '@/lib/poses';
import { FeedbackPanel } from './FeedbackPanel';
import { useVoiceFeedback } from '@/hooks/useVoiceFeedback';

interface Props {
  activePose: Pose;
  soundEnabled: boolean;
  onToggleSound: () => void;
  feedback: string;
  landmarks_detected: boolean;
}
export function PosePanel({ activePose, soundEnabled, onToggleSound, feedback, landmarks_detected }: Props) {
  // Run the background voice feedback engine!
  useVoiceFeedback(feedback, soundEnabled);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex justify-between items-start mb-2 relative z-10 shrink-0">
        <h3 className="text-4xl md:text-5xl font-serif text-[#d4af37] uppercase tracking-widest">{activePose.name}</h3>
        <button 
          onClick={onToggleSound}
          className="text-[#5c4a3d] hover:text-[#d4af37] transition-colors mt-2"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </button>
      </div>
      
      <div className="h-px w-full bg-[#d4af37] mb-4 opacity-40"></div>
      
      <div className="mb-4">
        <FeedbackPanel feedback={feedback} landmarks_detected={landmarks_detected} />
      </div>

      <div className="w-full flex-1 bg-[#f6f0df] rounded-2xl p-1 shadow-sm border border-[#e8dcb8] relative overflow-hidden mt-2">
        <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden">
          <Image 
            src={activePose.coverImage} 
            alt={activePose.name} 
            fill 
            className="object-contain mix-blend-multiply" 
            sizes="(max-width: 768px) 100vw, 800px" 
            priority 
          />
        </div>
      </div>
    </div>
  );
}
