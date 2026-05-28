const fs = require('fs');

const fileContent = fs.readFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', 'utf8');

const chalkboardStart = fileContent.indexOf("export const ChalkboardShowcase = () => {");
if (chalkboardStart === -1) {
    console.error("Could not find ChalkboardShowcase in file");
    process.exit(1);
}

const beforeCode = fileContent.substring(0, chalkboardStart);

const newChalkboardCode = `export const ChalkboardShowcase = () => {
  const [chalk, setChalk] = useState({ x: 450, y: 200, opacity: 0 });
  const [step, setStep] = useState(0);
  const [revealWidths, setRevealWidths] = useState({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0 });
  const [tictactoeProgress, setTictactoeProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    let active = true;
    let start = Date.now();
    let prevChalkX = 450;
    let prevChalkY = 200;

    const animate = () => {
      if (!active) return;
      const now = Date.now();
      const elapsed = now - start;

      const totalCycle = 24500;
      const cycleTime = elapsed % totalCycle;

      let currentX = 450;
      let currentY = 200;
      let currentOpacity = 1;
      
      // Simulate up/down handwriting movement
      const handwritingBounce = Math.sin(now / 30) * 8 + Math.cos(now / 20) * 4;

      if (cycleTime < 1500) {
        // Move to Title
        const pct = cycleTime / 1500;
        currentX = 450 - pct * (450 - 40);
        currentY = 200 - pct * (200 - 50);
        currentOpacity = 1;
        setStep(0);
        setRevealWidths({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0 });
        setTictactoeProgress(0);
        setIsErasing(false);
      } 
      else if (cycleTime < 3500) {
        // Draw Title
        const pct = (cycleTime - 1500) / 2000;
        const totalWidth = 240; 
        const currentW = pct * totalWidth;
        
        currentX = 40 + currentW;
        currentY = 40 + handwritingBounce;
        currentOpacity = 1;
        
        setStep(1);
        setRevealWidths({ title: currentW, b1: 0, b2: 0, b3: 0, b4: 0 });
      } 
      else if (cycleTime < 4500) {
        // Move to TicTacToe
        const pct = (cycleTime - 3500) / 1000;
        currentX = 280 + pct * (385 - 280);
        currentY = 40 + pct * (105 - 40);
        currentOpacity = 0; // lift pencil
        setStep(2);
        setRevealWidths({ title: 240, b1: 0, b2: 0, b3: 0, b4: 0 });
      } 
      else if (cycleTime < 10500) {
        // Draw TicTacToe
        const subElapsed = cycleTime - 4500;
        const pct = subElapsed / 6000;
        setStep(3);
        setTictactoeProgress(pct);
        setRevealWidths({ title: 240, b1: 0, b2: 0, b3: 0, b4: 0 });
        currentOpacity = 1;

        if (pct < 0.12) {
          const t = pct / 0.12;
          currentX = 385; currentY = 105 + t * 60;
        } else if (pct < 0.24) {
          const t = (pct - 0.12) / 0.12;
          currentX = 415; currentY = 105 + t * 60;
        } else if (pct < 0.36) {
          const t = (pct - 0.24) / 0.12;
          currentX = 360 + t * 80; currentY = 125;
        } else if (pct < 0.48) {
          const t = (pct - 0.36) / 0.12;
          currentX = 360 + t * 80; currentY = 145;
        } else if (pct < 0.56) {
          const t = (pct - 0.48) / 0.08;
          currentX = 365 + t * 10; currentY = 110 + t * 10;
        } else if (pct < 0.64) {
          const t = (pct - 0.56) / 0.08;
          currentX = 375 - t * 10; currentY = 110 + t * 10;
        } else if (pct < 0.78) {
          const t = (pct - 0.64) / 0.14;
          const angle = t * Math.PI * 2;
          currentX = 400 + Math.cos(angle) * 6; currentY = 135 + Math.sin(angle) * 6;
        } else if (pct < 0.86) {
          const t = (pct - 0.78) / 0.08;
          currentX = 422 + t * 10; currentY = 150 + t * 10;
        } else if (pct < 0.94) {
          const t = (pct - 0.86) / 0.08;
          currentX = 432 - t * 10; currentY = 150 + t * 10;
        } else {
          currentX = 422; currentY = 160;
          currentOpacity = 0;
        }
      } 
      else if (cycleTime < 11500) {
        // Move to B1
        const pct = (cycleTime - 10500) / 1000;
        currentX = 422 + pct * (40 - 422);
        currentY = 160 + pct * (120 - 160);
        currentOpacity = 0; // lift
        setStep(4);
      } 
      else if (cycleTime < 13500) {
        // Draw B1
        const pct = (cycleTime - 11500) / 2000;
        const totalWidth = 320;
        const currentW = pct * totalWidth;
        currentX = 40 + currentW;
        currentY = 110 + handwritingBounce;
        currentOpacity = 1;
        setStep(5);
        setRevealWidths({ title: 240, b1: currentW, b2: 0, b3: 0, b4: 0 });
      } 
      else if (cycleTime < 14500) {
        // Move to B2
        const pct = (cycleTime - 13500) / 1000;
        currentX = 360 + pct * (40 - 360);
        currentY = 110 + pct * (170 - 110);
        currentOpacity = 0;
        setStep(6);
        setRevealWidths({ title: 240, b1: 320, b2: 0, b3: 0, b4: 0 });
      } 
      else if (cycleTime < 16500) {
        // Draw B2
        const pct = (cycleTime - 14500) / 2000;
        const totalWidth = 320;
        const currentW = pct * totalWidth;
        currentX = 40 + currentW;
        currentY = 160 + handwritingBounce;
        currentOpacity = 1;
        setStep(7);
        setRevealWidths({ title: 240, b1: 320, b2: currentW, b3: 0, b4: 0 });
      } 
      else if (cycleTime < 17500) {
        // Move to B3
        const pct = (cycleTime - 16500) / 1000;
        currentX = 360 + pct * (40 - 360);
        currentY = 160 + pct * (220 - 160);
        currentOpacity = 0;
        setStep(8);
        setRevealWidths({ title: 240, b1: 320, b2: 320, b3: 0, b4: 0 });
      }
      else if (cycleTime < 19500) {
        // Draw B3
        const pct = (cycleTime - 17500) / 2000;
        const totalWidth = 320;
        const currentW = pct * totalWidth;
        currentX = 40 + currentW;
        currentY = 210 + handwritingBounce;
        currentOpacity = 1;
        setStep(9);
        setRevealWidths({ title: 240, b1: 320, b2: 320, b3: currentW, b4: 0 });
      }
      else if (cycleTime < 20500) {
        // Move to B4
        const pct = (cycleTime - 19500) / 1000;
        currentX = 360 + pct * (40 - 360);
        currentY = 210 + pct * (270 - 210);
        currentOpacity = 0;
        setStep(10);
        setRevealWidths({ title: 240, b1: 320, b2: 320, b3: 320, b4: 0 });
      }
      else if (cycleTime < 22500) {
        // Draw B4
        const pct = (cycleTime - 20500) / 2000;
        const totalWidth = 320;
        const currentW = pct * totalWidth;
        currentX = 40 + currentW;
        currentY = 260 + handwritingBounce;
        currentOpacity = 1;
        setStep(11);
        setRevealWidths({ title: 240, b1: 320, b2: 320, b3: 320, b4: currentW });
      }
      else {
        // Erase Sweep
        const pct = (cycleTime - 22500) / 2000;
        currentX = 360 + pct * (450 - 360);
        currentY = 260 + pct * (200 - 260);
        currentOpacity = 0;
        setStep(12);
        setIsErasing(true);
        setRevealWidths({ title: 240, b1: 320, b2: 320, b3: 320, b4: 320 });
      }

      setChalk({ x: currentX, y: currentY, opacity: currentOpacity });

      const isDrawing = (step === 1 || step === 3 || step === 5 || step === 7 || step === 9 || step === 11) && currentOpacity === 1;
      if (isDrawing && Math.random() < 0.6) {
        const dx = currentX - prevChalkX;
        const dy = currentY - prevChalkY;
        
        const p = {
          id: Math.random(),
          x: currentX,
          y: currentY,
          vx: (Math.random() * 2 - 1) * 0.2 - (dx * 0.1),
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 2.5 + 0.8,
          alpha: 0.9
        };
        setParticles((prev) => [...prev.slice(-30), p]);
      }

      prevChalkX = currentX;
      prevChalkY = currentY;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const updateParticles = () => {
      if (!active) return;
      setParticles((prev) =>
        prev
          .map((p) => ({
             ...p,
             x: p.x + p.vx,
             y: p.y + p.vy,
             alpha: p.alpha - 0.02,
             size: p.size * 0.97
          }))
          .filter((p) => p.alpha > 0)
      );
      requestAnimationFrame(updateParticles);
    };
    requestAnimationFrame(updateParticles);
    return () => {
      active = false;
    };
  }, []);

  // Tic-Tac-Toe Line Lengths
  const v1Offset = tictactoeProgress < 0.12 ? 60 - (tictactoeProgress / 0.12) * 60 : 0;
  const v2Offset = tictactoeProgress < 0.12 ? 60 : tictactoeProgress < 0.24 ? 60 - ((tictactoeProgress - 0.12) / 0.12) * 60 : 0;
  const h1Offset = tictactoeProgress < 0.24 ? 80 : tictactoeProgress < 0.36 ? 80 - ((tictactoeProgress - 0.24) / 0.12) * 80 : 0;
  const h2Offset = tictactoeProgress < 0.36 ? 80 : tictactoeProgress < 0.48 ? 80 - ((tictactoeProgress - 0.36) / 0.12) * 80 : 0;
  const x1aOffset = tictactoeProgress < 0.48 ? 14 : tictactoeProgress < 0.56 ? 14 - ((tictactoeProgress - 0.48) / 0.08) * 14 : 0;
  const x1bOffset = tictactoeProgress < 0.56 ? 14 : tictactoeProgress < 0.64 ? 14 - ((tictactoeProgress - 0.56) / 0.08) * 14 : 0;
  const o1Offset = tictactoeProgress < 0.64 ? 38 : tictactoeProgress < 0.78 ? 38 - ((tictactoeProgress - 0.64) / 0.14) * 38 : 0;
  const x2aOffset = tictactoeProgress < 0.78 ? 14 : tictactoeProgress < 0.86 ? 14 - ((tictactoeProgress - 0.78) / 0.08) * 14 : 0;
  const x2bOffset = tictactoeProgress < 0.86 ? 14 : tictactoeProgress < 0.94 ? 14 - ((tictactoeProgress - 0.86) / 0.08) * 14 : 0;

  return (
    <div className="relative w-full max-w-[600px] h-[340px] flex justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Decorative Particles */}
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
            <Pencil size={24} className="transform -scale-x-100" />
          </div>
        )}

        {/* Eraser sweep overlay */}
        {isErasing && (
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent z-40 pointer-events-none"
          />
        )}

        {/* Chalkboard Drawing Core SVG */}
        <svg viewBox="0 0 500 300" className="w-full h-full relative z-10" preserveAspectRatio="none">
          <defs>
            <clipPath id="reveal-title">
              <rect x="35" y="10" width={revealWidths.title} height="50" />
            </clipPath>
            <clipPath id="reveal-b1">
              <rect x="35" y="90" width={revealWidths.b1} height="40" />
            </clipPath>
            <clipPath id="reveal-b2">
              <rect x="35" y="140" width={revealWidths.b2} height="40" />
            </clipPath>
            <clipPath id="reveal-b3">
              <rect x="35" y="190" width={revealWidths.b3} height="40" />
            </clipPath>
            <clipPath id="reveal-b4">
              <rect x="35" y="240" width={revealWidths.b4} height="40" />
            </clipPath>
          </defs>

          {/* Title */}
          <text 
            x="40" y="50" 
            fontFamily="Caveat, cursive" 
            fontSize="38" 
            fill="var(--color-primary)" 
            clipPath="url(#reveal-title)"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          >
            Let's Scribble here!
          </text>

          {/* Tic-Tac-Toe */}
          <g opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            {tictactoeProgress > 0 && <line x1="385" y1="105" x2="385" y2="165" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v1Offset} />}
            {tictactoeProgress > 0.12 && <line x1="415" y1="105" x2="415" y2="165" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v2Offset} />}
            {tictactoeProgress > 0.24 && <line x1="360" y1="125" x2="440" y2="125" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h1Offset} />}
            {tictactoeProgress > 0.36 && <line x1="360" y1="145" x2="440" y2="145" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h2Offset} />}
            {tictactoeProgress > 0.48 && <line x1="365" y1="110" x2="375" y2="120" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1aOffset} />}
            {tictactoeProgress > 0.56 && <line x1="375" y1="110" x2="365" y2="120" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1bOffset} />}
            {tictactoeProgress > 0.64 && <path d="M 394,135 A 6,6 0 1,1 406,135 A 6,6 0 1,1 394,135" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="38" strokeDashoffset={o1Offset} />}
            {tictactoeProgress > 0.78 && <line x1="422" y1="150" x2="432" y2="160" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2aOffset} />}
            {tictactoeProgress > 0.86 && <line x1="432" y1="150" x2="422" y2="160" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2bOffset} />}
          </g>

          {/* Bullet 1 */}
          <text x="40" y="120" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b1)" opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            → Applied to 10 jobs today 💪
          </text>

          {/* Bullet 2 */}
          <text x="40" y="170" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b2)" opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            → Update resume for Frontend role
          </text>

          {/* Bullet 3 */}
          <text x="40" y="220" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b3)" opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            → Follow up with Stripe HR
          </text>

          {/* Bullet 4 */}
          <text x="40" y="270" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b4)" opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            → Prepare for system design 🧠
          </text>
        </svg>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', beforeCode + newChalkboardCode, 'utf8');
console.log('Successfully added point-wise scribbles and fixed masking boundaries');
