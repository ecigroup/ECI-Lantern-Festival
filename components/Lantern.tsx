
import React from 'react';

interface LanternProps {
  className?: string;
  delay?: number;
}

const Lantern: React.FC<LanternProps> = ({ className = '', delay = 0 }) => {
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{
        animation: `float 4s ease-in-out infinite alternate ${delay}s`,
      }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
      {/* Lantern Body */}
      <div className="w-12 h-16 bg-red-600 rounded-lg relative shadow-lg flex items-center justify-center border-2 border-yellow-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-4 bg-yellow-500"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-1 h-6 bg-yellow-500"></div>
        {/* Tassels */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-6 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>
        {/* Characters or Decoration */}
        <div className="text-yellow-400 font-bold text-xs select-none">ECI</div>
      </div>
    </div>
  );
};

export default Lantern;
