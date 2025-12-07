import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import React from 'react';

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      progressBg: 'bg-green-400'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      progressBg: 'bg-red-400'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
      progressBg: 'bg-yellow-400'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
      progressBg: 'bg-blue-400'
    }
  };

  const style = typeStyles[type];

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={`w-5 h-5 ${style.icon}`} />;
      case 'error':
        return <AlertCircle className={`w-5 h-5 ${style.icon}`} />;
      case 'warning':
        return <AlertCircle className={`w-5 h-5 ${style.icon}`} />;
      default:
        return <Info className={`w-5 h-5 ${style.icon}`} />;
    }
  };

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.text}
        border rounded-lg shadow-lg p-4 flex items-start gap-3 
        min-w-80 max-w-md animate-slide-in
      `}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`text-lg opacity-60 hover:opacity-100 transition flex-shrink-0`}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 rounded-b-lg bg-opacity-30" style={{
        width: '100%',
        background: 'transparent'
      }}>
        <div
          className={`h-full ${style.progressBg} rounded-b-lg animate-shrink-width`}
          style={{
            animation: `shrink-width ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
