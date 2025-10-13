import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
// IMPORTANT: We are now importing the engine itself
import { tsParticles } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

const ParticleBackground = () => {
  // This function now directly uses the imported tsParticles engine
  const particlesInit = useCallback(async (engine) => {
    // This loads the tsparticles package bundle, it's a must to have this line
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: '#0a0f1a',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#00ffff',
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
      }}
    />
  );
};

export default ParticleBackground;