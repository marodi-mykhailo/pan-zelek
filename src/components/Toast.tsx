import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-right">
      <div
        className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <Icon size={20} />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded p-1 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
