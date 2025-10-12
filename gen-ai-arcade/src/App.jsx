import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import BootOverlay from './components/BootOverlay';
import LandingScreen from './components/LandingScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';

function App() {
  const [screen, setScreen] = useState('boot');
  const [gameResult, setGameResult] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const cursorDotRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const backgroundGridRef = useRef(null); // Ref for the parallax grid

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const bgCanvas = bgCanvasRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    let bgParticles = [];
    let animationFrameId;
    
    const initBackground = () => {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgParticles = Array.from({ length: (window.innerWidth * window.innerHeight) / 12000 }, () => ({
            x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
            directionX: (Math.random() * 0.4) - 0.2, directionY: (Math.random() * 0.4) - 0.2,
            size: (Math.random() * 1.5) + 1,
        }));
    }

    const animateBackground = () => {
        bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        bgParticles.forEach(p => {
            p.x += p.directionX; p.y += p.directionY;
            if (p.x > window.innerWidth || p.x < 0) p.directionX *= -1;
            if (p.y > window.innerHeight || p.y < 0) p.directionY *= -1;
            bgCtx.beginPath(); bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            bgCtx.fillStyle = 'rgba(0, 163, 255, 0.5)';
            bgCtx.fill();
        });
        animationFrameId = requestAnimationFrame(animateBackground);
    }
    
    initBackground();
    animateBackground();

    const handleMouseMove = (e) => {
        // Main cursor dot movement
        gsap.to(cursorDot, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });

        // Parallax effect for the background grid
        const { clientWidth, clientHeight } = document.documentElement;
        const xPercent = (e.clientX / clientWidth - 0.5) * 2;
        const yPercent = (e.clientY / clientHeight - 0.5) * 2;
        gsap.to(backgroundGridRef.current, {
            backgroundPosition: `${xPercent * -25}px ${yPercent * -25}px`,
            duration: 0.5,
            ease: "power1.out",
        });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', initBackground);
    
    gsap.to("#app-container-inner", { scale: 1, duration: 2, ease: "elastic.out(1, 0.5)" });

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', initBackground);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  const handleBootComplete = () => setScreen('landing');
  const handleStartGame = () => setScreen('game');

  const handleEndGame = (result, score) => {
    setGameResult(result);
    setFinalScore(score);
    setScreen('final');
  };

  const handleRetry = () => {
    setGameResult(null);
    setFinalScore(0);
    setScreen('game');
  };

  const handleBackToHome = () => {
    setGameResult(null);
    setFinalScore(0);
    setScreen('landing');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'game':
        return <GameScreen onEndGame={handleEndGame} />;
      case 'final':
        return <FinalScreen 
                 result={gameResult} 
                 score={finalScore}
                 onRetry={handleRetry} 
                 onBackToHome={handleBackToHome} 
               />;
      case 'landing':
      default:
        return <LandingScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <>
      <div id="cursor-dot" ref={cursorDotRef}></div>
      <canvas id="background-animation" ref={bgCanvasRef}></canvas>
      <div id="background-grid" ref={backgroundGridRef}></div>
      <div id="crt-overlay"></div>

      {screen === 'boot' && <BootOverlay onBootComplete={handleBootComplete} />}

      <div id="app-container" className="w-full h-screen mx-auto">
        <div id="app-container-inner">
          {screen !== 'boot' && renderScreen()}
        </div>
      </div>
    </>
  );
}

export default App;