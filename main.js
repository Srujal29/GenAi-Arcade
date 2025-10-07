// main.js - The FINAL and WORKING version.

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let isGameInitialized = false;

    // --- Function to Initialize and Run the Game ---
    // This will only be called AFTER the game container exists.
    function initializeAndRunGame() {
        if (isGameInitialized) return;

        // Initialize Kaboom and tell it EXACTLY where to put the canvas.
        kaboom({
            // THIS IS THE CRITICAL FIX:
            root: document.querySelector(".game-container"),
            global: true, // Use the most reliable global mode
            width: 800,
            height: 600,
            background: [0, 0, 0, 0], // Transparent
        });

        // Load all assets
        loadFont("orbitron", "https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2");
        loadSound("music", "https://kaboomjs.com/sounds/detune.mp3");
        loadSound("laser", "https://kaboomjs.com/sounds/laser.mp3");
        loadSound("explosion", "https://kaboomjs.com/sounds/explosion.mp3");
        loadSound("win-sound", "https://kaboomjs.com/sounds/powerup.mp3");

        // Define all game scenes
        scene("game", () => {
            const music = play("music", { loop: true, volume: 0.4 });
            let score = 0;
            let playerLives = 3;
            const SCORE_TO_WIN = 20;

            const player = add([
                pos(width() / 2, height() - 50),
                polygon([vec2(0, -16), vec2(12, 16), vec2(-12, 16)]),
                origin("center"), color(0, 245, 212), area(),
                { isInvincible: false }, "player",
            ]);

            onKeyDown("left", () => player.pos.x > 20 && player.move(-350, 0));
            onKeyDown("right", () => player.pos.x < width() - 20 && player.move(350, 0));
            onKeyPress("space", () => {
                play("laser", { volume: 0.3 });
                add([ rect(4, 12), pos(player.pos.x, player.pos.y - 20), origin("center"), color(241, 91, 181), move(UP, 500), area(), cleanup(), "bullet" ]);
            });

            loop(0.9, () => {
                add([ pos(rand(20, width() - 20), 0), polygon([vec2(0, 12), vec2(12, -12), vec2(-12, -12)]), origin("center"), color(155, 93, 229), move(DOWN, 150), area(), cleanup(), "enemy" ]);
            });

            const scoreLabel = add([ text(`Score: ${score}`, { size: 32, font: "orbitron" }), pos(24, 24) ]);
            const healthBar = add([ rect(150, 20), pos(width() - 174, 30), color(0, 245, 212) ]);

            player.onCollide("enemy", (e) => {
                if (player.isInvincible) return;
                play("explosion"); destroy(e); shake(20); playerLives--; healthBar.width = (playerLives / 3) * 150;
                player.isInvincible = true; player.opacity = 0.5;
                wait(2, () => { player.isInvincible = false; player.opacity = 1; });
                if (playerLives <= 0) { music.stop(); go("lose", score); }
            });

            onCollide("bullet", "enemy", (b, e) => {
                play("explosion", { volume: 0.5 }); destroy(b); destroy(e); shake(5); score++; scoreLabel.text = `Score: ${score}`;
                if (score >= SCORE_TO_WIN) { music.stop(); go("win"); }
            });
        });

        scene("lose", (score) => {
            add([ text("ACCESS DENIED", { size: 64, font: "orbitron" }), pos(center()), origin("center"), color(241, 91, 181) ]);
            add([ text(`You scored: ${score}. Try Again.`, { size: 28, font: "orbitron" }), pos(center().x, center().y + 60), origin("center") ]);
            onMousePress(() => go("game"));
        });

        scene("win", () => {
            play("win-sound");
            renderFinalPage();
        });
        
        // After defining everything, start the game
        go("game");
        isGameInitialized = true;
    }

    // --- Page Rendering Logic ---
    function renderLandingPage() {
        app.innerHTML = `
            <div class="content-container">
                <h1>GEN AI ARCADE</h1>
                <p>The Future of AI and its Real-World Impact</p>
                <div class="event-details">
                    <div class="detail-item"><h3>Speaker</h3><p>Aditya Rane (AI Consultant @ Google)</p></div>
                    <div class="detail-item"><h3>Date & Time</h3><p>October 28, 2023 @ 6:00 PM</p></div>
                    <div class="detail-item"><h3>Venue</h3><p>VIT Pune Auditorium</p></div>
                </div>
                <button id="begin-challenge-btn" class="cta-button">Begin the Challenge 🌀</button>
            </div>
        `;
        document.getElementById('begin-challenge-btn').addEventListener('click', renderGamePage);
    }

    function renderGamePage() {
        // Step 1: Create the container DIV on the page
        app.innerHTML = `<div class="content-container game-container"></div>`;
        // Step 2: NOW that the container exists, initialize the game inside it
        initializeAndRunGame();
    }

    function renderFinalPage() {
        // Destroy the game canvas before showing the final page
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.remove();

        app.innerHTML = `
            <div class="content-container">
                <h2>✅ Access Unlocked!</h2>
                <p>Congratulations! You have proven your worth.</p>
                <div class="links-grid">
                    <a href="https://your-whatsapp-group-link.com" target="_blank" class="link-card"><h3>Join WhatsApp Group</h3><p>For live event updates</p></a>
                    <a href="https://your-google-form-link.com" target="_blank" class="link-card"><h3>Official Registration</h3><p>Confirm your spot now!</p></a>
                </div>
                <div class="socials">
                    <h3>Follow MLSC VIT Pune</h3>
                    <div class="social-icons">
                        <a href="https://linkedin.com/company/mlsc-vit-pune" target="_blank">LinkedIn</a>
                        <a href="https://instagram.com/mlsc_vitpune" target="_blank">Instagram</a>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Start the Application ---
    tsParticles.load("particles-js", { /* Particle config */
        fpsLimit: 60, interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true, }, modes: { repulse: { distance: 100, duration: 0.4 }, }, }, particles: { color: { value: "#9b5de5" }, links: { color: "#f15bb5", distance: 150, enable: true, opacity: 0.5, width: 1 }, collisions: { enable: true }, move: { direction: "none", enable: true, outMode: "bounce", random: false, speed: 2, straight: false }, number: { density: { enable: true, area: 800 }, value: 80 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { random: true, value: 5 }, }, detectRetina: true,
    });
    
    renderLandingPage();
});