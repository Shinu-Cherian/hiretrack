import React from 'react';

const HireTrackLogo = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Pure Typography Branding */}
      <span 
        className="font-black tracking-tighter text-white uppercase leading-none select-none transition-all duration-300 hover:tracking-normal"
        style={{ fontSize: `${size}px` }}
      >
        Hire<span className="text-[#FF6044]">Track</span>
      </span>
    </div>
  );
};

export default HireTrackLogo;
