import React from 'react';

export const SasoriLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img loading="lazy" 
    src="/Logo.png" 
    alt="SasoriLabs Logo"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);
