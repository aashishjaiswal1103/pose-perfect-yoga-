'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navLinks = [
  { href: '/poses', label: 'Poses' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About Us' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState<string>('Guest');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/live-session') || pathname === '/login' || pathname === '/dashboard') return null;

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-500"
      style={
        isScrolled
          ? {
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }
          : {
              background: 'rgba(56, 34, 15, 0.88)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              borderBottom: '1px solid rgba(206, 176, 95, 0.25)',
              boxShadow: '0 8px 32px rgba(56, 34, 15, 0.3), inset 0 1px 0 rgba(206, 176, 95, 0.15)',
            }
      }
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left Side: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-1 group">
            <div
              className="relative w-16 h-16 overflow-hidden rounded-full transition-transform group-hover:scale-105"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
            >
              <Image
                src="/logo.png"
                alt="Perfect Pose Logo"
                fill
                className="object-cover"
              />
            </div>
            <span
              className="font-headline text-4xl md:text-4xl font-extrabold tracking-wider transition-colors duration-500"
              style={{ color: isScrolled ? '#38220F' : '#e0cfa3ff' }}
            >
              Pose Perfect
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex flex-none">
          <div className="flex justify-center items-center gap-8">
            {navLinks.map((link) => (
              <Button key={link.href} variant="link" asChild className="p-0">
                <Link
                  href={link.href}
                  className="text-3xl font-bold transition-all tracking-wide"
                  style={{ color: isScrolled ? '#38220F' : '#f8d575ff' }}
                >
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </nav>

        {/* Right Side: Greeting */}
        <div className="hidden md:flex flex-1 justify-end items-center">
          <span
            className="text-2xl font-medium tracking-wide transition-colors duration-500"
            style={{ color: isScrolled ? '#38220F' : '#e0cfa3ff' }}
          >
            Hello {userName}
          </span>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <span
            className="text-lg font-medium tracking-wide transition-colors duration-500"
            style={{ color: isScrolled ? '#38220F' : '#e0cfa3ff' }}
          >
            Hello {userName}
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                style={{ color: isScrolled ? '#38220F' : '#CEB05F' }}
              >
                <Menu className="h-7 w-7" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-l"
              style={{
                background: 'rgba(56, 34, 15, 0.85)',
                backdropFilter: 'blur(32px) saturate(200%)',
                WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                borderLeft: '1px solid rgba(206, 176, 95, 0.25)',
                boxShadow: '-8px 0 32px rgba(56, 34, 15, 0.3)',
              }}
            >
              <div className="flex flex-col space-y-6 pt-12">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="text-xl font-semibold transition-colors"
                      style={{ color: '#CEB05F' }}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}