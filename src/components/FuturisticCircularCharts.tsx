import React, { useState } from 'react';
import { SURVEY_QUESTIONS, getLikertInterpretation, RATING_SCALE_INFO } from '../constants';
import { Sparkles, Layers, PieChart, Disc, Compass } from 'lucide-react';

interface FuturisticCircularChartsProps {
  questionAverages: number[];
  overallAverage: number;
  totalCount: number;
  overallDistribution: { [score: number]: number };
  totalPossibleRatings: number;
  isDarkMode: boolean;
}

// Color palettes for futuristic neon arcs
const NEON_PALETTES = [
  {
    id: 1,
    gradientId: 'neon-cyan',
    stroke: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    trackBg: 'rgba(6, 182, 212, 0.12)',
    badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    name: 'Q1: เนื้อหาหลักสูตร',
    stops: ['#22d3ee', '#0284c7'],
  },
  {
    id: 2,
    gradientId: 'neon-emerald',
    stroke: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    trackBg: 'rgba(16, 185, 129, 0.12)',
    badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    name: 'Q2: วิทยากรและการสอน',
    stops: ['#34d399', '#059669'],
  },
  {
    id: 3,
    gradientId: 'neon-indigo',
    stroke: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    trackBg: 'rgba(99, 102, 241, 0.12)',
    badgeBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    name: 'Q3: การนำไปใช้จริง',
    stops: ['#818cf8', '#4f46e5'],
  },
  {
    id: 4,
    gradientId: 'neon-amber',
    stroke: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    trackBg: 'rgba(245, 158, 11, 0.12)',
    badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    name: 'Q4: เวลาและสถานที่',
    stops: ['#fbbf24', '#d97706'],
  },
  {
    id: 5,
    gradientId: 'neon-violet',
    stroke: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    trackBg: 'rgba(168, 85, 247, 0.12)',
    badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    name: 'Q5: ความพึงพอใจภาพรวม',
    stops: ['#c084fc', '#9333ea'],
  },
];

