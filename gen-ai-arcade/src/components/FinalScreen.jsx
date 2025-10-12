import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { addScore } from '../utils/leaderboardUtils';

const FinalScreen = ({ score, onRetry, onBackToHome }) => {
    const containerRef = useRef(null);
    const [playerName, setPlayerName] = useState('');
    const [scoreSubmitted, setScoreSubmitted] = useState(false);

    const handleScoreSubmit = (e) => {
        e.preventDefault();
        if (playerName.trim()) {
            addScore(playerName, score);
            setScoreSubmitted(true);
        }
    };

    useEffect(() => {
        gsap.from(containerRef.current.querySelectorAll(".gsap-final-reveal"), {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            // THIS IS THE CRITICAL FIX:
            // It removes all inline styles set by GSAP after the animation completes,
            // ensuring the elements return to their full, crisp visibility.
            clearProps: "all" 
        });
    }, [scoreSubmitted]);

    return (
        <section id="final-screen" className="screen" ref={containerRef}>
            <div className="text-center max-w-3xl px-4 flex flex-col items-center">

                <h1 className="text-4xl md:text-7xl ai-font mb-6 neon-glow-blue text-red-500 gsap-final-reveal">
                    GAME OVER
                </h1>
                
                <p className="text-lg md:text-3xl text-gray-200 mb-10 gsap-final-reveal">
                    Your final score is ready. Add your name to the leaderboard!
                </p>

                {!scoreSubmitted ? (
                    <div id="score-submission" className="w-full max-w-md">
                        <p className="text-2xl md:text-4xl text-white mb-4 gsap-final-reveal">
                            Final Score: <span className="font-bold font-mono">{score}</span>
                        </p>
                        <form onSubmit={handleScoreSubmit} className="data-card p-6 rounded-xl">
                            <label htmlFor="playerName" className="block text-xl font-bold text-blue-400 mb-4 neon-glow-blue gsap-final-reveal">
                                Enter Your Name:
                            </label>
                            <input
                                type="text"
                                id="playerName"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full bg-gray-900 border-2 border-blue-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 gsap-final-reveal"
                                maxLength="15"
                                required
                                placeholder="Your Agent Name"
                            />
                            <button type="submit" data-text="SAVE SCORE" className="w-full neon-btn font-bold py-3 px-10 rounded-lg text-lg neon-glow-blue gsap-final-reveal">
                                SAVE SCORE
                            </button>
                        </form>
                    </div>
                ) : (
                    <div id="post-submission-links" className="p-6 md:p-8 rounded-xl data-card w-full max-w-lg">
                        <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-6 neon-glow-blue gsap-final-reveal">Score Saved! Now Register for the Event:</h3>
                        <a href="https://forms.gle/o2WQ6fdcZ7dtkgcWA" target="_blank" rel="noopener noreferrer" data-text="📝 Finalize System Registration" className="block w-full font-bold mb-6 py-3 rounded-lg bg-transparent border-2 border-white text-white neon-btn neon-glow-blue gsap-final-reveal">
                            <span className="relative z-10">📝 Finalize System Registration</span>
                        </a>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 gsap-final-reveal">
                            <button onClick={onRetry} data-text="PLAY AGAIN" className="flex-1 neon-btn font-bold py-3 px-8 rounded-lg text-lg">PLAY AGAIN</button>
                            <button onClick={onBackToHome} data-text="< HOME" className="flex-1 neon-btn font-bold py-3 px-8 rounded-lg text-lg neon-glow-blue">&lt; HOME</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FinalScreen;