import React from 'react';
import { Trophy, Clock, Target, Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface PoseStat {
  poseName: string;
  bestScore: number;
  averageScore: number;
  totalTime: number; // in seconds
}

export interface SessionStats {
  poses: PoseStat[];
  totalDuration: number; // in seconds
}

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SessionStats;
}

export function SessionSummary({ isOpen, onClose, stats }: SessionSummaryProps) {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glassmorphic-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(var(--primary),0.15)] flex flex-col relative animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-background/50 text-foreground/70 hover:text-foreground hover:bg-primary/20 transition-all z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-8 md:p-12 pb-6 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 shadow-glow-sm">
            <Trophy size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4 glow-text">Session Complete</h2>
          <p className="text-lg text-foreground/70 font-medium">Here's a summary of your journey today</p>
        </div>

        {/* Overall Stats */}
        <div className="px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
          <div className="bg-background/40 border border-primary/10 rounded-2xl p-6 flex items-center gap-5">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Clock size={24} />
             </div>
             <div>
               <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">Total Hold Time</p>
               <p className="text-3xl font-code font-bold text-foreground">{formatTime(stats.totalDuration)}</p>
             </div>
          </div>
          <div className="bg-background/40 border border-primary/10 rounded-2xl p-6 flex items-center gap-5">
             <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
               <Activity size={24} />
             </div>
             <div>
               <p className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-1">Poses Practiced</p>
               <p className="text-3xl font-code font-bold text-foreground">{stats.poses.length}</p>
             </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-8 md:px-12 pb-8 flex-1">
          <h3 className="text-xl font-headline font-bold text-foreground mb-6 flex items-center gap-2">
            <Target className="text-primary" size={20} /> Pose Breakdown
          </h3>
          
          <div className="space-y-4">
            {stats.poses.map((pose, idx) => (
              <div key={idx} className="bg-background/60 border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 duration-300 hover:shadow-glow-sm hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold font-code">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-headline font-bold text-foreground">{pose.poseName}</h4>
                    <p className="text-sm text-foreground/60 font-medium flex items-center gap-1">
                      <Clock size={14} /> Held for {formatTime(pose.totalTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Average</p>
                    <p className="text-xl font-code font-bold text-primary">{pose.averageScore}%</p>
                  </div>
                  <div className="w-px h-10 bg-border"></div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Best</p>
                    <p className="text-xl font-code font-bold text-[#8B4513]">{pose.bestScore}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 md:p-12 pt-6 border-t border-primary/10 flex flex-col sm:flex-row gap-4 justify-center shrink-0">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-primary/30 hover:bg-primary/10">
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/poses" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:shadow-glow-md transition-all">
              Explore More Poses
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
