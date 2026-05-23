"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { poses, bodyPartIcon, type Pose } from "@/lib/poses";
import { Sparkles, Activity, Target, ChevronDown, CheckCircle, Bone } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

// Memoized Mandala to prevent unnecessary re-renders
const MandalaSVG = React.memo(() => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#C9933A] opacity-20" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="50" cy="50" r="48" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="38" />
    <circle cx="50" cy="50" r="28" strokeDasharray="1 3" />
    <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" strokeWidth="0.2" />
    {[...Array(12)].map((_, i) => (
      <path key={i} d="M50 50 Q 60 20 50 2 Q 40 20 50 50" transform={`rotate(${i * 30} 50 50)`} fill="currentColor" fillOpacity="0.1" />
    ))}
  </svg>
));
MandalaSVG.displayName = "MandalaSVG";

// Static Data extracted outside component to prevent recreation on every render
const featuresData = [
  { icon: Target, title: "Real-Time Alignment", desc: "Our vision AI guides your physical form, bringing harmony to your posture." },
  { icon: Activity, title: "Divine Scoring", desc: "Experience your progress through visual feedback as you near perfection." },
  { icon: Sparkles, title: "Spiritual Progress", desc: "Watch your inner light grow as you master the 108 sacred postures." }
];

const stepsData = [
  { step: "1", title: "Ignite", desc: "Allow camera access to begin the sacred connection." },
  { step: "2", title: "Embody", desc: "Flow into the posture, becoming one with the form." },
  { step: "3", title: "Refine", desc: "Receive divine guidance to perfect your alignment." }
];

// Extracted styles to prevent re-injection on re-renders
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(var(--float-x, -50px), -1000px) rotate(360deg); }
  }
