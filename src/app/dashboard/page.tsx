import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import CenterColumn from '@/components/dashboard/CenterColumn';
import RightColumn from '@/components/dashboard/RightColumn';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white font-body text-[#1E1E1E] p-4 lg:p-8 flex justify-center selection:bg-[#C6A85B] selection:text-white">
      <div className="w-full max-w-[1468px] flex flex-col lg:flex-row gap-6 relative items-start">
        <Sidebar />
        <CenterColumn />
        <RightColumn />
      </div>
    </div>
  );
}
