import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Download, 
  Maximize2, 
  QrCode, 
  PlusCircle, 
  Trash2, 
  MessageSquare,
  Search,
  CheckCircle,
  Share2
} from 'lucide-react';
import { SurveyResponse } from '../types';
import { SURVEY_QUESTIONS, getLikertInterpretation, RATING_SCALE_INFO } from '../constants';
import { 
  exportResponsesToCSV, 
  addRandomSampleResponses, 
  clearAllResponses 
} from '../utils/storage';
import { FuturisticCircularCharts } from './FuturisticCircularCharts';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQR: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  onOpenQR,
  surveyUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  // Statistics calculation
  const totalCount = responses.length;

  const questionSums = [0, 0, 0, 0, 0];
  const questionDistributions: { [score: number]: number }[] = [
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  ];

  let positiveRatingsCount = 0; // scores 4 or 5
  const overallDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  responses.forEach(r => {
    for (let i = 0; i < 5; i++) {
      const val = r.scores[i] || 0;
      questionSums[i] += val;
      if (val >= 1 && val <= 5) {
        questionDistributions[i][val] = (questionDistributions[i][val] || 0) + 1;
        overallDistribution[val as keyof typeof overallDistribution] = (overallDistribution[val as keyof typeof overallDistribution] || 0) + 1;
      }
      if (val >= 4) {
        positiveRatingsCount++;
      }
    }
  });

  const questionAverages = questionSums.map(sum => 
    totalCount > 0 ? Number((sum / totalCount).toFixed(2)) : 0
  );

  const overallAverage = totalCount > 0 
    ? Number((questionAverages.reduce((a, b) => a + b, 0) / 5).toFixed(2))
    : 0;

  const totalPossibleRatings = totalCount * 5;
  const positivePercentage = totalPossibleRatings > 0 
    ? Math.round((positiveRatingsCount / totalPossibleRatings) * 100)
    : 0;

  const likertInterpretation = getLikertInterpretation(overallAverage);

  // Filtered comments
  const comments = responses
    .filter(r => r.suggestion && r.suggestion.trim().length > 0)
    .filter(r => 
      searchTerm.trim() === '' || 
      (r.suggestion && r.suggestion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed', err);
      });
    }
  };

  const handleClearData = () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลการตอบทั้งหมด? ข้อมูลจะถูกลบและรีเซ็ตสำหรับเริ่มต้นงานอบรมใหม่')) {
      clearAllResponses();
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} py-6 px-4 sm:px-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dashboard Top Action Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Live Dashboard ผลการประเมินความพึงพอใจ
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                อัปเดตสด Real-time
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              หน้าจอสำหรับผู้จัดอบรมและฉายขึ้นโปรเจกเตอร์ แสดงผลทันทีเมื่อมีผู้ส่งแบบประเมิน
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Quick QR code button */}
            <button
              onClick={onOpenQR}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code ฉายขึ้นจอ</span>
            </button>

            {/* CSV Download */}
            <button
              onClick={() => exportResponsesToCSV(responses)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด CSV</span>
            </button>

            {/* Mock Data Generator */}
            <button
              onClick={() => addRandomSampleResponses(5)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
              title="สุ่มสร้างข้อมูล 5 คนสำหรับทดสอบกราฟ"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>+5 จำลองผล</span>
            </button>

            {/* Clear Data */}
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-2.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
              title="ล้างข้อมูลทั้งหมดเพื่อเริ่มงานจริง"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างผล</span>
            </button>

            {/* Theme & Fullscreen */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-2.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="สลับโหมดสว่าง / โหมดมืดสำหรับจอโปรเจกเตอร์"
            >
              {isDarkMode ? '☀️ สว่าง' : '🌙 มืด'}
            </button>

            <button
              onClick={handleFullscreenToggle}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="เต็มจอสำหรับฉายโปรเจกเตอร์"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Big KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: Total Respondents */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">จำนวนผู้ตอบทั้งหมด</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
                {totalCount}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">คน</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {totalCount > 0 ? 'ระบบกำลังรับข้อมูลอย่างต่อเนื่อง' : 'กำลังรอผู้ตอบสแกน QR Code'}
            </div>
          </div>

          {/* KPI 2: Overall Average Score */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">คะแนนเฉลี่ยรวม</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
                {overallAverage.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 5.00</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              คำนวณจากทุกข้อประเมิน (Likert Scale)
            </div>
          </div>

          {/* KPI 3: Likert Interpretation Level */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">การแปลผลตามเกณฑ์</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-1">
              <span className={`inline-block px-3 py-1 rounded-lg text-sm sm:text-base font-bold border ${likertInterpretation.badgeClass}`}>
                {totalCount > 0 ? likertInterpretation.label : 'รอข้อมูล'}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {totalCount > 0 ? likertInterpretation.description : 'ยังไม่มีผู้ตอบแบบประเมิน'}
            </div>
          </div>

          {/* KPI 4: Positive Ratings % */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">ความพึงพอใจระดับดีขึ้นไป</span>
              <CheckCircle className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-indigo-600 dark:text-indigo-400">
                {positivePercentage}%
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              สัดส่วนคะแนน 4 และ 5 ดาวทั้งหมด
            </div>
          </div>
        </div>

        {/* Main Grid: Bar Chart + Projector Quick Scan Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Futuristic Circular Radial HUD (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <FuturisticCircularCharts
              questionAverages={questionAverages}
              overallAverage={overallAverage}
              totalCount={totalCount}
              overallDistribution={overallDistribution}
              totalPossibleRatings={totalPossibleRatings}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Projector Screen QR Code Box (1 col) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-900/10 to-indigo-950/20 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm flex flex-col items-center justify-between text-center">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                สำหรับผู้เข้าอบรมสแกน
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                สแกน QR Code เพื่อประเมิน
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                เปิดกล้องมือถือ หรือแอป LINE สแกนทำแบบประเมินได้ทันที ไม่ต้องโหลดแอป
              </p>
            </div>

            {/* Quick QR canvas trigger */}
            <div 
              onClick={onOpenQR}
              className="my-4 p-3 bg-white rounded-2xl shadow-md border-2 border-indigo-500/20 hover:scale-105 transition-transform cursor-pointer group"
              title="คลิกเพื่อขยาย QR Code เต็มจอ"
            >
              <div className="w-40 h-40 flex items-center justify-center bg-slate-50 rounded-xl relative">
                <QrCode className="w-32 h-32 text-slate-800" />
                <span className="absolute bottom-1 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  คลิกเพื่อขยาย
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'คัดลอกลิงก์สำเร็จแล้ว!' : 'คัดลอกลิงก์ส่งในไลน์'}</span>
              </button>

              <button
                onClick={onOpenQR}
                className="w-full py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                ขยาย QR Code ให้ผู้เข้าอบรมแถวหลัง
              </button>
            </div>
          </div>
        </div>

        {/* Live Feedback & Suggestions Stream */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  ข้อเสนอแนะและสิ่งที่ประทับใจจากผู้เข้าอบรม
                </h3>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  {comments.length} ความคิดเห็น
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ความคิดเห็นจะปรากฏขึ้นที่นี่ทันทีแบบสดๆ จากห้องอบรม
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ค้นหาข้อความหรือคำสำคัญ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>ยังไม่มีข้อเสนอแนะหรือความคิดเห็นที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {comments.map((resp, i) => {
                const dateStr = new Date(resp.timestamp).toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={resp.id || i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
                  >
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{resp.suggestion}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        ให้คะแนนเฉลี่ย: {resp.average.toFixed(2)} ★
                      </span>
                      <span>เวลา {dateStr} น.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
