import React from 'react';
import { useAdmin } from '../providers/AdminProvider';
import { Sparkles } from 'lucide-react';

interface AIImageHoverProps {
  children: React.ReactNode;
  promptContext?: string;
  className?: string;
}

export function AIImageHover({ children, promptContext = '', className = '' }: AIImageHoverProps) {
  const { isAdmin, openAIGenerator } = useAdmin();

  if (!isAdmin) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div className={`group relative w-full h-full ${className}`}>
      {children}
      
      {/* Overlay that only appears on hover for Admins */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20 rounded-inherit">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openAIGenerator(promptContext);
          }}
          className="bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_30px_rgba(226,6,19,0.5)]"
        >
          <Sparkles size={16} /> Generar Imagen (AI)
        </button>
      </div>
    </div>
  );
}
