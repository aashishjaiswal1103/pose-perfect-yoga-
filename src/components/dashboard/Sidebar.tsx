'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, BookImage, Info, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Poses', href: '/poses', icon: BookImage },
  { label: 'About', href: '/about', icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = React.useState<string>('Guest');

  React.useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <aside className="w-full lg:w-[240px] flex-shrink-0 flex lg:flex-col items-center justify-between lg:justify-start rounded-3xl lg:rounded-[32px] py-4 lg:py-8 px-4 bg-gradient-to-b from-[#24150A]/95 to-[#0A0603]/95 backdrop-blur-md shadow-2xl border border-white/5 relative overflow-hidden lg:sticky lg:top-8 h-auto lg:h-[calc(100vh-64px)] z-20">
      {/* Top Logo */}
      <Link href="/" className="hidden lg:flex mb-10 hover:scale-105 transition-transform flex-col items-center group relative z-10">
        <h1 className="text-[#C6A85B] font-sans font-bold text-2xl tracking-tight leading-none text-center drop-shadow-sm">
          Pose<span className="font-serif italic text-3xl ml-1 -mt-1 group-hover:text-white transition-colors">Perfect</span>
        </h1>
      </Link>

      {/* Avatar Section */}
      <div className="hidden lg:flex flex-col items-center mb-10 w-full relative z-10">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-lg mb-4 border-2 border-[#C6A85B]/40">
          <Image src="/avtar.jpeg" alt={userName} width={100} height={100} className="object-cover w-full h-full" />
        </div>
        <h2 className="text-white text-2xl font-medium tracking-tight">{userName}</h2>
        <span className="text-[#C6A85B] text-sm font-light mt-1 flex items-center gap-1">
          <span className="text-[10px]">✦</span> student 1 degree
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-row lg:flex-col gap-2 lg:gap-2 flex-1 lg:flex-none lg:w-full lg:mb-8 relative z-10 justify-around lg:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.label === 'Poses' && pathname.startsWith('/poses'));
          return (
             <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 p-2 lg:px-6 lg:py-3.5 rounded-xl lg:rounded-full text-[11px] lg:text-[15px] transition-all duration-300 w-auto lg:w-full relative group',
                isActive
                  ? 'text-white bg-[#C6A85B]/20 font-medium'
                  : 'text-[#C6A85B]/70 hover:text-white hover:bg-white/10 font-medium'
              )}
            >
              {isActive && (
                 <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-3/5 bg-[#C6A85B] rounded-r-full shadow-[0_0_8px_#C6A85B]" />
              )}
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-0 lg:pt-4 w-auto lg:w-full relative z-10 border-t-0 lg:border-t border-white/10">
         <button className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 p-2 lg:px-6 lg:py-3.5 rounded-xl lg:rounded-full text-[11px] lg:text-[15px] text-[#C6A85B]/60 hover:text-white hover:bg-white/10 transition-all duration-300 w-auto lg:w-full">
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span className="lg:inline">Logout</span>
         </button>
      </div>

      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#C6A85B]/5 rounded-full blur-3xl pointer-events-none"></div>
    </aside>
  );
}
