import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Send, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { SURVEY_QUESTIONS, RATING_SCALE_INFO } from '../constants';
import { saveResponse, hasDeviceSubmitted, clearDeviceSubmittedFlag } from '../utils/storage';
import { SurveyResponse } from '../types';

interface SurveyViewProps {
  onResponseSubmitted?: (newResponse: SurveyResponse) => void;
  onGoToDashboard?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  onResponseSubmitted,
  onGoToDashboard,
}) => {
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<number[]>([]);
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);

  useEffect(() => {
    setIsSubmitted(hasDeviceSubmitted());
  }, []);

  const handleSelectScore = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    if (validationErrors.includes(questionId)) {
      setValidationErrors(prev => prev.filter(id => id !== questionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check which questions are unanswered
    const missing: number[] = [];
    SURVEY_QUESTIONS.forEach(q => {
      if (!answers[q.id] || answers[q.id] < 1) {
        missing.push(q.id);
      }
    });

    if (missing.length > 0) {
      setValidationErrors(missing);
      const firstMissing = document.getElementById(`question-card-${missing[0]}`);
      firstMissing?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const scoresArray: [number, number, number, number, number] = [
        answers[1],
        answers[2],
        answers[3],
        answers[4],
        answers[5],
      ];

      const created = saveResponse({
        scores: scoresArray,
        suggestion: suggestion.trim() || undefined,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }

      setIsSubmitted(true);
      setIsSubmitting(false);

      if (onResponseSubmitted) {
        onResponseSubmitted(created);
      }
    }, 350);
  };

  const handleResetForTesting = () => {
    clearDeviceSubmittedFlag();
    setIsSubmitted(false);
    setAnswers({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    setSuggestion('');
    setValidationErrors([]);
  };

  return (
    <div className="py-6 px-4 sm:px-6">
      
      {/* Viewport display switcher (For desktop testing convenience) */}
      <div className="max-w-xl mx-auto mb-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>มุมมอง:</span>
          <button
            type="button"
            onClick={() => setShowPhoneFrame(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              showPhoneFrame ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>กรอบมือถือ (Mobile Preview)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPhoneFrame(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              !showPhoneFrame ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>เต็มความกว้าง</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          * ไม่บันทึกชื่อผู้ตอบ เพื่อความเป็นส่วนตัว
        </span>
      </div>

      {/* Main Container / Mobile Screen Simulation Frame */}
      <div
        className={`mx-auto transition-all duration-300 ${
          showPhoneFrame
            ? 'max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-slate-300 dark:border-slate-700 overflow-hidden min-h-[640px]'
            : 'max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6'
        }`}
      >
        {/* Mobile Header Banner */}
        <div className="bg-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">
              <span>แบบประเมินผู้เข้าอบรม</span>
              <span>·</span>
              <span>5 คำถาม</span>
              <span>·</span>
              <span>ใช้เวลา 1 นาที</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              แบบประเมินความพึงพอใจการอบรม
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
              ความคิดเห็นของท่านมีคุณค่ายิ่งในการพัฒนาหลักสูตรและการจัดอบรมในครั้งต่อไป
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6">
          {isSubmitted ? (
            /* Already Submitted Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  ส่งแบบประเมินเรียบร้อยแล้ว
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  ขอขอบพระคุณท่านที่สละเวลาให้ข้อเสนอแนะ คะแนนของท่านได้ถูกส่งขึ้นแสดงบนหน้าจอ Dashboard ของผู้จัดอบรมแบบเรียลไทม์แล้ว
                </p>
              </div>

              <div className="pt-6 space-y-3">
                {onGoToDashboard && (
                  <button
                    type="button"
                    onClick={onGoToDashboard}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    ดูผลคะแนนรวมบน Live Dashboard
                  </button>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleResetForTesting}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ต้องการทดสอบทำแบบประเมินใหม่อีกครั้ง</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    (ปุ่มนี้สำหรับผู้ทดสอบระบบ: ช่วยปลดล็อกการจำลองเครื่องเพื่อตอบซ้ำได้)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Survey Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Scale Legend Explanation for Quick Reference */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>เกณฑ์การให้คะแนน (1 - 5 ระดับ)</span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-center pt-1 text-[11px]">
                  <div><span className="font-bold text-rose-600">1</span>: น้อยสุด</div>
                  <div><span className="font-bold text-amber-600">2</span>: น้อย</div>
                  <div><span className="font-bold text-amber-500">3</span>: ปานกลาง</div>
                  <div><span className="font-bold text-emerald-600">4</span>: มาก</div>
                  <div><span className="font-bold text-indigo-600">5</span>: มากที่สุด</div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {SURVEY_QUESTIONS.map((q, index) => {
                  const currentScore = answers[q.id];
                  const hasError = validationErrors.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      id={`question-card-${q.id}`}
                      className={`p-4 rounded-2xl transition-all border ${
                        hasError
                          ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                          : currentScore > 0
                          ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/10 dark:bg-indigo-950/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {q.shortLabel} · {q.category}
                          </div>
                          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                            {q.title}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {q.description}
                          </p>
                        </div>

                        {currentScore > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md shrink-0">
                            {currentScore} / 5
                          </span>
                        )}
                      </div>

                      {hasError && (
                        <div className="text-xs text-rose-600 dark:text-rose-400 font-medium my-2">
                          * โปรดเลือกระดับคะแนนสำหรับข้อนี้
                        </div>
                      )}

                      {/* 1-5 Tactile Rating Buttons (Touch target >= 48px) */}
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2">
                        {RATING_SCALE_INFO.map(scale => {
                          const isSelected = currentScore === scale.value;

                          return (
                            <button
                              key={scale.value}
                              type="button"
                              onClick={() => handleSelectScore(q.id, scale.value)}
                              className={`min-h-[52px] sm:min-h-[56px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 scale-[1.03] ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95'
                              }`}
                            >
                              <span className="text-lg sm:text-xl font-bold leading-none">
                                {scale.value}
                              </span>
                              <span
                                className={`text-[9px] sm:text-[10px] mt-1 leading-tight tracking-tight whitespace-nowrap ${
                                  isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {scale.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions Textarea */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="suggestion-field" className="text-sm font-bold text-slate-900 dark:text-white">
                    ข้อเสนอแนะเพิ่มเติม / สิ่งที่ประทับใจ
                  </label>
                  <span className="text-[11px] text-slate-400">ไม่บังคับ</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                  ท่านมีข้อคิดเห็น คำแนะนำ หรือหัวข้อที่ต้องการเรียนรู้เพิ่มเติมในครั้งต่อไปหรือไม่?
                </p>
                <textarea
                  id="suggestion-field"
                  rows={3}
                  maxLength={500}
                  value={suggestion}
                  onChange={e => setSuggestion(e.target.value)}
                  placeholder="พิมพ์ความคิดเห็นของท่านที่นี่ (เช่น วิทยากรยกตัวอย่างดีมาก, อยากให้เพิ่มเวลา Workshop...)"
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <div className="flex justify-end mt-1 text-[11px] text-slate-400">
                  {suggestion.length} / 500 ตัวอักษร
                </div>
              </div>

              {/* Submit CTA Bar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/25 text-base flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมินความพึงพอใจ'}</span>
                </button>
                <p className="text-center text-xs text-slate-400 mt-2.5">
                  ผลการประเมินจะถูกส่งตรงไปยังจอแสดงผลของผู้จัดแบบเรียลไทม์
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
