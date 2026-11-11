import React from 'react';
import { Smartphone, LayoutDashboard, FileCode2, QrCode, Download } from 'lucide-react';
import { SurveyResponse } from '../types';
import { exportResponsesToCSV } from '../utils/storage';

interface HeaderProps {
  currentTab: 'survey' | 'dashboard' | 'guide';
  onSelectTab: (tab: 'survey' | 'dashboard' | 'guide') => void;
  onOpenQR: () => void;
  responses: SurveyResponse[];
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenQR,
  responses,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            ✦
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            ประเมินความพึงพอใจการอบรม
          </span>
        </div>

        {/* Navigation Tabs (Functional interactive controls) */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => onSelectTab('survey')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'survey'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>หน้าตอบแบบสอบถาม (Mobile)</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>หน้า Live Dashboard (Projector)</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">โค้ดแยก 2 ไฟล์ & วิธีตั้งค่า Firebase</span>
            <span className="sm:hidden">โค้ด & คู่มือ</span>
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            title="แสดง QR Code สำหรับผู้เข้าร่วมสแกน"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code ผู้ตอบ</span>
          </button>

          <button
            onClick={() => exportResponsesToCSV(responses)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            title="ดาวน์โหลดผลประเมินเป็นไฟล์ CSV รองรับภาษาไทยใน Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
