import React from 'react';

const HireTrackLogo = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top Left Block */}
      <rect x="4" y="4" width="6" height="6" fill="currentColor" />
      
      {/* Top Right Block */}
      <rect x="14" y="4" width="6" height="6" fill="currentColor" />
      
      {/* Middle Connecting Bar */}
      <rect x="4" y="10" width="16" height="4" fill="currentColor" />
      
      {/* Bottom Left Block */}
      <rect x="4" y="14" width="6" height="6" fill="currentColor" />
      
      {/* Bottom Right Block */}
      <rect x="14" y="14" width="6" height="6" fill="currentColor" />
    </svg>
  );
};

export default HireTrackLogo;
