import React from 'react';

interface BrandButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
}

const BrandButton: React.FC<BrandButtonProps> = ({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-lg transition-all duration-300 font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xonora-amber-400/30';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 text-xonora-dark hover:scale-105 hover:shadow-lg hover:shadow-xonora-amber-400/25',
    outline: 'border-2 border-xonora-amber-400 text-xonora-amber-400 hover:bg-xonora-amber-400 hover:text-xonora-dark'
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BrandButton;
