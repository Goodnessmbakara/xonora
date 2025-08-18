
import React from 'react';

const Logo = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-32",
    md: "h-12 w-48",
    lg: "h-16 w-64"
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center group`}>
        <svg viewBox="0 0 200 50" className="w-full h-full transition-all duration-300 group-hover:scale-105">
          {/* Xonora Logo - Geometric X with Growth Circles */}
          <g transform="translate(10, 10)">
            {/* Main X Shape */}
            <path
              d="M8 8 L22 22 M22 8 L8 22"
              stroke="hsl(var(--xonora-primary-500))"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 group-hover:stroke-[hsl(var(--xonora-primary-400))]"
            />
            
            {/* Growth Circle 1 - Top Right */}
            <circle
              cx="25"
              cy="5"
              r="3"
              fill="hsl(var(--xonora-primary-400))"
              className="animate-float opacity-80"
              style={{ animationDelay: '0s' }}
            />
            
            {/* Growth Circle 2 - Bottom Left */}
            <circle
              cx="5"
              cy="25"
              r="2.5"
              fill="hsl(var(--xonora-primary-600))"
              className="animate-float opacity-90"
              style={{ animationDelay: '0.3s' }}
            />
            
            {/* Growth Circle 3 - Center Right */}
            <circle
              cx="28"
              cy="18"
              r="2"
              fill="hsl(var(--xonora-primary-400))"
              className="animate-float opacity-70"
              style={{ animationDelay: '0.6s' }}
            />
            
            {/* Subtle Glow Effect */}
            <circle
              cx="15"
              cy="15"
              r="12"
              fill="none"
              stroke="hsl(var(--xonora-primary-500) / 0.1)"
              strokeWidth="1"
              className="animate-pulse"
            />
          </g>
          
          {/* Xonora Text */}
          <text 
            x="50" 
            y="32" 
            className="font-tech font-bold text-xl transition-all duration-300 group-hover:fill-[hsl(var(--xonora-primary-400))]" 
            fill="hsl(var(--xonora-primary-500))"
          >
            Xonora
          </text>
          
          {/* Subtle Text Glow */}
          <text 
            x="50" 
            y="32" 
            className="font-tech font-bold text-xl opacity-20 blur-sm" 
            fill="hsl(var(--xonora-primary-500))"
          >
            Xonora
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
