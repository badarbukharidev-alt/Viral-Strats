import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-md hover:shadow-lg",
    secondary: "border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500",
    whatsapp: "border-transparent text-white bg-[#25D366] hover:bg-[#128C7E] focus:ring-green-500 shadow-md",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};