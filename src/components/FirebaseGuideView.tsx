import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileCode, 
  CheckCircle2, 
  Flame, 
  Globe, 
  ShieldCheck, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { STANDALONE_SURVEY_HTML, STANDALONE_DASHBOARD_HTML } from '../utils/standaloneSource';

export const FirebaseGuideView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'survey' | 'dashboard'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const handleCopy = (text: string, type: 'survey' | 'dashboard' | 'rules') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'survey') {
        setCopiedSurvey(true);
        setTimeout(() => setCopiedSurvey(false), 2500);
      } else if (type === 'dashboard') {
        setCopiedDashboard(true);
        setTimeout(() => setCopiedDashboard(false), 2500);
      } else {
        setCopiedRules(true);
        setTimeout(() => setCopiedRules(false), 2500);
      }
    });
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const firebaseRulesCode = `{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"]
    }
  }
}`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Firebase Realtime Database (Free Tier / Spark Plan)</span>
          </span>
          <span className="text-xs text-indigo-200">· ไม่ต้องล็อกอิน · ไม่เก็บชื่อผู้ตอบ · ฟรี 100%</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase ทีละขั้นตอน
        </h1>
        <p className="text-sm sm:text-base text-indigo-100/90 mt-2 max-w-3xl leading-relaxed">
          ตามคำขอของท่าน เราได้จัดเตรียมโค้ดระบบประเมินผลความพึงพอใจแยกเป็น 2 ไฟล์อิสระ (HTML + JavaScript)
          พร้อมคำอธิบายการตั้งค่า Firebase Realtime Database และการนำขึ้นโฮสติ้งฟรีเพื่อให้ใช้งานได้จริงทันที
        </p>

        {/* Quick File Action Bar */}
        <div className="mt-6 pt-6 border-t border-indigo-800/60 flex flex-wrap gap-3">
          <button
            onClick={() => handleDownloadFile('survey.html', STANDALONE_SURVEY_HTML)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => handleDownloadFile('dashboard.html', STANDALONE_DASHBOARD_HTML)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-indigo-700/50 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด dashboard.html (หน้าจอ)</span>
          </button>

          <a
            href="/survey.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl text-xs font-medium transition-all"
          >
            <span>ทดลองเปิด /survey.html สด</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="/dashboard.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl text-xs font-medium transition-all"
          >
            <span>ทดลองเปิด /dashboard.html สด</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Step by Step Firebase Setup Guide */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              1
            </span>
            <span>วิธีสร้าง Firebase และตั้งค่า Realtime Database (ทำครั้งเดียว 3 นาที)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ใช้แพ็กเกจ Spark Plan (ฟรี 100% ไม่ต้องกรอกบัตรเครดิต รองรับผู้ตอบพร้อมกันได้หลายร้อยคน)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1.1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs flex items-center justify-center">1</span>
              <span>สร้าง Firebase Project</span>
            </div>
            <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>ไปที่เว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium">console.firebase.google.com</a> แล้วล็อกอินด้วย Google Account</li>
              <li>คลิกปุ่ม <strong>"Add project"</strong> (สร้างโปรเจกต์)</li>
              <li>ตั้งชื่อโปรเจกต์ เช่น <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">workshop-evaluation</code></li>
              <li>ในขั้นตอน Google Analytics สามารถเลือก <strong>"Disable"</strong> (ปิดไว้) แล้วกด <strong>Create Project</strong></li>
            </ol>
          </div>

          {/* Step 1.2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs flex items-center justify-center">2</span>
              <span>เปิดใช้งาน Realtime Database</span>
            </div>
            <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>ที่เมนูด้านซ้าย เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong></li>
              <li>กดปุ่ม <strong>"Create Database"</strong></li>
              <li>เลือก Location: แนะนำ <strong>Singapore (asia-southeast1)</strong> เพื่อความเร็วสูงสุดในไทย หรือ United States</li>
              <li>เลือก <strong>"Start in test mode"</strong> แล้วกด Enable</li>
            </ol>
          </div>

          {/* Step 1.3: Security Rules */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs flex items-center justify-center">3</span>
                <span>ตั้งค่า Security Rules (เพื่อให้ผู้ตอบส่งคะแนนได้โดยไม่ต้องล็อกอิน)</span>
              </div>
              <button
                onClick={() => handleCopy(firebaseRulesCode, 'rules')}
                className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'คัดลอก Rules แล้ว' : 'คัดลอก Rules'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ไปที่แท็บ <strong>Rules</strong> ในหน้า Realtime Database แล้วแทนที่โค้ดด้วยด้านล่างนี้ จากนั้นกด <strong>Publish</strong>:
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
              {firebaseRulesCode}
            </pre>
          </div>

          {/* Step 1.4: Config Copy */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs flex items-center justify-center">4</span>
              <span>นำ Firebase Config มาใส่ในโค้ดไฟล์ survey.html และ dashboard.html</span>
            </div>
            <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>ไปที่ไอคอนฟันเฟือง ⚙️ <strong>Project Settings</strong> (บนซ้าย)</li>
              <li>เลื่อนลงมาด้านล่างที่ส่วน <strong>"Your apps"</strong> แล้วคลิกไอคอนเว็บ <code>&lt;/&gt;</code> (Web app)</li>
              <li>ตั้งชื่อแอป เช่น <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">workshop-web</code> แล้วกด Register app</li>
              <li>จะพบโค้ดส่วน <code className="font-mono text-xs font-semibold">firebaseConfig = &#123; ... &#125;</code> ให้คัดลอกค่านั้นมาวางแทนที่ในทั้ง 2 ไฟล์ที่ดาวน์โหลดไป</li>
            </ol>
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-xs text-indigo-800 dark:text-indigo-300">
              💡 <strong>ข้อสังเกต:</strong> หากคุณยังไม่ได้ใส่ Firebase Config โค้ดของระบบยังมีฟังก์ชัน fallback ทำงานผ่าน LocalStorage และ BroadcastChannel อัตโนมัติ ทำให้ทดสอบเปิดในเบราว์เซอร์ได้ทันทีโดยไม่ error!
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Deployment Guide */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              2
            </span>
            <span>วิธี Deploy ขึ้นเว็บไซต์จริง ฟรี 100% (เลือกได้ 3 วิธี)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            เนื่องจากเป็นไฟล์ HTML ธรรมดา คุณสามารถนำขึ้นเซิร์ฟเวอร์ใดก็ได้ในโลกโดยไม่มีค่าใช้จ่าย
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Method A: Vercel / Netlify Drag & Drop */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">วิธีที่ 1: Netlify Drop / Vercel (เร็วที่สุด 10 วินาที)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ไม่ต้องลงโปรแกรม ลากโฟลเดอร์เสร็จทันที</p>
              
              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside mt-3">
                <li>สร้างโฟลเดอร์ เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">my-workshop</code></li>
                <li>ใส่ไฟล์ <code className="font-mono">survey.html</code> และ <code className="font-mono">dashboard.html</code> ลงไป</li>
                <li>เปิดเว็บ <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-indigo-600 underline">app.netlify.com/drop</a></li>
                <li>ลากโฟลเดอร์ไปวาง จะได้ลิงก์เว็บพร้อมใช้งานทันที เช่น <code className="text-indigo-500 font-mono">https://...netlify.app/survey.html</code></li>
              </ol>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ แนะนำสำหรับคนที่ต้องการความสะดวกรวดเร็ว
            </div>
          </div>

          {/* Method B: GitHub Pages */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">วิธีที่ 2: GitHub Pages (ฟรีถาวร)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">มาตรฐานสากล เชื่อถือได้สูง</p>
              
              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside mt-3">
                <li>สร้าง Repository ใหม่บน GitHub เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">workshop-form</code></li>
                <li>อัปโหลดไฟล์ทั้ง 2 ไฟล์ขึ้นไป (เปลี่ยนชื่อ survey.html เป็น <code className="font-mono">index.html</code> เพื่อให้เป็นหน้าแรก)</li>
                <li>ไปที่ <strong>Settings &gt; Pages</strong></li>
                <li>เลือก Branch: <strong>main</strong> แล้วกด Save</li>
                <li>จะได้ URL เช่น <code className="text-indigo-500 font-mono">https://username.github.io/workshop-form</code></li>
              </ol>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              ✓ เหมาะสำหรับใช้ซ้ำหลายงานอบรม
            </div>
          </div>

          {/* Method C: Firebase Hosting */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">วิธีที่ 3: Firebase Hosting</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">รวมอยู่ในโปรเจกต์ Firebase เดียวกัน</p>
              
              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside mt-3">
                <li>เปิด Terminal แล้วพิมพ์ <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">npm install -g firebase-tools</code></li>
                <li>พิมพ์ <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">firebase login</code></li>
                <li>พิมพ์ <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">firebase init hosting</code></li>
                <li>เลือกโปรเจกต์ที่สร้างไว้</li>
                <li>พิมพ์ <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">firebase deploy</code></li>
              </ol>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              ✓ เชื่อมต่อฐานข้อมูลโดยตรง ไม่มีปัญหา CORS
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer & Download Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                3
              </span>
              <span>ดูและคัดลอกซอร์สโค้ด (Source Code Viewer)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              เขียนด้วย HTML5 + JavaScript + Tailwind CSS CDN + Firebase v9 Compat พร้อมเปิดใช้งานได้ทันที
            </p>
          </div>

          {/* Toggle between 2 files */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveCodeTab('survey')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCodeTab === 'survey'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📄 ไฟล์ 1: survey.html (หน้าตอบ)
            </button>
            <button
              onClick={() => setActiveCodeTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCodeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📊 ไฟล์ 2: dashboard.html (หน้าจอ)
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
          {/* Code Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>{activeCodeTab === 'survey' ? 'public/survey.html' : 'public/dashboard.html'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    activeCodeTab === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML,
                    activeCodeTab
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
              >
                {(activeCodeTab === 'survey' ? copiedSurvey : copiedDashboard) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>คัดลอกโค้ดสำเร็จ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกโค้ดทั้งหมด</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  handleDownloadFile(
                    activeCodeTab === 'survey' ? 'survey.html' : 'dashboard.html',
                    activeCodeTab === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML
                  )
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
            </div>
          </div>

          {/* Code Content */}
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed selection:bg-indigo-500 selection:text-white">
            {activeCodeTab === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML}
          </pre>
        </div>
      </div>
    </div>
  );
};
