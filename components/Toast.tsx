
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold transform transition-all duration-300";
  
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
};

export default Toast;
