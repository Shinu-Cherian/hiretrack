import React from 'react';

const COMPANIES = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'Apple', domain: 'apple.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Spotify', domain: 'spotify.com' },
  { name: 'Uber', domain: 'uber.com' }
];

export default function CompanyOrbits() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden orbit-container">
      {/* Concentric circles */}
      <div className="absolute w-[calc(var(--orbit-radius)*2)] h-[calc(var(--orbit-radius)*2)] rounded-full border border-white/5"></div>
      <div className="absolute w-[calc(var(--orbit-radius)*2+100px)] h-[calc(var(--orbit-radius)*2+100px)] rounded-full border border-white/5 border-dashed opacity-50"></div>
      
      {COMPANIES.map((company, i) => {
        const angle = (i / COMPANIES.length) * 360;
        // Alternate between main orbit and slightly outer orbit
        const radiusOffset = i % 2 === 0 ? 0 : 50;
        
        return (
          <div
            key={company.name}
            className="absolute top-1/2 left-1/2 -ml-4 -mt-4"
            style={{
              animation: `orbit-${i} 40s linear infinite`,
            }}
          >
            <div className="w-8 h-8 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-700">
              <img src={`https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`} alt={company.name} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes orbit-${i} {
                0% { transform: rotate(${angle}deg) translateX(calc(var(--orbit-radius) + ${radiusOffset}px)) rotate(-${angle}deg); }
                100% { transform: rotate(${angle + 360}deg) translateX(calc(var(--orbit-radius) + ${radiusOffset}px)) rotate(-${angle + 360}deg); }
              }
            `}} />
          </div>
        )
      })}
    </div>
  );
}