export const FuturisticCircularCharts: React.FC<FuturisticCircularChartsProps> = ({
  questionAverages,
  overallAverage,
  totalCount,
  overallDistribution,
  totalPossibleRatings,
  isDarkMode,
}) => {
  const [viewMode, setViewMode] = useState<'gauges' | 'concentric' | 'donut'>('gauges');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Chart View Mode Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>กราฟวงกลมเรเดียลล้ำยุค (Futuristic Radial Analytics)</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Next-Gen
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            แสดงผลคะแนนความพึงพอใจ 5 มิติด้วยวงแหวนเรเดียลนีออนเรืองแสงสำหรับจอโปรเจกเตอร์
          </p>
        </div>

        {/* Interactive Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setViewMode('gauges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'gauges'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>5 วงแหวนแยกรายข้อ</span>
          </button>

          <button
            onClick={() => setViewMode('concentric')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'concentric'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>วงแหวนซ้อน 5 ชั้น (Orbit Radar)</span>
          </button>

          <button
            onClick={() => setViewMode('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'donut'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>สัดส่วนดาว 1-5 (Cyber Donut)</span>
          </button>
        </div>
      </div>

      {/* SVG Defs for Gradients and Glow Filters */}
      <svg className="w-0 h-0 absolute pointer-events-none">
        <defs>
          {NEON_PALETTES.map(p => (
            <linearGradient key={p.gradientId} id={p.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.stops[0]} />
              <stop offset="100%" stopColor={p.stops[1]} />
            </linearGradient>
          ))}
          <linearGradient id="neon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* MODE 1: 5 Futuristic Individual Radial Gauges */}
      {viewMode === 'gauges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SURVEY_QUESTIONS.map((q, idx) => {
              const score = questionAverages[idx] || 0;
              const percent = Math.min(100, Math.max(0, (score / 5) * 100));
              const palette = NEON_PALETTES[idx];
              const qInterp = getLikertInterpretation(score);
              const isHovered = hoveredIndex === idx;

              // SVG Circle Math (Radius = 48, Circumference = 2 * pi * 48 = 301.59)
              const r = 48;
              const circ = 2 * Math.PI * r;
              const strokeOffset = circ - (circ * percent) / 100;

              return (
                <div
                  key={q.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`p-4 rounded-2xl transition-all duration-300 relative flex flex-col items-center justify-between border cursor-pointer ${
                    isHovered
                      ? 'scale-[1.03] shadow-lg border-indigo-400 dark:border-cyan-400 bg-slate-50 dark:bg-slate-800/90'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  style={{
                    boxShadow: isHovered ? `0 10px 25px -5px ${palette.glowColor}` : undefined,
                  }}
                >
                  {/* Category Top Tag */}
                  <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span className="uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400">
                      {q.shortLabel}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800">
                      {q.category}
                    </span>
                  </div>

                  {/* Circular Radial Gauge Frame */}
                  <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      
                      {/* Outer tick marks orbit */}
                      <circle
                        cx="60"
                        cy="60"
                        r="56"
                        fill="none"
                        stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                        strokeWidth="1"
                        strokeDasharray="2 6"
                      />

                      {/* Background track circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r={r}
                        fill="none"
                        stroke={isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}
                        strokeWidth="10"
                        strokeLinecap="round"
                      />

                      {/* Foreground glowing animated progress arc */}
                      <circle
                        cx="60"
                        cy="60"
                        r={r}
                        fill="none"
                        stroke={`url(#${palette.gradientId})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: isHovered || isDarkMode ? `drop-shadow(0 0 6px ${palette.stroke})` : undefined,
                        }}
                      />
                    </svg>

                    {/* Inside Radial HUD readout */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white leading-none">
                        {totalCount > 0 ? score.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        / 5.00
                      </span>
                      <span
                        className="text-[11px] font-bold mt-1 px-2 py-0.2 rounded-full tabular-nums"
                        style={{ color: palette.stroke }}
                      >
                        {Math.round(percent)}%
                      </span>
                    </div>
                  </div>

                  {/* Question Title & Likert Badge */}
                  <div className="w-full text-center mt-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight min-h-[32px]">
                      {q.title}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">เกณฑ์:</span>
                      <span className={`px-2 py-0.5 rounded font-semibold ${qInterp.badgeClass}`}>
                        {totalCount > 0 ? qInterp.label.split(' ')[0] : 'รอข้อมูล'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Central Radial Score Overview Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              
              {/* Giant Master Glowing Ring */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#neon-cyan)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={(2 * Math.PI * 42) * (1 - (overallAverage / 5))}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold tabular-nums text-cyan-300">
                    {Math.round((overallAverage / 5) * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
                    ✦ OVERALL RADIAL CONSENSUS
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {getLikertInterpretation(overallAverage).label}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  คะแนนประเมินเฉลี่ยรวมทุกด้าน: <span className="text-cyan-400 font-mono">{overallAverage.toFixed(2)}</span> / 5.00
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {getLikertInterpretation(overallAverage).description} (ประมวลผลจากผู้ตอบ {totalCount} คนแบบเรียลไทม์)
                </p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">จุดสูงสุด</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {Math.max(...questionAverages, 0).toFixed(2)}
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">เป้าหมายมาตรฐาน</div>
                <div className="text-sm font-bold text-indigo-400 font-mono">
                  ≥ 3.51
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Concentric Multi-Orbit Radar Rings (Apple Fitness / Sci-Fi HUD Style) */}
      {viewMode === 'concentric' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Concentric SVG Multi-Ring (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
                  {/* Subtle target radar crosshairs */}
                  <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                  {/* 5 Concentric Rings: radii 125, 105, 85, 65, 45 */}
                  {[
                    { r: 125, width: 14, idx: 0, palette: NEON_PALETTES[0] },
                    { r: 105, width: 14, idx: 1, palette: NEON_PALETTES[1] },
                    { r: 85,  width: 14, idx: 2, palette: NEON_PALETTES[2] },
                    { r: 65,  width: 14, idx: 3, palette: NEON_PALETTES[3] },
                    { r: 45,  width: 14, idx: 4, palette: NEON_PALETTES[4] },
                  ].map(({ r, width, idx, palette }) => {
                    const score = questionAverages[idx] || 0;
                    const percent = (score / 5);
                    const circ = 2 * Math.PI * r;
                    const offset = circ * (1 - percent);
                    const isHover = hoveredIndex === idx;

                    return (
                      <g key={r} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                        {/* Background track */}
                        <circle
                          cx="150"
                          cy="150"
                          r={r}
                          fill="none"
                          stroke={palette.trackBg}
                          strokeWidth={width}
                          strokeLinecap="round"
                        />
                        {/* Glowing progress arc */}
                        <circle
                          cx="150"
                          cy="150"
                          r={r}
                          fill="none"
                          stroke={`url(#${palette.gradientId})`}
                          strokeWidth={isHover ? width + 3 : width}
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          className="transition-all duration-1000 ease-out cursor-pointer"
                          style={{
                            filter: isHover ? `drop-shadow(0 0 10px ${palette.stroke})` : `drop-shadow(0 0 4px ${palette.stroke}88)`,
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Central Futuristic Core */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-slate-950/80 border border-slate-700/80 flex flex-col items-center justify-center shadow-lg backdrop-blur-xs">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">AVG</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono leading-none">
                      {overallAverage.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                วงแหวนซ้อน 5 วง: วงนอกสุดคือข้อ 1 เรียงเข้าสู่วงในสุดข้อ 5
              </p>
            </div>

            {/* Orbit Ring Legend & Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                รายละเอียดวงแหวนเรเดียลแต่ละชั้น
              </div>

              {SURVEY_QUESTIONS.map((q, idx) => {
                const score = questionAverages[idx] || 0;
                const palette = NEON_PALETTES[idx];
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={q.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isHovered
                        ? 'bg-slate-800 border-cyan-400 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: palette.stroke }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{q.shortLabel}</span>
                          <span className="text-slate-400 font-normal">· {q.category}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 truncate max-w-[200px]">
                          {q.title}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        {score.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 5.00</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: Futuristic Donut Chart for 1-5 Stars Distribution */}
      {viewMode === 'donut' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Cyber Donut SVG */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
                  {/* Generate Donut Segments */}
                  {(() => {
                    const r = 85;
                    const circ = 2 * Math.PI * r;
                    let accumulatedOffset = 0;
                    const segments = [
                      { star: 5, color: '#6366f1', glow: '#818cf8', label: '5 ดาว (มากที่สุด)' },
                      { star: 4, color: '#10b981', glow: '#34d399', label: '4 ดาว (มาก)' },
                      { star: 3, color: '#f59e0b', glow: '#fbbf24', label: '3 ดาว (ปานกลาง)' },
                      { star: 2, color: '#f97316', glow: '#fb923c', label: '2 ดาว (น้อย)' },
                      { star: 1, color: '#ef4444', glow: '#f87171', label: '1 ดาว (น้อยที่สุด)' },
                    ];

                    return segments.map((seg, i) => {
                      const count = overallDistribution[seg.star] || 0;
                      const share = totalPossibleRatings > 0 ? count / totalPossibleRatings : 0;
                      const strokeDash = share * circ;
                      const offset = accumulatedOffset;
                      accumulatedOffset += strokeDash;

                      if (count === 0) return null;

                      return (
                        <circle
                          key={seg.star}
                          cx="120"
                          cy="120"
                          r={r}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="24"
                          strokeDasharray={`${strokeDash} ${circ - strokeDash}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-700 ease-out hover:stroke-[28px] cursor-pointer"
                          style={{ filter: `drop-shadow(0 0 5px ${seg.glow}88)` }}
                        />
                      );
                    });
                  })()}

                  {/* Empty Ring Track if no data */}
                  {totalPossibleRatings === 0 && (
                    <circle cx="120" cy="120" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="24" />
                  )}
                </svg>

                {/* Donut Center Hole HUD */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">TOTAL RATINGS</span>
                  <span className="text-3xl font-extrabold text-white font-mono leading-none mt-1">
                    {totalPossibleRatings}
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold mt-1">
                    คะแนนทั้งหมด
                  </span>
                </div>
              </div>
            </div>

            {/* Donut Distribution Breakdown Table */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                สัดส่วนการลงคะแนนแยกตามระดับดาว 1 ถึง 5 ดาว
              </h3>
              
              {[
                { star: 5, color: 'bg-indigo-500', text: 'text-indigo-400', label: '5 ดาว (มากที่สุด)' },
                { star: 4, color: 'bg-emerald-500', text: 'text-emerald-400', label: '4 ดาว (มาก)' },
                { star: 3, color: 'bg-amber-500', text: 'text-amber-400', label: '3 ดาว (ปานกลาง)' },
                { star: 2, color: 'bg-orange-500', text: 'text-orange-400', label: '2 ดาว (น้อย)' },
                { star: 1, color: 'bg-rose-500', text: 'text-rose-400', label: '1 ดาว (น้อยที่สุด)' },
              ].map(s => {
                const count = overallDistribution[s.star] || 0;
                const percent = totalPossibleRatings > 0 ? Math.round((count / totalPossibleRatings) * 100) : 0;

                return (
                  <div key={s.star} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${s.color} shrink-0`} />
                      <span className="text-xs font-medium text-slate-200">{s.label}</span>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs font-bold text-white font-mono">{count} ครั้ง</span>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${s.text} bg-slate-800`}>
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
