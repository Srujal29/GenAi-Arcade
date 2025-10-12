import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import speakerImage from '../assets/aditya-rane.png';
import { getScores } from '../utils/leaderboardUtils';

const LandingScreen = ({ onStartGame }) => {
    const titleWrapperRef = useRef(null);
    const containerRef = useRef(null);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        setScores(getScores());

        // GSAP and mousemove effects remain the same
        gsap.from(containerRef.current.querySelectorAll(".gsap-reveal"), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all"
        });

        const handleMouseMove = (e) => {
            const { clientWidth, clientHeight } = document.documentElement;
            const xPercent = (e.clientX / clientWidth - 0.5) * 2;
            const yPercent = (e.clientY / clientHeight - 0.5) * 2;
            gsap.to(titleWrapperRef.current, {
                rotationY: xPercent * 10,
                rotationX: -yPercent * 10,
                ease: 'power1.out',
                duration: 0.5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section id="landing-screen" className="screen" ref={containerRef}>
            {/* KEY CHANGE:
              Removed 'max-w-4xl' to allow full width.
              Increased side padding from 'px-4' to 'px-8 md:px-16' for better spacing.
            */}
            <div className="flex flex-col items-center w-full px-8 md:px-16 h-full overflow-y-auto pt-16 pb-8">

                {/* Main Content */}
                <div className="flex flex-col items-center text-center w-full">
                    <h2 className="gsap-reveal text-base md:text-lg text-gray-300 mt-8 md:mt-0">Microsoft Learn Student Chapter, VIT Pune Presents</h2>
                    <div id="main-title-wrapper" ref={titleWrapperRef} className="flex items-center justify-center my-4 gsap-reveal" style={{ transformStyle: 'preserve-3d' }}>
                        <span className="text-3xl md:text-6xl ai-font text-[var(--electric-blue)] neon-glow-blue">&raquo;</span>
                        <h1 className="text-3xl md:text-6xl ai-font text-[var(--accent-white)] mx-2 md:mx-4">GEN AI ARCADE</h1>
                        <span className="text-3xl md:text-6xl ai-font text-[var(--electric-blue)] neon-glow-blue">&laquo;</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center w-full max-w-5xl"> {/* Added max-width here to keep this section neat */}
                        <div className="flex flex-col items-center gsap-reveal">
                            <p className="text-base md:text-xl text-gray-300 mb-4">Join us for an inspiring talk by a Google Speaker on the future of AI and its real-world impact.</p>
                            <div className="speaker-frame mb-4">
                                <img src={speakerImage} alt="Aditya Rane" className="w-36 h-36" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--accent-white)]">ADITYA RANE</h3>
                            <p className="text-lg text-[var(--electric-blue)]">AI Consultant @ Google</p>
                        </div>
                        <div className="text-left flex flex-col justify-center gsap-reveal">
                            <div className="p-6 rounded-lg data-card mb-6">
                                <h4 className="text-xl md:text-2xl font-bold text-[var(--electric-blue)] mb-4">Stay back for:</h4>
                                <ul className="space-y-2 text-sm md:text-base">
                                    <li className="flex items-center"><span className="text-[var(--electric-blue)] mr-2">&raquo;</span> Hands-on GenAI workshop</li>
                                    <li className="flex items-center"><span className="text-[var(--electric-blue)] mr-2">&raquo;</span> Explore tools & build AI-powered ideas</li>
                                    <li className="flex items-center"><span className="text-[var(--electric-blue)] mr-2">&raquo;</span> Experience creativity meeting technology!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <button onClick={onStartGame} data-text="PLAY THE ARCADE CHALLENGE" className="w-full neon-btn font-bold py-3 px-10 rounded-lg text-lg gsap-reveal">PLAY THE ARCADE CHALLENGE</button>
                        <a href="https://forms.gle/o2WQ6fdcZ7dtkgcWA" target="_blank" rel="noopener noreferrer" data-text="REGISTER DIRECTLY" className="w-full block text-center neon-btn font-bold py-3 px-10 rounded-lg text-lg gsap-reveal">REGISTER DIRECTLY</a>
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="w-full mt-16 gsap-reveal">
                    <h3 className="text-3xl md:text-4xl ai-font mb-6 neon-glow-blue text-[var(--light-blue)] text-center">
                        TOP AGENTS
                    </h3>
                    <div className="data-card p-6 md:p-8 rounded-xl max-w-2xl mx-auto">
                        {scores.length > 0 ? (
                            <ol className="space-y-4 text-left">
                                {scores.map((score, index) => (
                                    <li key={index} className="flex items-center justify-between text-base md:text-lg border-b border-gray-700 pb-2">
                                        <span className="flex items-center min-w-0">
                                            <span className="font-bold text-[var(--electric-blue)] w-8 flex-shrink-0">{index + 1}.</span>
                                            <span className="text-[var(--accent-white)] truncate" title={score.name}>{score.name}</span>
                                        </span>
                                        <span className="font-mono font-bold text-[var(--light-blue)] ml-4">{score.score}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No scores recorded yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingScreen;