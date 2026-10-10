import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-[#82E3B1]/30';
        let bgClass = 'bg-[#191827]/95';
        let iconColor = 'text-[#82E3B1]';

        if (toast.type === 'spark') {
          Icon = Sparkles;
          borderClass = 'border-[#F58AC9]/40';
          iconColor = 'text-[#F58AC9]';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-[#A77BFF]/30';
          iconColor = 'text-[#A77BFF]';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-400/40';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl ${bgClass} ${borderClass} border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-wide">{toast.title}</h4>
              {toast.message && <p className="text-xs text-[#C8C0D8] mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#C8C0D8]/60 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
