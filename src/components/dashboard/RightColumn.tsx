'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function RightColumn() {
  const [sessionDates, setSessionDates] = useState<string[]>([]);
  const [achievements, setAchievements] = useState({
    best_accuracy: 0,
    longest_session: 0,
    total_sessions: 0,
    longest_streak: 0
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "1";

    // Fetch streak + session dates
    fetch(`http://localhost:8000/api/stats/streak?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSessionDates(data.session_dates || []);
        // update achievement streak directly if needed or fetch
        setAchievements(prev => ({...prev, longest_streak: data.streak}))
      })
      .catch(err => console.error(err));

    // Fetch achievements
    fetch(`http://localhost:8000/api/stats/achievements?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setAchievements(prev => ({...prev, ...data})))
      .catch(err => console.error(err));
  }, []);

  // Build calendar for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Monday as first day of the week
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const monthName = now.toLocaleString("en", { month: "long" });

  // Convert session dates to just day numbers for current month
  const practicedDays = sessionDates
    .filter(d => {
      const date = new Date(d);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .map(d => new Date(d).getDate());

  // Format longest session seconds to minutes
  const longestSessionMins = achievements.longest_session > 0
    ? `${Math.floor(achievements.longest_session / 60)}m ${achievements.longest_session % 60}s`
    : "0m";

  return (
    <div className="w-full lg:w-[330px] flex-shrink-0 flex flex-col gap-6 pl-0 lg:pl-4">

      {/* Streak Calendar */}
      <div className="bg-[#24262A] rounded-[32px] p-8 shadow-2xl border-none flex flex-col font-sans">
        <div className="flex justify-between items-center mb-8 px-1">
          <h3 className="text-white font-medium text-[15px]">Your Training Days</h3>
          <span className="text-white/80 text-[11px] flex items-center gap-1.5 cursor-pointer">
            {monthName} <span className="text-[8px]">▼</span>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-y-6 gap-x-1 mb-8">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-[#8A8A8E] mb-1">
              {d}
            </div>
          ))}

          {/* Empty slots for start of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-8 h-8" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const practiced = practicedDays.includes(day);
            const isToday = day === today;
            return (
              <div key={day} className="flex justify-center items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[11px] transition-all",
                    practiced
                      ? "bg-[#EFC042] text-[#1E1E1E] font-bold"
                      : "bg-transparent text-white/50 hover:bg-[#34363A] hover:text-white cursor-default",
                    isToday && !practiced && "border border-white/40 text-white"
                  )}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between px-2 mt-auto text-[10px] text-white/50">
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-white/40"></span> Current day</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EFC042]"></span> Done</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/10"></span> Scheduled</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#EAEAEA]">
        <h3 className="text-[#1E1E1E] font-medium text-[15px] mb-6 px-1">Achievements</h3>
        <div className="flex flex-col gap-5">

          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <span className="text-lg">🏅</span>
              <span className="text-[#6B6B6B] text-[13px] font-medium">Best Accuracy</span>
            </div>
            <span className="text-[#1E1E1E] font-medium text-[13px]">{achievements.best_accuracy}%</span>
          </div>

          <div className="w-full h-px bg-[#1E1E1E]/5" />

          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <span className="text-lg">🔥</span>
              <span className="text-[#6B6B6B] text-[13px] font-medium">Longest Streak</span>
            </div>
            <span className="text-[#1E1E1E] font-medium text-[13px]">{achievements.longest_streak} Days</span>
          </div>

          <div className="w-full h-px bg-[#1E1E1E]/5" />

          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <span className="text-lg">⏱</span>
              <span className="text-[#6B6B6B] text-[13px] font-medium">Longest Session</span>
            </div>
            <span className="text-[#1E1E1E] font-medium text-[13px]">{longestSessionMins}</span>
          </div>

          <div className="w-full h-px bg-[#1E1E1E]/5" />

          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <span className="text-lg">🧘</span>
              <span className="text-[#6B6B6B] text-[13px] font-medium">Total Sessions</span>
            </div>
            <span className="text-[#1E1E1E] font-medium text-[13px]">{achievements.total_sessions}</span>
          </div>

        </div>
      </div>

    </div>
  );
}