import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { QRCodeModal } from './components/QRCodeModal';
import { getStoredResponses, subscribeToResponses } from './utils/storage';
import { SurveyResponse } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isQROpen, setIsQROpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Initialize and subscribe to real-time updates
  useEffect(() => {
    // Initial fetch
    setResponses(getStoredResponses());

    // Compute live survey link
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = 'survey';
      setSurveyUrl(url.toString());

      // Parse hash on initial load
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard') {
        setCurrentTab('dashboard');
      } else if (hash === 'guide') {
        setCurrentTab('guide');
      } else if (hash === 'survey') {
        setCurrentTab('survey');
      }
    }

    // Subscribe to cross-tab & storage events
    const unsubscribe = subscribeToResponses((updated) => {
      setResponses(updated);
    });

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard') setCurrentTab('dashboard');
      else if (hash === 'guide') setCurrentTab('guide');
      else if (hash === 'survey') setCurrentTab('survey');
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSelectTab = (tab: 'survey' | 'dashboard' | 'guide') => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  const handleResponseSubmitted = (newResponse: SurveyResponse) => {
    setResponses(prev => [newResponse, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenQR={() => setIsQROpen(true)}
        responses={responses}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {currentTab === 'survey' && (
          <SurveyView
            onResponseSubmitted={handleResponseSubmitted}
            onGoToDashboard={() => handleSelectTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQR={() => setIsQROpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {currentTab === 'guide' && <FirebaseGuideView />}
      </main>

      {/* QR Code Presentation Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>ระบบประเมินความพึงพอใจการอบรม & Live Dashboard</span>
            <span>·</span>
            <span>เกณฑ์ Likert Scale 5 ระดับ</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectTab('guide')}
              className="hover:underline text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              คู่มือตั้งค่า Firebase
            </button>
            <span>·</span>
            <a
              href="/survey.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              เปิด survey.html
            </a>
            <span>·</span>
            <a
              href="/dashboard.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              เปิด dashboard.html
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
