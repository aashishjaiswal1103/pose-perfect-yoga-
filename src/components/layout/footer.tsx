"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/live-session') || pathname === '/login' || pathname === '/dashboard' || pathname === '/about') return null;

  return (
    <footer className="w-full bg-[#38220f] py-16 px-6 md:px-12 text-[#C6A85B] relative overflow-hidden">
      <div className="container mx-auto max-w-[1400px]">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-sm tracking-wider uppercase font-medium">
          
          {/* Newsletter / Left */}
          <div className="col-span-1 md:col-span-1">
            <p className="mb-6 leading-relaxed">SIGN UP FOR THE LATEST WORK,<br/>NEWS & INSIGHTS</p>
            <div className="flex items-center border-b border-[#C6A85B]/50 pb-2 w-full max-w-[200px] group">
              <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent border-none outline-none w-full text-[#C6A85B] placeholder-[#C6A85B]/50" />
              <span className="group-hover:translate-x-2 transition-transform cursor-pointer">→</span>
            </div>
          </div>

          {/* Socials / Middle */}
          <div className="col-span-1 flex flex-col gap-3">
            <Link href="#" className="flex items-center justify-between w-24 hover:opacity-70 transition-opacity">
              <span>INSTAGRAM</span> <span>→</span>
            </Link>
            <Link href="#" className="flex items-center justify-between w-24 hover:opacity-70 transition-opacity">
              <span>LINKED IN</span> <span>→</span>
            </Link>
            <Link href="#" className="flex items-center justify-between w-24 hover:opacity-70 transition-opacity">
              <span>SPOTIFY</span> <span>→</span>
            </Link>
          </div>

          {/* Copyright / Middle Right */}
          <div className="col-span-1">
            <p className="opacity-70">
              © 2024-2026<br/>
              POSE PERFECT CO.
            </p>
          </div>

          {/* Legal / Right */}
          <div className="col-span-1 flex flex-col gap-3">
            <Link href="#" className="flex items-center justify-between w-[160px] hover:opacity-70 transition-opacity">
              <span>TERMS & CONDITIONS</span> <span>→</span>
            </Link>
            <Link href="#" className="flex items-center justify-between w-[160px] hover:opacity-70 transition-opacity">
              <span>PRIVACY POLICY</span> <span>→</span>
            </Link>
            <Link href="#" className="flex items-center justify-between w-[160px] hover:opacity-70 transition-opacity">
              <span>COOKIES POLICY</span> <span>→</span>
            </Link>
          </div>

        </div>

        {/* Huge Bottom Text */}
        <div className="w-full flex justify-center items-end mt-4 pb-0">
           <h1 className="text-[12vw] md:text-[14vw] font-medium leading-none text-[#C6A85B] whitespace-nowrap text-center drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              POSE PERFECT
           </h1>
        </div>
      </div>
    </footer>
  );
}
