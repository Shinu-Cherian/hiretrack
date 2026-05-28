const fs = require('fs');

const fileContent = fs.readFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', 'utf8');

// 1. Replace getPathD with the new smoothed spline version
const splineFuncCode = `
const spline = (pts) => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return \` M \${pts[0].x.toFixed(1)} \${pts[0].y.toFixed(1)}\`;
  if (pts.length === 2) return \` M \${pts[0].x.toFixed(1)} \${pts[0].y.toFixed(1)} L \${pts[1].x.toFixed(1)} \${pts[1].y.toFixed(1)}\`;
  
  let d = \` M \${pts[0].x.toFixed(1)} \${pts[0].y.toFixed(1)}\`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[0];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;
    
    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    d += \` C \${cp1x.toFixed(1)} \${cp1y.toFixed(1)} \${cp2x.toFixed(1)} \${cp2y.toFixed(1)} \${p2.x.toFixed(1)} \${p2.y.toFixed(1)}\`;
  }
  return d;
};

const getPathD = (points, activeIndex) => {
  if (activeIndex < 0) return "";
  let d = "";
  const count = Math.min(activeIndex, points.length - 1);
  
  let currentSegment = [];
  for (let i = 0; i <= count; i++) {
    const pt = points[i];
    if (pt.lift || i === 0) {
      if (currentSegment.length > 0) d += spline(currentSegment);
      currentSegment = [pt];
    } else {
      currentSegment.push(pt);
    }
  }
  if (currentSegment.length > 0) d += spline(currentSegment);
  return d;
};
`;

let newContent = fileContent.replace(/const getPathD = [\s\S]*?return d;\n};\n/, splineFuncCode);


// 2. Replace the 3D board return statement with a flat, transparent background container
const oldReturnStart = newContent.indexOf('  return (\n    <div \n      className="w-full max-w-[550px] flex justify-center items-center p-4"\n      style={{ perspective: "1200px" }}\n    >');
if (oldReturnStart === -1) {
    console.error("Could not find return block");
    process.exit(1);
}

const newReturnCode = `  return (
    <div className="relative w-full max-w-[600px] h-[340px] flex justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Decorative Particles (Optional, you can keep them for magic effect) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: \`\${(p.x / 500) * 100}%\`,
                top: \`\${(p.y / 300) * 100}%\`,
                width: \`\${p.size}px\`,
                height: \`\${p.size}px\`,
                opacity: p.alpha,
                backgroundColor: "var(--color-primary)",
                boxShadow: "0 0 8px var(--color-primary)"
              }}
              className="absolute rounded-full pointer-events-none"
            />
          ))}
        </div>

        {/* Custom Chalk Position & Pencil Cursor */}
        {chalk.opacity > 0 && (
          <div
            style={{
              left: \`\${(chalk.x / 500) * 100}%\`,
              top: \`\${(chalk.y / 300) * 100}%\`,
              opacity: chalk.opacity,
              transition: "opacity 0.2s ease-in-out"
            }}
            className="absolute z-30 text-primary pointer-events-none transform -translate-x-[2px] -translate-y-[24px]"
          >
            <Pencil size={24} className="transform -scale-x-100 drop-shadow-[0_0_8px_var(--color-primary)]" />
          </div>
        )}

        {/* Chalkboard Drawing Core SVG */}
        <svg viewBox="0 0 500 300" className="w-full h-full relative z-10" preserveAspectRatio="none">
          
          {/* 1. Main Title Cursive Handwriting (y=50, drawn coordinate-by-coordinate) */}
          <path
            d={getPathD(titlePoints, step === 1 ? revealTitleIndex : (step > 1 ? titlePoints.length : -1))}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(196,252,112,0.4)]"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          />

          {/* 2. Tic-Tac-Toe Game (Top Right Area, animated line-by-line) */}
          <g opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            {tictactoeProgress > 0 && (
              <line x1="385" y1="105" x2="385" y2="165" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v1Offset} className="drop-shadow-[0_0_5px_rgba(196,252,112,0.3)]" />
            )}
            {tictactoeProgress > 0.12 && (
              <line x1="415" y1="105" x2="415" y2="165" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v2Offset} className="drop-shadow-[0_0_5px_rgba(196,252,112,0.3)]" />
            )}
            {tictactoeProgress > 0.24 && (
              <line x1="360" y1="125" x2="440" y2="125" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h1Offset} className="drop-shadow-[0_0_5px_rgba(196,252,112,0.3)]" />
            )}
            {tictactoeProgress > 0.36 && (
              <line x1="360" y1="145" x2="440" y2="145" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h2Offset} className="drop-shadow-[0_0_5px_rgba(196,252,112,0.3)]" />
            )}
            {tictactoeProgress > 0.48 && (
              <line x1="365" y1="110" x2="375" y2="120" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1aOffset} />
            )}
            {tictactoeProgress > 0.56 && (
              <line x1="375" y1="110" x2="365" y2="120" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1bOffset} />
            )}
            {tictactoeProgress > 0.64 && (
              <path d="M 394,135 A 6,6 0 1,1 406,135 A 6,6 0 1,1 394,135" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="38" strokeDashoffset={o1Offset} />
            )}
            {tictactoeProgress > 0.78 && (
              <line x1="422" y1="150" x2="432" y2="160" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2aOffset} />
            )}
            {tictactoeProgress > 0.86 && (
              <line x1="432" y1="150" x2="422" y2="160" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2bOffset} />
            )}
          </g>

          {/* 3. Naukri Note (Bottom Left, y=195, drawn coordinate-by-coordinate) */}
          <path
            d={getPathD(naukriPoints, step === 5 ? revealNaukriIndex : (step > 5 ? naukriPoints.length : -1))}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_5px_rgba(196,252,112,0.4)]"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          />

          {/* 4. Paste Link Note (Bottom Right, y=240, drawn coordinate-by-coordinate) */}
          <path
            d={getPathD(linkPoints, step === 7 ? revealLinkIndex : (step > 7 ? linkPoints.length : -1))}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_5px_rgba(196,252,112,0.4)]"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          />
        </svg>
      </div>
    </div>
  );
};
`;

newContent = newContent.substring(0, oldReturnStart) + newReturnCode;
fs.writeFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', newContent, 'utf8');
console.log("Successfully smoothed fonts and removed chalkboard background.");
