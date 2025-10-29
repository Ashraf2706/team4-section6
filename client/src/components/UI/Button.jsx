import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-umbc-gold hover:bg-umbc-dark-gold text-black shadow-md hover:shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
    outline: 'bg-transparent border-2 border-umbc-gold text-umbc-gold hover:bg-umbc-gold hover:text-black',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;