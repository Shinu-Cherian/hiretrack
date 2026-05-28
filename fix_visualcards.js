const fs = require('fs');

const oldFile = fs.readFileSync('C:/Users/User/Desktop/VisualCards_old_utf8.jsx', 'utf8');
const currentFile = fs.readFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', 'utf8');

const oldCodeStart = oldFile.indexOf('const charStrokes = {');
const oldCodeEnd = oldFile.indexOf('  return (', oldFile.indexOf('// Tic-Tac-Toe Line Lengths'));

let logicCode = oldFile.substring(oldCodeStart, oldCodeEnd);
// FIX THE DEPENDENCY ARRAY INFINITE LOOP BUG
logicCode = logicCode.replace('[step, titlePoints, naukriPoints, linkPoints]', '[titlePoints, naukriPoints, linkPoints]');

const returnCode = `  return (
    <div 
      className="w-full max-w-[550px] flex justify-center items-center p-4"
      style={{ perspective: "1200px" }}
    >
      <motion.div 
        initial={{ rotateY: -10, rotateX: 5, y: 0 }}
        animate={{ rotateY: [-10, -2, -10], rotateX: [5, 2, 5], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full aspect-[5/3] bg-[#3e2723] p-1 rounded-sm shadow-[20px_30px_60px_rgba(0,0,0,0.8)] border-[4px] border-[#2d1b15]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Outer Wooden Frame Styling */}
        <div className="absolute inset-0 border-[12px] border-[#4e342e] rounded-sm pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] z-20" />
        
        {/* Inner Chalkboard Surface */}
        <div className="relative w-full h-full bg-[#1a2e24] overflow-hidden rounded-sm border-[3px] border-black/60 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
          
          {/* Decorative Chalk Dust Texture Overlay */}
          <div className="absolute inset-0 bg-[#fff] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />

          {/* Chalk Ledge */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-3 bg-[#3e2723] border-t-2 border-[#5d4037] shadow-[0_-3px_10px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
          />

          {/* Eraser sweep overlay */}
          {isErasing && (
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent z-40 pointer-events-none"
            />
          )}

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

          {/* Floating Chalk Dust Particles */}
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
                  boxShadow: "0 0 5px var(--color-primary)"
                }}
                className="absolute rounded-full pointer-events-none"
              />
            ))}
          </div>

          {/* Chalkboard Drawing Core SVG */}
          <svg viewBox="0 0 500 300" className="w-full h-full relative z-10" preserveAspectRatio="none">
            
            {/* 1. Main Title Cursive Handwriting (y=50, drawn coordinate-by-coordinate) */}
            <path
              d={getPathD(titlePoints, step === 1 ? revealTitleIndex : (step > 1 ? titlePoints.length : -1))}
              fill="none"
              stroke="#ff6044"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_5px_rgba(255,96,68,0.5)]"
              opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
            />

            {/* 2. Tic-Tac-Toe Game (Top Right Area, animated line-by-line) */}
            <g opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
              {tictactoeProgress > 0 && (
                <line x1="385" y1="105" x2="385" y2="165" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v1Offset} className="drop-shadow-[0_0_2px_rgba(255,96,68,0.3)]" />
              )}
              {tictactoeProgress > 0.12 && (
                <line x1="415" y1="105" x2="415" y2="165" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v2Offset} className="drop-shadow-[0_0_2px_rgba(255,96,68,0.3)]" />
              )}
              {tictactoeProgress > 0.24 && (
                <line x1="360" y1="125" x2="440" y2="125" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h1Offset} className="drop-shadow-[0_0_2px_rgba(255,96,68,0.3)]" />
              )}
              {tictactoeProgress > 0.36 && (
                <line x1="360" y1="145" x2="440" y2="145" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h2Offset} className="drop-shadow-[0_0_2px_rgba(255,96,68,0.3)]" />
              )}
              {tictactoeProgress > 0.48 && (
                <line x1="365" y1="110" x2="375" y2="120" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1aOffset} />
              )}
              {tictactoeProgress > 0.56 && (
                <line x1="375" y1="110" x2="365" y2="120" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1bOffset} />
              )}
              {tictactoeProgress > 0.64 && (
                <path d="M 394,135 A 6,6 0 1,1 406,135 A 6,6 0 1,1 394,135" stroke="#ff6044" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="38" strokeDashoffset={o1Offset} />
              )}
              {tictactoeProgress > 0.78 && (
                <line x1="422" y1="150" x2="432" y2="160" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2aOffset} />
              )}
              {tictactoeProgress > 0.86 && (
                <line x1="432" y1="150" x2="422" y2="160" stroke="#ff6044" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2bOffset} />
              )}
            </g>

            {/* 3. Naukri Note (Bottom Left, y=195, drawn coordinate-by-coordinate) */}
            <path
              d={getPathD(naukriPoints, step === 5 ? revealNaukriIndex : (step > 5 ? naukriPoints.length : -1))}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
            />

            {/* 4. Paste Link Note (Bottom Right, y=240, drawn coordinate-by-coordinate) */}
            <path
              d={getPathD(linkPoints, step === 7 ? revealLinkIndex : (step > 7 ? linkPoints.length : -1))}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
`;

const currentStartIdx = currentFile.indexOf('const charStrokes = {');
const newFileContent = currentFile.substring(0, currentStartIdx) + logicCode + returnCode;
fs.writeFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', newFileContent, 'utf8');
console.log('Successfully repaired and updated VisualCards.jsx with fixed loop dependency');
