import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Import your new background component
import ParticleBackground from './components/ParticleBackground'; 
import BootOverlay from './components/BootOverlay';
import LandingScreen from './components/LandingScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';

function App() {
  const [screen, setScreen] = useState('boot');
  const [gameResult, setGameResult] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const cursorDotRef = useRef(null);
  // REMOVED: No longer need the ref for the old canvas
  // const bgCanvasRef = useRef(null); 
  const backgroundGridRef = useRef(null);

  useEffect(() => {
    // --- REMOVE THE OLD CANVAS ANIMATION LOGIC ---
    // The entire useEffect block that handled bgCanvasRef, bgCtx,
    // initBackground(), and animateBackground() should be deleted.

    // --- KEEP THE MOUSEMOVE LOGIC FOR CURSOR AND PARALLAX ---
    const handleMouseMove = (e) => {
        gsap.to(cursorDotRef.current, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });

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
    gsap.to("#app-container-inner", { scale: 1, duration: 2, ease: "elastic.out(1, 0.5)" });

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // No changes to handlers below this line
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
      case 'game': return <GameScreen onEndGame={handleEndGame} />;
      case 'final': return <FinalScreen result={gameResult} score={finalScore} onRetry={handleRetry} onBackToHome={handleBackToHome} />;
      case 'landing': default: return <LandingScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <>
      <ParticleBackground /> {/* <-- ADD THE NEW COMPONENT HERE */}
      <div id="cursor-dot" ref={cursorDotRef}></div>
      {/* REMOVED: The old canvas element is gone */}
      {/* <canvas id="background-animation" ref={bgCanvasRef}></canvas> */}
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