'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function CenterColumn() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [userName, setUserName] = useState("Yogi");

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "1";
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }

    fetch(`http://localhost:8000/api/sessions?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setSessions(data.sessions))
      .catch(err => console.error(err));

    fetch(`http://localhost:8000/api/sessions/weekly?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setWeeklyData(data.weekly))
      .catch(err => console.error(err));
  }, []);

  const chartData = weeklyData.length > 0
    ? weeklyData.map((d: any) => ({
        day: new Date(d.day).toLocaleDateString("en", { weekday: "short" }),
        accuracy: d.avg_score
      }))
    : [{ day: "No data", accuracy: 0 }];

  // --- Use LOCAL date string (not UTC) to avoid timezone mismatch with DB ---
  const now = new Date();
  const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Filter out zero-duration sessions from display entirely
  const validSessions = sessions.filter(s => s.duration_seconds > 0);

  // Today: strictly sessions whose local date prefix matches today
  const todaySessions = validSessions.filter(s => s.created_at.startsWith(localTodayStr));

  // History: all other valid days (not today), grouped by date
  const historyGroups: Record<string, any[]> = {};
  validSessions.forEach(s => {
    const d = s.created_at.split('T')[0];
    if (d !== localTodayStr) {
      if (!historyGroups[d]) historyGroups[d] = [];
      historyGroups[d].push(s);
    }
  });

  const sortedHistoryDates = Object.keys(historyGroups)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 5);

  // Total stats across all valid sessions
  const totalSessions = validSessions.length;
  const totalDurationSeconds = validSessions.reduce((acc, s) => acc + s.duration_seconds, 0);
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const seconds = totalDurationSeconds % 60;

  // Today summary stats
  const avgAccuracy = todaySessions.length
    ? Math.round(todaySessions.reduce((acc, s) => acc + s.best_score, 0) / todaySessions.length)
    : 0;
  const totalTodaySecs = todaySessions.reduce((acc, s) => acc + s.duration_seconds, 0);
  const totalTodayMins = Math.floor(totalTodaySecs / 60);

  // Bubble sizing: combine hold time and accuracy to get a weighted score, then scale to px
  const getBubbleSize = (session: any) => {
    // Weight: 60% time contribution + 40% accuracy contribution
    const maxExpectedTime = 300; // 5 min as reference max
    const timeFactor = Math.min(session.duration_seconds / maxExpectedTime, 1);
    const accFactor = (session.best_score || 0) / 100;
    const score = timeFactor * 0.6 + accFactor * 0.4;
    return Math.round(100 + score * 120); // range: 100px to 220px
  };

  // Format date: "Thursday — 07 Apr 2026"
  const formatDateName = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00'); // noon to avoid timezone day-flip
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(/ /g, ' ');
  };

  const colors = ["bg-[#F4C790]/90", "bg-[#F7A8D6]/90", "bg-[#8BC6F7]/90", "bg-[#AEE195]/90"];
  const positions = [
    { top: '5%', right: '20%' },
    { top: '40%', right: '5%' },
    { bottom: '5%', right: '30%' },
    { top: '55%', right: '55%' }
  ];

  const historyColors = ["bg-[#EAE4D3]", "bg-[#E2F0D9]"];

  return (
    <div className="flex-1 flex flex-col gap-6 w-full lg:max-w-[950px] font-sans">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-[40px] font-bold text-[#1E1E1E] tracking-tight">Good Morning , {userName}</h2>
        <p className="text-[#6B6B6B] text-[13px] font-medium tracking-wide max-w-xl">
          This is your yoga dashboard, where you can see your analytics which help you to grow and feel motivated.
        </p>
      </div>

      {/* Today Session */}
      <div className="bg-[#F6E1B6] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row min-h-[340px]">
        <div className="w-full md:w-1/2 flex flex-col z-10 pt-2 pl-0 md:pl-4">
          <h3 className="text-3xl font-bold text-[#1E1E1E] mb-8 leading-tight">your today<br/>yoga session</h3>
          <h4 className="text-[#1E1E1E] font-bold text-[17px] mb-3">list of all poses</h4>
          <ul className="flex flex-col gap-2.5">
            {todaySessions.length === 0 ? (
              <li className="text-sm font-medium text-[#1E1E1E]/70">No sessions today. Go practice!</li>
            ) : (
              todaySessions.map((s, i) => (
                <li key={s.id} className="text-sm font-bold text-[#1E1E1E]">
                  {i + 1}. {s.pose_name.toLowerCase()} — {s.duration_seconds >= 60 ? `${Math.floor(s.duration_seconds/60)} min ${s.duration_seconds%60}s` : `${s.duration_seconds} sec`} — {s.best_score}% accuracy
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-full md:w-1/2 relative flex justify-center items-center mt-6 md:mt-0 min-h-[200px] md:min-h-0">
          {todaySessions.length > 0 && (
            <>
              {/* Summary Black Bubble */}
              <div
                className="absolute w-[84px] h-[84px] bg-[#1a1a1a] rounded-full flex flex-col items-center justify-center text-white z-30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                style={{ top: '28%', left: '12%' }}
              >
                <span className="text-[12px] font-bold">{totalTodayMins}m {totalTodaySecs%60}s</span>
                <span className="text-[10px] font-medium">{avgAccuracy}% avg</span>
              </div>

              {/* Pose Bubbles — radius driven by hold time + accuracy */}
              {todaySessions.slice(0, 4).map((s, i) => {
                const size = getBubbleSize(s);
                return (
                  <div
                    key={s.id}
                    className={`absolute rounded-full flex flex-col items-center justify-center text-center p-3 shadow-sm mix-blend-multiply ${colors[i % colors.length]} z-10 transition-all`}
                    style={{
                      width: size,
                      height: size,
                      top: positions[i % positions.length].top,
                      bottom: positions[i % positions.length].bottom,
                      right: positions[i % positions.length].right,
                    }}
                  >
                    <span className="text-[#1E1E1E] font-bold text-[13px] leading-tight mb-1 max-w-[90%] break-words">{s.pose_name.toLowerCase()}</span>
                    <span className="text-[#1E1E1E] text-[11px] font-bold leading-tight">
                      {s.duration_seconds >= 60 ? `${Math.floor(s.duration_seconds/60)}m${s.duration_seconds%60}s` : `${s.duration_seconds}s`}
                    </span>
                    <span className="text-[#1E1E1E] text-[11px] font-bold leading-tight">{s.best_score}%</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch min-h-[220px]">
        {/* Weekly Accuracy */}
        <div className="w-full md:w-[45%] bg-white rounded-[24px] p-6 border-4 border-[#5C3A21] flex flex-col">
          <h3 className="text-[#1E1E1E] font-medium text-[17px] mb-2">Weekly Accuracy</h3>
          <div className="flex-1 w-full -ml-4 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10 }} tickCount={5} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#EFC042" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full md:w-[55%] flex flex-col sm:flex-row md:flex-col gap-6">
          {/* Total Session */}
          <div className="bg-[#EFC042] rounded-[24px] p-6 flex justify-between items-center flex-1">
            <div className="flex flex-col">
              <h3 className="text-[26px] font-bold text-[#1E1E1E]">total session</h3>
              <span className="text-[#1E1E1E]/80 text-[13px] font-medium">you have done till now</span>
            </div>
            <span className="text-6xl font-normal text-[#1E1E1E] pr-2">{totalSessions}</span>
          </div>

          {/* Total Hold Time */}
          <div className="bg-[#D4D4D4] rounded-[24px] px-8 py-5 flex flex-col flex-1">
            <h3 className="text-[22px] font-bold text-[#1E1E1E] mb-1">total hold time</h3>
            <div className="flex gap-6 justify-center items-end mt-auto pb-1">
              <div className="flex flex-col items-center">
                <span className="text-[#1E1E1E] text-[13px] font-medium mb-0.5">hours</span>
                <span className="text-4xl font-normal text-[#1E1E1E]">{hours}</span>
              </div>
              <span className="text-4xl font-normal text-[#1E1E1E] pb-0.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#1E1E1E] text-[13px] font-medium mb-0.5">minutes</span>
                <span className="text-4xl font-normal text-[#1E1E1E]">{minutes.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-4xl font-normal text-[#1E1E1E] pb-0.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#1E1E1E] text-[13px] font-medium mb-0.5">second</span>
                <span className="text-4xl font-normal text-[#1E1E1E]">{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your History — strictly excludes today */}
      <div className="bg-[#EBB85C] rounded-[24px] pb-1 mt-4">
        <h3 className="text-[26px] font-bold text-[#1E1E1E] px-8 py-4">your history</h3>
        <div className="bg-white rounded-[24px] p-4 flex flex-col gap-4 border-2 border-[#EBB85C]">
          {sortedHistoryDates.length === 0 ? (
            <p className="text-sm text-[#6B6B6B] p-4 font-medium">No past history available.</p>
          ) : (
            sortedHistoryDates.map((date, index) => {
              const daySessions = historyGroups[date];
              const sortedSessions = [...daySessions].sort((a, b) => b.best_score - a.best_score);
              const maxScore = sortedSessions[0]?.best_score || 0;

              // Show up to 3 poses if best score > 90%, else just the single best
              let bestSessions = maxScore > 90
                ? sortedSessions.filter(s => s.best_score >= 90)
                : [sortedSessions[0]];

              // Deduplicate by pose name
              const seen = new Set<string>();
              bestSessions = bestSessions.filter(s => {
                if (seen.has(s.pose_name)) return false;
                seen.add(s.pose_name);
                return true;
              }).slice(0, 3);

              const bgColor = historyColors[index % historyColors.length];

              return (
                <div key={date} className={`${bgColor} rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-0`}>
                  <div className="w-full md:w-3/5 flex flex-col border-b md:border-b-0 md:border-r border-[#1E1E1E]/10 pb-4 md:pb-0 md:pr-6 mb-4 md:mb-0">
                    {/* Date with full label: Thursday — 07 May 2026 */}
                    <h4 className="text-[20px] font-bold text-[#1E1E1E] mb-1 capitalize">{formatDateName(date)}</h4>
                    <ul className="flex flex-col gap-3 pl-4 mt-4">
                      {daySessions.slice(0, 5).map((s, i) => (
                        <li key={s.id} className="text-sm font-bold text-[#1E1E1E]">
                          {i + 1}. {s.pose_name.toLowerCase()} — {s.duration_seconds >= 60 ? `${Math.floor(s.duration_seconds/60)} min` : `${s.duration_seconds} sec`} — {s.best_score}% accuracy
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full md:w-2/5 flex flex-col justify-center items-center md:pl-6 gap-2">
                    <span className="text-[20px] font-bold text-[#1E1E1E] mb-2 text-center leading-tight">Pose of the day</span>
                    <div className="flex flex-col items-center gap-1.5">
                      {bestSessions.map((bs, idx) => (
                        <span
                          key={idx}
                          className="text-[#1E1E1E] font-semibold text-[13px] bg-white/60 px-3 py-1 rounded-full text-center"
                        >
                          {bs.pose_name} ({bs.best_score}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}