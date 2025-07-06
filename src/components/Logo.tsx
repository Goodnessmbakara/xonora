
import React from 'react';

const Logo = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-32",
    md: "h-12 w-48",
    lg: "h-16 w-64"
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 200 50" className="w-full h-full">
          {/* Bitcoin Symbol with Leaf */}
          <g transform="translate(10, 10)">
            {/* Bitcoin B */}
            <path
              d="M5 5 L5 35 M5 5 L18 5 Q23 5 23 10 Q23 15 18 15 L5 15 M5 15 L20 15 Q25 15 25 22.5 Q25 30 20 30 L5 30"
              stroke="url(#greenGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vertical lines */}
            <line x1="12" y1="2" x2="12" y2="8" stroke="url(#greenGradient)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="32" x2="12" y2="38" stroke="url(#greenGradient)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="2" x2="17" y2="8" stroke="url(#greenGradient)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="32" x2="17" y2="38" stroke="url(#greenGradient)" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Growing vine/leaf */}
            <path
              d="M30 25 Q35 20 40 25 Q35 30 30 25"
              fill="url(#greenGradient)"
              className="animate-float"
            />
            <path
              d="M35 15 Q40 10 45 15 Q40 20 35 15"
              fill="url(#greenGradient)"
              className="animate-float"
              style={{ animationDelay: '0.5s' }}
            />
          </g>
          
          {/* YieldBTC Text */}
          <text x="60" y="32" className="font-tech font-bold text-xl" fill="url(#textGradient)">
            YieldBTC
          </text>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#22A447" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
