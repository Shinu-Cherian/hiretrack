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
  const [revealWidths, setRevealWidths] = useState({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
  const [particles, setParticles] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [eraseAlpha, setEraseAlpha] = useState(1);

  useEffect(() => {
    let active = true;
    let start = Date.now();
    let prevChalkX = 450;
    let prevChalkY = 200;

    const animate = () => {
      if (!active) return;
      const now = Date.now();
      const elapsed = now - start;

      const totalCycle = 25000;
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
        currentY = 200 - pct * (200 - 45);
        currentOpacity = 1;
        setStep(0);
        setRevealWidths({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
        setIsErasing(false);
        setEraseAlpha(1);
      } 
      else if (cycleTime < 3500) {
        // Draw Title
        const pct = (cycleTime - 1500) / 2000;
        const totalW = 300; 
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 45 + handwritingBounce;
        currentOpacity = 1;
        setStep(1);
        setRevealWidths({ title: currentW, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 4500) {
        // Move to B1
        const pct = (cycleTime - 3500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 45 + pct * (100 - 45);
        currentOpacity = 0; // lift pencil
        setStep(2);
        setRevealWidths({ title: 300, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 6500) {
        // Draw B1
        const pct = (cycleTime - 4500) / 2000;
        const totalW = 280;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 100 + handwritingBounce;
        currentOpacity = 1;
        setStep(3);
        setRevealWidths({ title: 300, b1: currentW, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 7500) {
        // Move to B2
        const pct = (cycleTime - 6500) / 1000;
        currentX = 320 + pct * (40 - 320);
        currentY = 100 + pct * (140 - 100);
        currentOpacity = 0;
        setStep(4);
        setRevealWidths({ title: 300, b1: 280, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 9500) {
        // Draw B2
        const pct = (cycleTime - 7500) / 2000;
        const totalW = 340;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 140 + handwritingBounce;
        currentOpacity = 1;
        setStep(5);
        setRevealWidths({ title: 300, b1: 280, b2: currentW, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 10500) {
        // Move to B3
        const pct = (cycleTime - 9500) / 1000;
        currentX = 380 + pct * (40 - 380);
        currentY = 140 + pct * (180 - 140);
        currentOpacity = 0;
        setStep(6);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 0, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 12500) {
        // Draw B3
        const pct = (cycleTime - 10500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 180 + handwritingBounce;
        currentOpacity = 1;
        setStep(7);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: currentW, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 13500) {
        // Move to B4
        const pct = (cycleTime - 12500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 180 + pct * (220 - 180);
        currentOpacity = 0;
        setStep(8);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 15500) {
        // Draw B4
        const pct = (cycleTime - 13500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 220 + handwritingBounce;
        currentOpacity = 1;
        setStep(9);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: currentW, b5: 0, b6: 0 });
      }
      else if (cycleTime < 16500) {
        // Move to B5
        const pct = (cycleTime - 15500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 220 + pct * (260 - 220);
        currentOpacity = 0;
        setStep(10);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 0, b6: 0 });
      }
      else if (cycleTime < 18500) {
        // Draw B5
        const pct = (cycleTime - 16500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 260 + handwritingBounce;
        currentOpacity = 1;
        setStep(11);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: currentW, b6: 0 });
      }
      else if (cycleTime < 19500) {
        // Move to B6
        const pct = (cycleTime - 18500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 260 + pct * (300 - 260);
        currentOpacity = 0;
        setStep(12);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: 0 });
      }
      else if (cycleTime < 21500) {
        // Draw B6
        const pct = (cycleTime - 19500) / 2000;
        const totalW = 340;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 300 + handwritingBounce;
        currentOpacity = 1;
        setStep(13);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: currentW });
      }
      else if (cycleTime < 23500) {
        // Erase Sweep
        const pct = (cycleTime - 21500) / 2000;
        currentX = 380 + pct * (450 - 380);
        currentY = 300 + pct * (200 - 300);
        currentOpacity = 0;
        setStep(14);
        setIsErasing(true);
        setEraseAlpha(1 - pct);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: 340 });
      } 
      else {
        // Pause before restart
        setStep(15);
        currentOpacity = 0;
        currentX = 450;
        currentY = 200;
        setEraseAlpha(0);
      }

      setChalk({ x: currentX, y: currentY, opacity: currentOpacity });

      const isDrawing = step % 2 !== 0 && step <= 13 && currentOpacity === 1;
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

  return (
    <div className="relative w-full max-w-[600px] h-[380px] flex justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Decorative Particles */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: \`\${(p.x / 500) * 100}%\`,
                top: \`\${(p.y / 340) * 100}%\`,
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
              top: \`\${(chalk.y / 340) * 100}%\`,
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
        <svg viewBox="0 0 500 340" className="w-full h-full relative z-10" preserveAspectRatio="none">
          <defs>
            <clipPath id="reveal-title"><rect x="35" y="10" width={revealWidths.title} height="50" /></clipPath>
            <clipPath id="reveal-b1"><rect x="35" y="70" width={revealWidths.b1} height="40" /></clipPath>
            <clipPath id="reveal-b2"><rect x="35" y="110" width={revealWidths.b2} height="40" /></clipPath>
            <clipPath id="reveal-b3"><rect x="35" y="150" width={revealWidths.b3} height="40" /></clipPath>
            <clipPath id="reveal-b4"><rect x="35" y="190" width={revealWidths.b4} height="40" /></clipPath>
            <clipPath id="reveal-b5"><rect x="35" y="230" width={revealWidths.b5} height="40" /></clipPath>
            <clipPath id="reveal-b6"><rect x="35" y="270" width={revealWidths.b6} height="40" /></clipPath>
          </defs>

          {/* Title */}
          <text x="40" y="45" fontFamily="Caveat, cursive" fontSize="38" fill="var(--color-primary)" clipPath="url(#reveal-title)" opacity={eraseAlpha}>
            Let's Scribble here!
          </text>
          
          <text x="40" y="100" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b1)" opacity={eraseAlpha}>
            → Applied to 10 jobs today
          </text>
          <text x="40" y="140" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b2)" opacity={eraseAlpha}>
            → Update resume for Frontend role
          </text>
          <text x="40" y="180" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b3)" opacity={eraseAlpha}>
            → Follow up with Stripe HR
          </text>
          <text x="40" y="220" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b4)" opacity={eraseAlpha}>
            → Prepare for system design
          </text>
          <text x="40" y="260" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b5)" opacity={eraseAlpha}>
            → Schedule mock interview
          </text>
          <text x="40" y="300" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b6)" opacity={eraseAlpha}>
            → Review React hooks & concepts
          </text>
        </svg>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('C:/Users/User/Desktop/hiretrack/frontend/src/components/VisualCards.jsx', beforeCode + newChalkboardCode, 'utf8');
console.log('Successfully completely overhauled the chalkboard showcase without Tic-Tac-Toe and Emojis, and expanded to 6 points.');
