"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { poses, bodyPartIcon, type Pose } from "@/lib/poses";
import { CheckCircle, Bone, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

// ─── Colors and variables ──────────────────────────────────────────────────────

// ─── Interactive Orb (DOM-direct animation — no setState each frame) ───────────
interface OrbConfig {
  size: number;
  color: string;
  blur: number;
  baseX: number; // vw %
  baseY: number; // vh %
  speed: number;
  phase: number;
  mouseStrength: number; // px max influence
}

function InteractiveOrb({ size, color, blur, baseX, baseY, speed, phase, mouseStrength }: OrbConfig) {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const animate = () => {
      const t = (Date.now() - startRef.current) / 1000;

      // Random Lissajous-like wandering
      const wx = Math.sin(t * speed + phase) * 70 + Math.cos(t * speed * 0.71 + phase * 1.4) * 45;
      const wy = Math.cos(t * speed * 0.83 + phase) * 55 + Math.sin(t * speed * 0.53 + phase * 0.9) * 40;

      // Mouse repulsion/attraction
      const mx = (mouseRef.current.x - 0.5) * mouseStrength;
      const my = (mouseRef.current.y - 0.5) * mouseStrength;

      const x = `calc(${baseX}vw + ${wx + mx}px)`;
      const y = `calc(${baseY}vh + ${wy + my}px)`;

      el.style.left = x;
      el.style.top = y;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [baseX, baseY, speed, phase, mouseStrength]);

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        opacity: 0.65,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        willChange: 'left, top',
        left: `${baseX}vw`,
        top: `${baseY}vh`,
      }}
    />
  );
}

// ─── Pose Card ────────────────────────────────────────────────────────────────
function PoseCard({ pose }: { pose: Pose }) {
  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-2"
      style={{
        aspectRatio: '2/3',
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={pose.image}
          alt={pose.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PosesPage() {
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);

  const orbs: OrbConfig[] = [
    { size: 420, color: '#F2C94C', blur: 80, baseX: 18, baseY: 35, speed: 1.18, phase: 0, mouseStrength: 150 },
    { size: 520, color: '#ff753fff', blur: 130, baseX: 75, baseY: 50, speed: 1.13, phase: 1, mouseStrength: 110 },
    { size: 340, color: '#F2994A', blur: 155, baseX: 50, baseY: 72, speed: 8.22, phase: 4.5, mouseStrength: 70 },
    { size: 280, color: '#e1ee0cff', blur: 90, baseX: 85, baseY: 20, speed: 0.16, phase: 1.2, mouseStrength: 55 },
    { size: 220, color: '#FBBF24', blur: 80, baseX: 10, baseY: 78, speed: 2.26, phase: 3.3, mouseStrength: 75 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-black selection:bg-[#E8B84B] selection:text-white pb-24">

      {/* ── Hero Section — Full Screen ─────────────────────────────────────── */}
      <div
        className="relative w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ height: '100svh', minHeight: '600px' }}
      >
        {/* Animated interactive orbs — direct DOM mutation, no setState lag */}
        {orbs.map((orb, i) => (
          <InteractiveOrb key={i} {...orb} />
        ))}

        {/* Soft radial vignette so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(250,250,250,0.75) 100%)',
          }}
        />

        {/* Hero copy */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pointer-events-none select-none">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C89B3C] mb-6 font-medium">
            Pose Perfect · Yoga Studio
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-sans text-[#1A1A1A] tracking-tight leading-[1.1]">
            <span className="block font-semibold">Find Your Calm —</span>
            <span className="block font-light italic mt-2 text-[#3A3A3A]">Explore Every Pose</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#666] font-light max-w-xl mx-auto leading-relaxed">
            A curated collection of yoga asanas designed to bring balance, strength, and serenity.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#999]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#E8B84B] to-transparent animate-pulse" />
        </div>
      </div>

      {/* ── Pose Grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-0">
        <h2 className="text-2xl md:text-3xl font-medium text-[#1A1A1A] mb-10 tracking-wide text-center md:text-left">
          Explore Mindfulness Sessions
        </h2>

        <Dialog>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {poses.map((pose, idx) => (
              <DialogTrigger key={pose.name} asChild onClick={() => setSelectedPose(pose)}>
                <div>
                  <PoseCard pose={pose} />
                </div>
              </DialogTrigger>
            ))}
          </div>

          {selectedPose && (
            <DialogContent
              className="max-w-[1200px] w-[95vw] md:w-[90vw] max-h-[90vh] flex flex-col md:flex-row bg-[#FAFAFA] border-none shadow-[0_0_60px_rgba(232,184,75,0.3)] rounded-[2rem] p-0 overflow-hidden"
              onInteractOutside={() => setSelectedPose(null)}
            >
              <div className="relative flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden w-full h-full">
                <div className="w-full md:w-1/2 relative bg-[#FDFBF7] shrink-0 min-h-[30vh] md:min-h-full flex items-center justify-center">
                  <img
                    src={selectedPose.coverImage || selectedPose.image}
                    alt={selectedPose.name}
                    className="w-full h-full max-h-[40vh] md:max-h-[85vh] object-contain block p-4 md:p-8"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col bg-white h-auto md:h-full relative">
                  <div className="flex-none md:flex-1 overflow-y-visible md:overflow-y-auto p-6 md:p-12">
                    <DialogHeader className="mt-0 text-left">
                      <DialogTitle className="font-sans text-3xl md:text-5xl font-medium text-[#1A1A1A] tracking-tight">
                        {selectedPose.name}
                      </DialogTitle>
                      <DialogDescription className="text-[#666] pt-4 text-base md:text-lg leading-relaxed font-light">
                        {selectedPose.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 md:mt-10 space-y-8 md:space-y-10">
                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-4 md:mb-5 tracking-wide uppercase text-sm">Benefits</h4>
                        <ul className="space-y-3 md:space-y-4 text-[#444]">
                          {selectedPose.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-3 md:gap-4 text-base md:text-lg font-light">
                              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#E8B84B] shrink-0 mt-0.5" /> {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-4 md:mb-5 tracking-wide uppercase text-sm">Major Body Parts</h4>
                        <div className="flex flex-wrap gap-3 md:gap-4">
                          {selectedPose.bodyParts.map((part) => (
                            <div key={part} className="flex items-center gap-2 bg-[#F9F9F9] px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-[#EAEAEA]">
                              <span className="text-[#E8B84B]">
                                {bodyPartIcon[part] ?? <Bone className="h-4 w-4 md:h-5 md:w-5" />}
                              </span>
                              <span className="text-[#333] text-xs md:text-sm font-medium">{part}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-12 bg-white border-t border-[#F0F0F0] flex justify-end shrink-0">
                    <Link href={`/live-session?pose=${encodeURIComponent(selectedPose.name)}`} className="w-full md:w-auto">
                      <Button className="w-full md:w-auto bg-[#E8B84B] hover:bg-[#D4A338] text-white hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_20px_rgba(232,184,75,0.3)] hover:shadow-[0_15px_30px_rgba(232,184,75,0.5)] text-lg px-8 py-6 md:px-10 md:py-7 rounded-full font-medium">
                        Let&apos;s do it
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}
