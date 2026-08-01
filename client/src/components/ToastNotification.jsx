import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'info', message } = toast;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl animate-slide-up text-xs font-medium max-w-md bg-[#080d1a]/95 text-white border-white/15">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
        type === 'success' 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
          : type === 'error'
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : type === 'error' ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        )}
      </div>

      <span className="flex-1 leading-normal">{message}</span>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
