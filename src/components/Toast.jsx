import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          <Sparkles size={18} color="var(--color-terracotta-400)" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
