
import React from 'react';

interface BrutalistButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const BrutalistButton: React.FC<BrutalistButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    primary: 'bg-[#FFFF00] hover:bg-[#E6E600]',
    secondary: 'bg-white hover:bg-gray-100',
    danger: 'bg-[#FF3333] text-white hover:bg-[#CC0000]',
    success: 'bg-[#00FF00] hover:bg-[#00CC00]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        brutalist-border brutalist-shadow-sm brutalist-shadow-hover
        transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
        px-6 py-3 font-bold uppercase tracking-widest text-black
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default BrutalistButton;
