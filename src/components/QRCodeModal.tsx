import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  surveyUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, surveyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error('Failed to render QR Code', err);
      });
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>PROJECTOR SCAN MODE</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          สแกนเพื่อทำแบบประเมินความพึงพอใจ
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-sm mx-auto">
          เปิดกล้องบนสมาร์ตโฟน หรือใช้ฟังก์ชันสแกนในแอป LINE เพื่อตอบแบบประเมินได้ทันที
        </p>

        {/* QR Code Canvas Frame */}
        <div className="my-6 p-4 sm:p-5 bg-white rounded-3xl inline-block shadow-xl border-4 border-indigo-500/30">
          <canvas ref={canvasRef} className="w-64 h-64 sm:w-72 sm:h-72 block mx-auto" />
        </div>

        {/* URL Box & Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 truncate flex-1 text-left font-mono">
              {surveyUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
            <a
              href={surveyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
            >
              <span>เปิดลิงก์ในแท็บใหม่</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
