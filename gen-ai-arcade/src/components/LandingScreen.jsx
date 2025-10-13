import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import speakerImage from '../assets/aditya-rane.png';
import { getScores } from '../utils/leaderboardUtils';

// --- NEW: SVG Icon Components ---
const LinkedInIcon = () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.75s.784-1.75 1.75-1.75 1.75.79 1.75 1.75-.783 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.518-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.376v6.859z"/></svg>;
const InstagramIcon = () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.266.058 2.164.24 2.885.513.733.27 1.34.61 1.947 1.217.605.607.945 1.214 1.217 1.947.273.72.455 1.62.513 2.885.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.266-.24 2.164-.513 2.885a4.912 4.912 0 01-1.217 1.947c-.607.605-1.214.945-1.947 1.217-.72.273-1.62.455-2.885.513-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.266-.058-2.164-.24-2.885-.513a4.912 4.912 0 01-1.947-1.217c-.605-.607-.945-1.214-1.217-1.947-.273-.72-.455-1.62-.513-2.885C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.058-1.266.24-2.164.513-2.885a4.912 4.912 0 011.217-1.947c.607-.605 1.214.945 1.947-1.217.72-.273 1.62-.455 2.885-.513C8.416 2.175 8.796 2.163 12 2.163zm0 1.8a9.72 9.72 0 00-4.823.07c-1.16.053-1.842.23-2.33.412a3.09 3.09 0 00-1.22.82A3.09 3.09 0 002.81 6.48c-.182.488-.36.17-.412 2.33C2.34 9.973 2.328 10.33 2.328 12s.012 2.027.07 3.19c.053 1.16.23 1.842.412 2.33a3.09 3.09 0 00.82 1.22c.45.45.86.638 1.22.82.488.182 1.17.36 2.33.412 1.163.058 1.52.07 3.19.07s2.027-.012 3.19-.07c1.16-.053 1.842-.23 2.33-.412a3.09 3.09 0 001.22-.82c.45-.45.638-.86.82-1.22.182-.488.36-1.17.412-2.33.058-1.163.07-1.52.07-3.19s-.012-2.027-.07-3.19c-.053-1.16-.23-1.842-.412-2.33a3.09 3.09 0 00-.82-1.22c-.45-.45-.86-.638-1.22-.82-.488-.182-1.17-.36-2.33-.412C14.027 3.975 13.67 3.963 12 3.963zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.8a1.95 1.95 0 110 3.9 1.95 1.95 0 010-3.9zm4.5-3.6a.9.9 0 100 1.8.9.9 0 000-1.8z" clipRule="evenodd"/></svg>;
const WebsiteIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.41 9a9.002 9.002 0 0110.43-6.52M20.59 15a9.002 9.002 0 01-10.43 6.52M12 2v20"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path></svg>;


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
            <div className="flex flex-col items-center w-full px-8 md:px-16 h-full overflow-y-auto pt-16 pb-8">

                {/* Main Content */}
                <div className="flex flex-col items-center text-center w-full">
                    <h2 className="gsap-reveal text-base md:text-lg text-gray-300 mt-8 md:mt-0">Microsoft Learn Student Chapter, VIT Pune Presents</h2>
                    <div id="main-title-wrapper" ref={titleWrapperRef} className="flex items-center justify-center my-4 gsap-reveal" style={{ transformStyle: 'preserve-3d' }}>
                        <span className="text-3xl md:text-6xl ai-font text-[var(--electric-blue)] neon-glow-blue">&raquo;</span>
                        <h1 className="text-3xl md:text-6xl ai-font text-[var(--accent-white)] mx-2 md:mx-4">GEN AI ARCADE</h1>
                        <span className="text-3xl md:text-6xl ai-font text-[var(--electric-blue)] neon-glow-blue">&laquo;</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center w-full max-w-5xl">
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

                {/* --- NEW: SOCIAL ICONS FOOTER --- */}
                <div className="w-full mt-16 pb-8 gsap-reveal text-center">
                    <p className="text-lg text-gray-300 mb-6">Connect with MLSC VIT Pune</p>
                    <div className="flex justify-center space-x-8">
                        <a href="https://www.linkedin.com/company/mlsc-vitpune/" target="_blank" rel="noopener noreferrer" className="text-[var(--light-blue)] hover:text-white transition-transform duration-300 hover:scale-110 neon-glow-blue">
                            <LinkedInIcon />
                        </a>
                        <a href="https://www.instagram.com/mlscvitpune" target="_blank" rel="noopener noreferrer" className="text-[var(--light-blue)] hover:text-white transition-transform duration-300 hover:scale-110 neon-glow-blue">
                            <InstagramIcon />
                        </a>
                        <a href="https://mlsc-vit-pune.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[var(--light-blue)] hover:text-white transition-transform duration-300 hover:scale-110 neon-glow-blue">
                            <WebsiteIcon />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default LandingScreen;