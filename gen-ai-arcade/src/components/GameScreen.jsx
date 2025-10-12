import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GameScreen = ({ onEndGame }) => {
    const canvasRef = useRef(null);
    const gameInstance = useRef({
        ctx: null, animationFrameId: null, gameActive: false, keys: {}, player: null, projectiles: [],
        enemies: [], particles: [], stars: [], shake: { duration: 0, magnitude: 0 },
        enemySpawnTimer: 75, score: 0, lives: 3,
    });
    const uiScoreRef = useRef(null);
    const uiLivesRef = useRef(null);

    const CONFIG = { 
        PLAYER_LIVES: 3, 
        // CHANGE 1: Decreased from 75 to 45. Enemies will now spawn much more frequently.
        ENEMY_SPAWN_RATE: 45, 
        POINTS_PER_ENEMY: 100,
        PARTICLE_COUNT: 25, 
        PARTICLE_LIFESPAN: 60, 
        SHAKE_DURATION: 10, 
        SHAKE_MAGNITUDE: 4, 
        STAR_COUNT: 150 
    };

    useEffect(() => {
        const g = gameInstance.current;
        g.ctx = canvasRef.current.getContext('2d');

        const shoot = () => {
            if (!g.gameActive || !g.player) return;
            if (g.player.shootCooldown === 0) {
                g.projectiles.push({
                    width: 4, height: 15,
                    x: g.player.x + g.player.width / 2 - 2, y: g.player.y,
                    // CHANGE 2: Increased projectile speed from 10 to 14 for faster bullets.
                    speed: 14, 
                    color: 'var(--accent-white)'
                });
                // CHANGE 3: Decreased cooldown from 12 to 8. You can now shoot more rapidly.
                g.player.shootCooldown = 8;
            }
        };

        const handleCollisions = () => {
            // ... (No changes needed in this function)
            for (let i = g.projectiles.length - 1; i >= 0; i--) {
                for (let j = g.enemies.length - 1; j >= 0; j--) {
                    const p = g.projectiles[i];
                    const e = g.enemies[j];
                    if (p && e && p.x < e.x + e.width && p.x + p.width > e.x && p.y < e.y + e.height && p.y + p.height > e.y) {
                        for (let k = 0; k < CONFIG.PARTICLE_COUNT; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = Math.random() * 5 + 2;
                            g.particles.push({ x: e.x + 15, y: e.y + 15, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: CONFIG.PARTICLE_LIFESPAN, color: 'var(--electric-blue)' });
                        }
                        g.shake = { duration: CONFIG.SHAKE_DURATION, magnitude: CONFIG.SHAKE_MAGNITUDE };
                        g.projectiles.splice(i, 1);
                        g.enemies.splice(j, 1);
                        g.score += CONFIG.POINTS_PER_ENEMY;
                        break;
                    }
                }
            }
            if (!canvasRef.current) return; // Safety check
            for (let i = g.enemies.length - 1; i >= 0; i--) {
                const e = g.enemies[i];
                if ((e.x < g.player.x + g.player.width && e.x + e.width > g.player.x && e.y < g.player.y + g.player.height && e.y + e.height > g.player.y) || e.y > canvasRef.current.height) {
                    g.particles.push({ x: g.player.x + g.player.width / 2, y: g.player.y + g.player.height / 2, isShieldHit: true, life: 20 });
                    g.enemies.splice(i, 1);
                    g.lives--;
                    g.shake = { duration: 15, magnitude: 8 };
                }
            }
            g.projectiles = g.projectiles.filter(p => p.y > -p.height);
            g.particles = g.particles.filter(p => p.life > 0);
        };

        const drawGameObjects = () => {
           // ... (No changes needed in this function)
           if (!g.player) return;
            g.stars.forEach(s => { g.ctx.fillStyle = 'rgba(239, 239, 239, 0.7)'; g.ctx.beginPath(); g.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); g.ctx.fill(); });
            const p = g.player;
            g.ctx.fillStyle = p.color; g.ctx.shadowColor = p.color; g.ctx.shadowBlur = 15;
            g.ctx.beginPath(); g.ctx.moveTo(p.x, p.y + p.height); g.ctx.lineTo(p.x + p.width / 2, p.y); g.ctx.lineTo(p.x + p.width, p.y + p.height); g.ctx.closePath(); g.ctx.fill();
            g.ctx.shadowBlur = 0;
            g.projectiles.forEach(pr => { g.ctx.fillStyle = pr.color; g.ctx.shadowColor = pr.color; g.ctx.shadowBlur = 10; g.ctx.fillRect(pr.x, pr.y, pr.width, pr.height); g.ctx.shadowBlur = 0; });
            g.enemies.forEach(e => { g.ctx.fillStyle = e.color; g.ctx.shadowColor = e.color; g.ctx.shadowBlur = 15; g.ctx.beginPath(); g.ctx.moveTo(e.x + 15, e.y); g.ctx.lineTo(e.x + 30, e.y + 15); g.ctx.lineTo(e.x + 15, e.y + 30); g.ctx.lineTo(e.x, e.y + 15); g.ctx.closePath(); g.ctx.fill(); g.ctx.shadowBlur = 0; });
            g.particles.forEach(p => { if (p.isShieldHit) { g.ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)'; g.ctx.lineWidth = 3; g.ctx.beginPath(); g.ctx.arc(p.x, p.y, 20 + (20 - p.life), 0, Math.PI * 2); g.ctx.stroke(); } else { g.ctx.globalAlpha = Math.max(0, p.life / CONFIG.PARTICLE_LIFESPAN); g.ctx.fillStyle = p.color; g.ctx.beginPath(); g.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); g.ctx.fill(); } });
            g.ctx.globalAlpha = 1;
        };

        const updateGameUI = () => {
            // ... (No changes needed in this function)
            if (uiScoreRef.current) uiScoreRef.current.textContent = g.score;
            if (uiLivesRef.current) uiLivesRef.current.textContent = g.lives;
        };

        const resizeGameCanvas = () => {
            // ... (No changes needed in this function)
            const canvas = canvasRef.current;
            if (!canvas) return;
            const parent = canvas.parentElement;
            const size = Math.min(parent.clientWidth, 800);
            canvas.width = size;
            canvas.height = size * 0.75;
            if (g.player) {
                g.player.y = canvas.height - g.player.height - 20;
            }
        };
        
        const gameLoop = () => {
            if (!g.gameActive || !canvasRef.current) return;

            if (g.keys['ArrowLeft'] && g.player.x > 0) g.player.x -= g.player.speed;
            if (g.keys['ArrowRight'] && g.player.x < canvasRef.current.width - g.player.width) g.player.x += g.player.speed;
            if (g.player.shootCooldown > 0) g.player.shootCooldown--;
            g.enemySpawnTimer--;
            if (g.enemySpawnTimer <= 0) {
                g.enemies.push({ 
                    width: 30, height: 30, 
                    x: Math.random() * (canvasRef.current.width - 30), y: -30, 
                    // CHANGE 4: Increased the enemy base and random speed. They will move faster.
                    speed: Math.random() * 3 + 3, 
                    color: 'var(--electric-blue)' 
                });
                g.enemySpawnTimer = CONFIG.ENEMY_SPAWN_RATE;
            }
            g.projectiles.forEach(p => p.y -= p.speed);
            g.enemies.forEach(e => e.y += e.speed);
            g.stars.forEach(s => { s.y += s.speed; if (s.y > canvasRef.current.height) { s.y = 0; s.x = Math.random() * canvasRef.current.width; } });
            g.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--; });
            
            handleCollisions();
            
            g.ctx.save();
            if (g.shake.duration > 0) {
                g.ctx.translate((Math.random() - 0.5) * g.shake.magnitude, (Math.random() - 0.5) * g.shake.magnitude);
                g.shake.duration--;
            }
            g.ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawGameObjects();
            g.ctx.restore();
            updateGameUI();
            
            if (g.lives <= 0) {
                onEndGame('success', g.score);
            }

            g.animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        const initGame = () => {
            g.gameActive = true;
            g.keys = {}; g.projectiles = []; g.enemies = []; g.particles = [];
            g.shake = { duration: 0, magnitude: 0 };
            g.enemySpawnTimer = CONFIG.ENEMY_SPAWN_RATE;
            g.score = 0; g.lives = CONFIG.PLAYER_LIVES;
            resizeGameCanvas();
            // CHANGE 5: Increased player speed from 8 to 12 for higher sensitivity.
            g.player = { width: 40, height: 20, x: canvasRef.current.width / 2 - 20, y: canvasRef.current.height - 40, speed: 12, color: 'var(--light-blue)', shootCooldown: 0 };
            g.stars = Array.from({ length: CONFIG.STAR_COUNT }, () => ({ x: Math.random() * canvasRef.current.width, y: Math.random() * canvasRef.current.height, size: Math.random() * 1.5 + 0.5, speed: (Math.random() * 1.5 + 0.5) * 0.5 }));
            const playerStartY = g.player.y;
            g.player.y = canvasRef.current.height + 50;
            gsap.to(g.player, { y: playerStartY, duration: 1, ease: 'power3.out' });
            if (g.animationFrameId) cancelAnimationFrame(g.animationFrameId);
            gameLoop();
        };

        const handleKeyDown = (e) => { g.keys[e.code] = true; if (e.code === 'Space') shoot(); };
        const handleKeyUp = (e) => { g.keys[e.code] = false; };
        const handleTouchStart = (e) => { e.preventDefault(); shoot(); };
        const handleTouchMove = (e) => {
            e.preventDefault();
            if (g.gameActive && e.touches.length > 0 && g.player) {
                const rect = canvasRef.current.getBoundingClientRect();
                let touchX = e.touches[0].clientX - rect.left;
                g.player.x = touchX - g.player.width / 2;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', resizeGameCanvas);
        const canvas = canvasRef.current;
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        initGame();
        
        return () => {
            g.gameActive = false;
            cancelAnimationFrame(g.animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', resizeGameCanvas);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
        };
    }, [onEndGame]);

    return (
        <section id="game-screen" className="screen">
            <div className="flex flex-col items-center w-full h-full max-w-[800px]">
                <h2 className="text-2xl md:text-4xl ai-font text-[var(--electric-blue)] my-2 text-center">DEFENSE PROTOCOL</h2>
                <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-1 text-sm md:text-lg text-[var(--light-blue)] mb-2">
                    <span className="neon-glow-blue">Score: <span ref={uiScoreRef}>0</span></span>
                    <span className="neon-glow-blue">Shields: <span ref={uiLivesRef}>3</span></span>
                </div>
                <canvas ref={canvasRef} id="gameCanvas" className="flex-grow w-full"></canvas>
            </div>
        </section>
    );
};

export default GameScreen;