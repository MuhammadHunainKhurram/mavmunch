'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-warm-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md card-modern p-6 shadow-medium animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-uta-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-uta-orange" />
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-2">
              Heads up!
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              While we try our best to keep this updated and accurate, event details may change or be incomplete. 
              Always double-check with the host organization before heading out!
            </p>
            <button
              onClick={handleClose}
              className="btn-primary w-full text-sm"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}