`;

// Extract Floating Petals to prevent re-calculation of random values
const FloatingPetals = React.memo(() => {
  const petals = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      floatX: `${Math.random() * 100 - 50}px`
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-30">
      {petals.map((p) => (
        <div 
          key={p.id} 
          className="absolute w-2 h-2 rounded-full bg-[#E8A0A0]"
          style={{
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            filter: 'blur(1px)',
            animation: `float ${p.duration}s linear infinite`,
            animationDelay: `-${p.delay}s`,
            '--float-x': p.floatX
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
FloatingPetals.displayName = "FloatingPetals";

export default function StorytellerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background color interpolation based on story chapters
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "#05050A", // 0% Dark sky
      "#1A1005", // 20% Light starts bleeding, warm golden haze
      "#8B6914", // 40% Golden mist (Temple Gold)
      "#C9933A", // 60% Light fills 70% of screen (Sacred Gold)
      "#E8B84B", // 80% Almost white-gold
      "#FFF8EE"  // 100% Pure light (Cream White)
    ]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#FFFFFF", "#FFF3D0", "#3E2723", "#3E2723"]
  );

  const lightRayWidth = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 1], ["5%", "30%", "60%", "100%", "100%"]);
  const lightRayOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.8, 1], [0.6, 0.8, 1, 0.8]);

  const mandalaScale = useTransform(scrollYProgress, [0, 0.2], [1, 2.5]);
  const mandalaOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 0]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden font-serif selection:bg-[#C9933A] selection:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Fixed Background Layer */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none"
        style={{ backgroundColor }}
      />
      
      {/* Expanding Divine Light Ray */}
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 h-[100dvh] z-[-1] pointer-events-none"
        style={{
          width: lightRayWidth,
          opacity: lightRayOpacity,
          background: "linear-gradient(180deg, rgba(255, 243, 208, 0.9) 0%, rgba(201, 147, 58, 0) 100%)",
          filter: "blur(50px)"
        }}
      />

      <FloatingPetals />

      <style dangerouslySetInnerHTML={{__html: GLOBAL_STYLES}} />

      {/* CHAPTER 1: THE CALL (0 - 100vh) */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center relative px-6 py-20 md:py-0">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center justify-center text-center relative z-10 w-full max-w-4xl"
        >
          {/* Mandala behind silhouette */}
          <motion.div 
            style={{ scale: mandalaScale, opacity: mandalaOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] pointer-events-none"
          >
            <MandalaSVG />
          </motion.div>

          {/* Hero Image */}
          <div className="w-64 h-64 md:w-96 md:h-96 z-10 relative">
             <Image src="/home page.png" alt="Yoga Pose" fill className="object-contain" priority />
          </div>

          <motion.h1 
            className="mt-8 text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-[#FFF3D0] uppercase relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{ textShadow: "0px 4px 20px rgba(201, 147, 58, 0.5)" }}
          >
            Find Your Light Within
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-[#C9933A] italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            Your journey to inner light begins here
          </motion.p>

          <motion.div
            className="mt-16 flex flex-col items-center text-[#E8B84B] opacity-70"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-sm tracking-[0.3em] uppercase mb-2">Scroll to awaken</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* CHAPTER 2: THE PATH (100vh - 200vh) */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center relative px-6 py-20 md:py-0">
        <motion.div 
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 1 }}
        >
          <motion.h2 style={{ color: textColor }} className="text-4xl md:text-5xl text-center mb-16 font-semibold italic">The Path of Awakening</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuresData.map((feature, idx) => (
              <div key={idx} className="bg-[#1A1005]/40 backdrop-blur-md border border-[#C9933A]/30 p-10 rounded-t-full flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#C9933A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <feature.icon className="w-12 h-12 text-[#E8B84B] mb-6" strokeWidth={1.5} />
                 <h3 className="text-2xl text-[#FFF3D0] mb-4 font-semibold">{feature.title}</h3>
                 <p className="text-[#E8B84B]/80 text-lg leading-relaxed">{feature.desc}</p>
                 <div className="mt-8 w-12 h-1 bg-gradient-to-r from-transparent via-[#C9933A] to-transparent" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CHAPTER 3: THE PRACTICE (200vh - 300vh) */}
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative px-6 py-20 md:py-0">
        <motion.div 
          className="w-full max-w-7xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-16">
            <motion.h2 style={{ color: textColor }} className="text-4xl md:text-5xl font-semibold mb-4">The Sacred Postures</motion.h2>
            <p className="text-xl text-[#3E2723] opacity-80 italic">108 postures. One journey.</p>
          </div>

          <Dialog>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-12 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide items-center justify-start">
              {poses.map((pose) => (
                <DialogTrigger key={pose.name} asChild onClick={() => setSelectedPose(pose)}>
                  <div className="snap-center shrink-0 w-56 h-72 md:w-64 md:h-80 rounded-full border border-[#6B3F1F]/30 bg-[#FFF8EE]/60 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-8 hover:scale-105 hover:bg-[#FFF8EE] transition-all duration-500 shadow-[0_0_20px_rgba(201,147,58,0.2)] hover:shadow-[0_0_40px_rgba(201,147,58,0.4)] cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-2 rounded-full border border-[#C9933A]/20 border-dashed animate-[spin_60s_linear_infinite] group-hover:border-[#C9933A]/50" />
                    <div className="w-20 h-20 md:w-24 md:h-24 relative mb-4 md:mb-6 transition-transform duration-500 group-hover:scale-110">
                      <Image src={pose.image} alt={pose.name} fill className="object-contain drop-shadow-md" sizes="(max-width: 768px) 80px, 96px" />
                    </div>
                    <h3 className="text-xl md:text-2xl text-[#3E2723] font-bold text-center leading-tight">{pose.name}</h3>
                    <p className="text-[#8B6914] text-xs md:text-sm mt-2 md:mt-3 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Practice Now</p>
                  </div>
                </DialogTrigger>
              ))}
            </div>

            {selectedPose && (
              <DialogContent className="max-w-5xl w-[95vw] md:w-[90vw] max-h-[90vh] flex flex-col md:flex-row glassmorphic-card p-0 overflow-hidden border-[#C9933A]/30" onInteractOutside={() => setSelectedPose(null)}>
                <div className="relative flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden w-full h-full">
                  <div className="w-full md:w-1/2 relative bg-[#FFF8EE]/40 shrink-0 min-h-[30vh] md:min-h-full flex items-center justify-center">
                    <Image
                      src={selectedPose.image}
                      alt={selectedPose.name}
                      width={1000}
                      height={1000}
                      className="w-full h-full max-h-[35vh] md:max-h-[80vh] block p-4 md:p-8 object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C9933A]/10 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col bg-background/95 h-auto md:h-full relative">
                    <div className="flex-none md:flex-1 overflow-y-visible md:overflow-y-auto p-6 md:px-8 md:pt-6 md:pb-4">
                      <DialogHeader className="mt-0 text-left">
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
                      <Link href={`/live-session?pose=${selectedPose.name}`}>
                        <Button 
                          className="bg-[linear-gradient(110deg,hsl(var(--primary)),45%,#fff,55%,hsl(var(--primary)))] bg-[length:200%_100%] text-foreground hover:animate-shimmer-in hover:scale-105 transition-all duration-300 shadow-glow-sm hover:shadow-glow-md text-lg px-8 py-6 rounded-full font-bold border-none"
                        >
                          Let's do it
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </motion.div>
      </div>

      {/* CHAPTER 4: THE GUIDE (300vh - 400vh) */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center relative px-6 py-20 md:py-0">
         <motion.div 
            className="w-full max-w-5xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1 }}
         >
            <motion.h2 style={{ color: textColor }} className="text-4xl md:text-5xl text-center mb-20 font-semibold">The Ritual of Transformation</motion.h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
               {/* Connecting Line */}
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent hidden md:block -z-10" />
               
               {stepsData.map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center max-w-xs relative group">
                    <div className="w-20 h-20 rounded-full bg-[#FFF8EE] border-2 border-[#C9933A] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(201,147,58,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                       <span className="text-3xl text-[#8B4513] font-bold">{item.step}</span>
                       {/* Diya glow effect */}
                       <div className="absolute -top-1 w-4 h-4 bg-[#E8B84B] rounded-full blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="text-3xl text-[#3E2723] mb-3 font-semibold">{item.title}</h3>
                    <p className="text-[#6B3F1F] text-lg">{item.desc}</p>
                 </div>
               ))}
            </div>
         </motion.div>
      </div>

      {/* CHAPTER 5: THE ARRIVAL (400vh - 500vh) */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center relative px-6 py-20 md:py-0">
        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 1.5 }}
        >
          {/* Pink Lotus Iconography */}
          <div className="w-32 h-32 mb-8 relative">
             <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4637A] drop-shadow-[0_0_20px_rgba(212,99,122,0.4)]" fill="currentColor">
                <path d="M50 10 C60 30 75 45 90 50 C75 55 60 70 50 90 C40 70 25 55 10 50 C25 45 40 30 50 10 Z" />
                <path d="M50 20 C55 35 65 45 80 50 C65 55 55 65 50 80 C45 65 35 55 20 50 C35 45 45 35 50 20 Z" className="text-[#E8A0A0]" />
                <circle cx="50" cy="50" r="10" className="text-[#FFF8EE]" />
             </svg>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#3E2723] mb-6">
            You Have Found Your Light
          </h2>
          <p className="text-xl md:text-2xl text-[#8B6914] mb-12 md:mb-16 italic">
            Now, let it shine.
          </p>

          <Link href="/live-session">
            <button className="px-12 py-5 bg-gradient-to-r from-[#D4637A] to-[#E8A0A0] text-white text-xl font-bold tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(212,99,122,0.5)] hover:shadow-[0_0_50px_rgba(212,99,122,0.8)] hover:scale-105 transition-all duration-500 border border-white/20 relative overflow-hidden group">
              <span className="relative z-10">Begin Your Practice</span>
              <div className="absolute inset-0 bg-white/20 w-full animate-shimmer-in group-hover:animate-pulse"></div>
            </button>
          </Link>
        </motion.div>
      </div>

    </div>
  );
}

