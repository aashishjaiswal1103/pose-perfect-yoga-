"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Volume2, VolumeX, CheckCircle2, AlertCircle, CheckCircle, Bone, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { poses, bodyPartIcon, type Pose } from '@/lib/poses';
import { Card, CardContent } from '@/components/ui/card';
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import VideoCanvas from '@/components/live-session/VideoCanvas';
import { ScoreCard } from '@/components/live-session/ScoreCard';
import { PosePanel } from '@/components/live-session/PosePanel';
import { SessionSummary, type SessionStats } from '@/components/live-session/SessionSummary';

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const initialPoseName = searchParams.get('pose') || 'Warrior Pose';

  const [activePose, setActivePose] = useState<Pose>(
    poses.find((p) => p.name === initialPoseName) || poses[0]
  );
  const [holdTime, setHoldTime] = useState(0);
  const { poseData, connected } = useWebSocket(activePose.name); const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    poses: [],
    totalDuration: 0,
  });
  const [scores, setScores] = useState<number[]>([]);
  const currentScoreRef = useRef<number>(0);
  currentScoreRef.current = poseData?.score ?? 0;

  useEffect(() => {
    // When URL query param changes, update the pose if needed
    const poseParam = searchParams.get('pose');
    if (poseParam) {
      const urlPose = poses.find((p) => p.name === poseParam);
      if (urlPose) {
        setActivePose(urlPose);
        setHoldTime(0);
        setScores([]);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (currentScoreRef.current >= 40) {
        setHoldTime(prev => prev + 1);
      }
    }, 1000);

    const scoreInterval = setInterval(() => {
      setScores(prev => [...prev, currentScoreRef.current]);
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(scoreInterval);
    };
  }, []);

  const handlePoseChange = (pose: Pose) => {
    setActivePose(pose);
    setHoldTime(0);
    setScores([]);
  };

  const handleEndSession = async () => {
    // Calculate real scores from live data
    const validScores = scores.filter(s => s > 0);
    const bestScore = validScores.length > 0 ? Math.max(...validScores) : (poseData?.score ?? 0);
    const averageScore = validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : (poseData?.score ?? 0);

    // Save session to database ONLY if the user actually performed the pose
    if (holdTime > 0) {
      try {
        const userId = localStorage.getItem("userId") || "1";
        await fetch("http://localhost:8000/api/sessions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(userId),
            pose_name: activePose.name,
            best_score: bestScore,
            average_score: averageScore,
            duration_seconds: holdTime,
          }),
        });
        console.log("Session saved successfully");
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }

    // Show summary
    setSessionStats({
      poses: [{
        poseName: activePose.name,
        bestScore: bestScore,
        averageScore: averageScore,
        totalTime: holdTime,
      }],
      totalDuration: holdTime,
    });
    setIsSummaryOpen(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-background text-foreground font-body relative selection:bg-primary selection:text-primary-foreground">

      {/* 1. Main Session Area (Sticky, Full Viewport) */}
      <div className="relative lg:sticky top-0 min-h-[100svh] lg:h-[100svh] w-full flex flex-col px-4 md:px-8 pb-6 wavy-gradient-bg lg:overflow-hidden z-10">

      {/* Header Hover Zone */}
      <div className="absolute top-0 left-0 w-full pt-4 pb-12 z-50 group">
        <header className="flex justify-between items-center px-4 md:px-8 py-3 mx-4 md:mx-8 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-background/90 backdrop-blur-md rounded-2xl shadow-lg border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow-sm">
              <span className="w-3 h-3 rounded-full bg-background"></span>
            </div>
            <span className="text-2xl font-headline font-bold text-foreground glow-text">poseperfect</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-base font-medium text-foreground/90 glassmorphic-card px-5 py-2 rounded-full border-primary/20">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]"></span>
            Session Active — {activePose.name}
          </div>

          <button
            onClick={handleEndSession}
            className="px-6 py-2.5 rounded-full border border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground transition-all font-bold text-sm shadow-sm hover:shadow-glow-md"
          >
            End Session
          </button>
        </header>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 relative z-10 pt-4">

          {/* LEFT: Webcam Feed */}
          <div className="lg:col-span-7 glassmorphic-card rounded-3xl relative overflow-hidden flex flex-col border border-border shadow-glow-sm h-full">
            <VideoCanvas
              activePose={activePose}
              holdTime={holdTime}
              formatTime={formatTime}
              frame={poseData?.frame ?? null}
              connected={connected}
              predictedPose={poseData?.predicted_pose ?? ""}
              confidence={poseData?.confidence ?? 0}
              score={poseData?.score ?? 0}
              landmarks={poseData?.landmarks}
              jointColors={poseData?.joint_colors}
            />
          </div>

          {/* RIGHT: Consolidated Info & Feedback */}
          <div className="lg:col-span-5 bg-[#fbf7ee] rounded-3xl p-6 shadow-sm flex flex-col relative h-full">
            <PosePanel
              activePose={activePose}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              feedback={poseData?.feedback ?? "Waiting for pose..."}
              landmarks_detected={poseData?.landmarks_detected ?? false}
            />
          </div>
        </div>
      </div>

      {/* 2. Below the Fold Content */}
      <div className="relative z-20 bg-background border-t-2 border-primary/20 pt-16 pb-24 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-6">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4 glow-text">Pose Deep Dive</h2>
            <p className="text-lg text-foreground/70 font-medium">Master the details of {activePose.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">

            {/* Key Benefits */}
            <div className="glassmorphic-card p-8 rounded-3xl border border-border shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <h3 className="text-xl font-bold font-headline text-primary mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6" /> Key Benefits
              </h3>
              <ul className="space-y-5">
                {activePose.benefits.map((b, i) => (
                  <li key={i} className="flex gap-4 text-[15px] items-start text-foreground/80 font-medium leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Precautions */}
            <div className="glassmorphic-card p-8 rounded-3xl border border-border shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <h3 className="text-xl font-bold font-headline text-orange-500 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6" /> Precautions
              </h3>
              <ul className="space-y-5">
                {activePose.precautions.map((p, i) => (
                  <li key={i} className="flex gap-4 text-[15px] items-start text-foreground/80 font-medium leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to do Steps (Full Width) */}
            <div className="md:col-span-2 glassmorphic-card p-8 md:p-12 rounded-3xl border border-border shadow-sm">
              <h3 className="text-2xl font-bold font-headline text-primary mb-10 flex items-center gap-3">
                <Bone className="w-7 h-7" /> Step-by-step Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {activePose.steps.map((step, index) => (
                  <div key={index} className="flex flex-col relative">
                    <span className="text-6xl font-headline font-bold text-primary/10 mb-2 absolute -top-6 -left-4">{index + 1}</span>
                    <p className="text-[15px] text-foreground/90 leading-relaxed font-medium relative z-10 mt-4">{step}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Choose Another Pose */}
          <div className="pt-16 mt-12 border-t border-primary/10">
            <div className="flex justify-between items-end mb-16 px-2">
              <h3 className="text-2xl md:text-3xl font-headline font-bold tracking-widest text-primary uppercase">Choose Another Pose</h3>
            </div>

            <Dialog>
              <div className="flex gap-4 md:gap-6 overflow-x-auto pt-8 pb-16 scrollbar-hide px-4 md:px-8 snap-x snap-mandatory items-center justify-start">
                {poses.map((pose) => {
                  const isActive = pose.name === activePose.name;
                  return (
                    <DialogTrigger key={pose.name} asChild onClick={() => setSelectedPose(pose)}>
                      <Card
                        className={`group snap-center shrink-0 w-[140px] md:w-[160px] cursor-pointer overflow-hidden text-center transition-all duration-400 ${isActive
                            ? 'border-2 border-primary shadow-glow-md bg-background/90 backdrop-blur-md -translate-y-3 scale-105'
                            : 'glassmorphic-card hover:-translate-y-2 hover:shadow-glow-sm hover:border-primary/50 opacity-80 hover:opacity-100'
                          }`}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <div className={`transition-transform duration-500 ${isActive ? 'text-primary scale-125 mb-3' : 'text-primary/70 group-hover:text-primary group-hover:scale-110 mb-2'}`}>
                            {pose.icon}
                          </div>
                          <h3 className={`mt-3 font-headline text-base font-bold leading-tight ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
                            {pose.name}
                          </h3>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                  )
                })}
              </div>

              {selectedPose && (
                <DialogContent className="max-w-5xl w-[95vw] md:w-[90vw] max-h-[90vh] flex flex-col md:flex-row glassmorphic-card p-0 overflow-hidden" onInteractOutside={() => setSelectedPose(null)}>
                  <div className="relative flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden w-full h-full">
                    <div className="w-full md:w-1/2 relative bg-black/5 shrink-0 min-h-[30vh] md:min-h-full flex items-center justify-center">
                      <Image
                        src={selectedPose.coverImage}
                        alt={selectedPose.name}
                        width={1000}
                        height={1000}
                        className="w-full h-full max-h-[35vh] md:max-h-[80vh] block p-4 md:p-8 object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col bg-background/50 h-auto md:h-full relative">
                      <div className="flex-none md:flex-1 overflow-y-visible md:overflow-y-auto p-6 md:px-8 md:pt-6 md:pb-4">
                        <DialogHeader className="mt-0">
                          <DialogTitle className="font-headline text-3xl md:text-4xl text-foreground">
                            {selectedPose.name}
                          </DialogTitle>
                          <DialogDescription className="text-foreground/80 pt-3 text-lg">
                            {selectedPose.description}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="mt-8 space-y-8">
                          <div>
                            <h4 className="font-semibold text-foreground text-xl mb-4">Benefits</h4>
                            <ul className="space-y-3 text-foreground/80">
                              {selectedPose.benefits.map((b) => (
                                <li key={b} className="flex items-start gap-3 text-lg">
                                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 shrink-0" /> {b}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground text-xl mb-4">Major body parts involved</h4>
                            <div className="flex flex-wrap gap-6 text-foreground/80">
                              {selectedPose.bodyParts.map((part) => (
                                <div key={part} className="flex flex-col items-center gap-2">
                                  {bodyPartIcon[part] ?? <Bone className="h-8 w-8 text-primary" />}
                                  <span className="text-sm font-medium">{part}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:px-8 md:pt-4 md:pb-8 flex justify-end shrink-0">
                        <Button
                          asChild
                          className="bg-[linear-gradient(110deg,hsl(var(--primary)),45%,#fff,55%,hsl(var(--primary)))] bg-[length:200%_100%] text-foreground hover:animate-shimmer-in hover:scale-105 transition-all duration-300 shadow-glow-sm hover:shadow-glow-md text-lg px-8 py-6 rounded-full font-bold border-none"
                          onClick={() => {
                            handlePoseChange(selectedPose);
                            setSelectedPose(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <button>Let's do it</button>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>

      <SessionSummary
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        stats={sessionStats}
      />
    </div>
  );
}

export default function LiveSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen wavy-gradient-bg flex items-center justify-center text-primary text-2xl font-headline font-bold glow-text">Initiating Live Session...</div>}>
      <LiveSessionContent />
    </Suspense>
  );
}
