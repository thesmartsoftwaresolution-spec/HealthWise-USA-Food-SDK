import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const bg =
          toast.type === 'success'
            ? 'bg-[#E8F5EC] border-[#2D7D46] text-[#1A5C31]'
            : toast.type === 'error'
            ? 'bg-[#FDF2F2] border-[#C0392B] text-[#962D22]'
            : 'bg-[#F0F9FF] border-[#0284C7] text-[#075985]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 animate-slide-in ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2D7D46] shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C0392B] shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#0284C7] shrink-0" />}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md hover:bg-black/5 transition text-current shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
