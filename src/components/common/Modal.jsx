import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white p-3 rounded-xl font-bold mt-4 min-h-[44px] active:scale-95 transition-transform"
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
}
