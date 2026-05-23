"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Brain, Target, History, Globe, Camera } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0705] text-[#F5E6D3] font-sans selection:bg-[#C9933A] selection:text-[#0A0705] overflow-x-hidden pt-24 pb-32">
      
      {/* 1. HERO / ABOUT SECTION */}
      <section className="container mx-auto px-6 lg:px-12 pt-12 pb-24 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Side: Big Heading & Stats */}
          <div className="flex flex-col relative">
            <h1 className="text-6xl sm:text-8xl md:text-[150px] font-bold leading-none tracking-tighter uppercase font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="block text-white/90">ABOUT</span>
              <span className="block text-[#C9933A] -mt-2 sm:-mt-4 md:-mt-8">US</span>
            </h1>

            {/* Stats Box */}
            <div className="mt-16 lg:mt-24 p-8 border border-white/10 bg-white/5 backdrop-blur-sm relative max-w-sm">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#C9933A]"></div>
              <ul className="space-y-4 text-sm md:text-base text-white/70">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-white/90">Project Type</span>
                  <span>AI + Web Application</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-white/90">Key Tech</span>
                  <span className="text-right">MediaPipe, FastAPI,<br/>React, SQLite</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-white/90">Landmarks Tracked</span>
                  <span>33 Points</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-white/90">Supported Poses</span>
                  <span>7</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-white/90">Accuracy Feedback</span>
                  <span>Real-time (0–100%)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Highlight Line & Description */}
          <div className="flex flex-col pt-4 lg:pt-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-light leading-snug text-[#C9933A] mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              We bring together the perfect blend of AI intelligence, technical expertise, and human-centered design to redefine digital yoga experiences.
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl text-white/60 leading-relaxed font-light">
              <p>
                The <strong className="text-white">AI-Driven Yoga Pose Checker System</strong> is a full-stack computer vision application designed to act as a personal virtual yoga instructor. Built using cutting-edge technologies like MediaPipe, FastAPI, React, and Machine Learning, the system delivers real-time posture detection, correction, and feedback directly through a web browser.
              </p>
              <p className="text-[#C9933A] italic font-serif text-2xl pt-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No trainers. No expensive setups. Just a webcam — and intelligent guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE SECTION */}
      <section className="container mx-auto px-6 lg:px-12 py-24 text-center max-w-4xl">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Smart Fitness Powered by AI
        </h2>
        <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
          We combine computer vision, machine learning, and interactive web technologies to create an intelligent fitness assistant that understands human posture in real time.
          <br /><br />
          From beginners to advanced practitioners, our system ensures correct form, injury prevention, and continuous improvement through data-driven insights.
        </p>
      </section>

      {/* 3. FEATURES SECTION (BENTO GRID) */}
      <section className="container mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-[#C9933A] uppercase mb-4">Smart Features, Real-Time Impact</h2>
          <p className="text-3xl md:text-4xl text-white/90 font-serif max-w-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            A powerful blend of AI, computer vision, and web technologies — designed for accuracy, speed, and usability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto] md:auto-rows-[250px]">
          {/* Card 1 (Large - Main Highlight) */}
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#C9933A]/20 to-transparent border border-[#C9933A]/30 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group min-h-[300px] md:min-h-0">
            <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <Camera size={120} className="text-[#C9933A]" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 z-10">Real-Time Pose Detection</h3>
            <p className="text-lg md:text-xl text-white/70 max-w-md z-10">
              Detects 33 body landmarks using MediaPipe with a live skeletal overlay. Track your movements instantly with precise joint visualization.
            </p>
          </div>

          {/* Card 2 (Medium) */}
          <div className="md:col-span-1 md:row-span-1 bg-[#1A1005] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C9933A]/50 transition-colors min-h-[250px] md:min-h-0">
            <Brain className="text-[#C9933A] w-10 h-10 mb-4" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Pose Intelligence</h3>
              <p className="text-sm text-white/60">
                Recognizes 7 essential yoga poses with detailed instructions, difficulty level, and Sanskrit names.
              </p>
            </div>
          </div>

          {/* Card 3 (Small) */}
          <div className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C9933A]/50 transition-colors min-h-[250px] md:min-h-0">
            <Activity className="text-[#C9933A] w-10 h-10 mb-4" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Feedback</h3>
              <p className="text-sm text-white/60 italic border-l-2 border-[#C9933A] pl-3">
                “Straighten your back”<br/>“Adjust your knee angle”
              </p>
            </div>
          </div>

          {/* Card 4 (Medium Wide) */}
          <div className="md:col-span-2 md:row-span-1 bg-[#1A1005] border border-white/10 rounded-3xl p-8 flex flex-col justify-center hover:border-[#C9933A]/50 transition-colors relative overflow-hidden min-h-[250px] md:min-h-0">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Target size={150} className="text-[#C9933A]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 z-10">Accuracy Scoring System</h3>
            <p className="text-white/60 max-w-md z-10">
              Measures posture precision with a 0–100% alignment score and visual indicators for improvement.
            </p>
          </div>

          {/* Card 5 (Small) */}
          <div className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C9933A]/50 transition-colors min-h-[250px] md:min-h-0">
            <History className="text-[#C9933A] w-10 h-10 mb-4" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-white/60">
                Stores session history, scores, and duration to help you monitor improvement over time.
              </p>
            </div>
          </div>

          {/* Card 6 (Wide - Bottom) */}
          <div className="md:col-span-3 md:row-span-1 bg-gradient-to-r from-[#1A1005] via-[#C9933A]/10 to-[#1A1005] border border-[#C9933A]/20 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between hover:border-[#C9933A]/50 transition-colors min-h-[250px] md:min-h-0">
            <div className="mb-6 md:mb-0">
              <h3 className="text-3xl font-bold text-white mb-3">Seamless Web Experience</h3>
              <p className="text-lg text-white/70 max-w-2xl">
                Runs entirely in your browser with live webcam feed, responsive UI, and zero setup required.
              </p>
            </div>
            <Globe size={80} className="text-[#C9933A] opacity-50" />
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="relative py-32 border-t border-white/10 overflow-hidden">
        {/* Background Grid Pattern like the image */}
        <div className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#C9933A] uppercase mb-4">Our Creative Team</h2>
            <p className="text-xl md:text-5xl text-white/90 font-serif max-w-2xl leading-tight mx-auto md:mx-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              A focused team combining development, AI/ML, and design to build an intelligent yoga guidance solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {/* Team Member 1 - Purple */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[300px] h-[400px] bg-[#C177A1] rounded-t-[150px] rounded-b-3xl mb-8 relative flex flex-col justify-end p-8 overflow-hidden group shadow-[0_0_40px_rgba(193,119,161,0.15)] hover:shadow-[0_0_60px_rgba(193,119,161,0.3)] transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-4xl font-bold text-white mb-1 uppercase font-serif tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Aashish</h3>
                  <p className="text-white font-semibold tracking-[0.2em] text-xs uppercase bg-black/40 inline-block px-3 py-1.5 rounded-full backdrop-blur-md">Project Lead & Full Stack Developer</p>
                </div>
              </div>
              <ul className="text-center font-semibold space-y-2 text-white/70">
                <li>Team Lead</li>
                <li>System Architect</li>
                <li>Computer vision</li>
                <li>Pose Estimation Engineer</li>
                <li>Database dev</li>
                <li>UI-UX design</li>
              </ul>
            </div>

            {/* Team Member 2 - Grey */}
            <div className="flex flex-col items-center md:-mt-12">
              <div className="w-full max-w-[300px] h-[400px] bg-[#B0BEC5] rounded-t-[150px] rounded-b-3xl mb-8 relative flex flex-col justify-end p-8 overflow-hidden group shadow-[0_0_40px_rgba(176,190,197,0.1)] hover:shadow-[0_0_60px_rgba(176,190,197,0.2)] transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-4xl font-bold text-[#1A1005] mb-1 uppercase font-serif tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Madhav</h3>
                  <p className="text-[#1A1005] font-bold tracking-[0.2em] text-xs uppercase bg-white/40 inline-block px-3 py-1.5 rounded-full backdrop-blur-md">Frontend dev & tester </p>
                </div>
              </div>
              <ul className="text-center font-semibold space-y-2 text-white/70">
                <li>Frontend Developer </li>
                <li>Testing Engineer</li>
                <li>Documentation</li>
              </ul>
            </div>

            {/* Team Member 3 - Yellow */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[300px] h-[400px] bg-[#FACC15] rounded-t-[150px] rounded-b-3xl mb-8 relative flex flex-col justify-end p-8 overflow-hidden group shadow-[0_0_40px_rgba(250,204,21,0.15)] hover:shadow-[0_0_60px_rgba(250,204,21,0.3)] transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-4xl font-bold text-[#1A1005] mb-1 uppercase font-serif tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Adil</h3>
                  <p className="text-[#1A1005] font-bold tracking-[0.2em] text-xs uppercase bg-white/40 inline-block px-3 py-1.5 rounded-full backdrop-blur-md">Backend & ML</p>
                </div>
              </div>
              <ul className="text-center  font-semibold  space-y-2 text-white/70">
                <li>Backend Developer</li>
                <li>ML Model Developer</li>
                <li>pose calculation </li>
                <li>WebSocket Engineer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="container mx-auto px-6 lg:px-12 py-32 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#1A1005] to-[#0A0705] border border-[#C9933A]/20 rounded-[3rem] py-24 px-10 shadow-[0_0_80px_rgba(201,147,58,0.15)] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#C9933A] blur-[120px] opacity-20 pointer-events-none"></div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-12 font-serif relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Start Your Smart Yoga Journey
          </h2>
          <Link href="/live-session" className="relative z-10">
            <button className="px-10 py-5 sm:px-16 sm:py-6 bg-[#C9933A] hover:bg-[#E8B84B] text-[#1A1005] text-lg sm:text-xl font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_0_40px_rgba(201,147,58,0.4)] hover:shadow-[0_0_60px_rgba(201,147,58,0.7)] hover:scale-105 transition-all duration-500">
              TRY NOW
            </button>
          </Link>
          <p className="mt-10 text-white/50 text-xl font-light italic relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            No installations. No cost. Just open your browser and begin.
          </p>
        </div>
      </section>

    </div>
  );
}
