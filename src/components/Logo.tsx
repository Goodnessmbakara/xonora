
import React from 'react';

const Logo = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-40 w-auto",
    md: "h-60 w-auto", 
    lg: "h-80 w-auto"
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center group transition-all duration-300 group-hover:scale-105`}>
        <img 
          src="/xonora_light_word.png" 
          alt="Xonora Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
