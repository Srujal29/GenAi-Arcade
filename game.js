// game.js

function startGame(onWinCallback) {
    // Initialize Kaboom and get the instance 'k'
    const k = kaboom({
        global: false, // This is the key
        width: 800,
        height: 600,
        background: [0, 0, 0, 0],
        canvas: document.querySelector("#game-canvas"),
    });

    // THIS IS THE FIX: Destructure all required functions from the 'k' instance
    const {
        loadFont, loadSound, scene, play, add, pos, polygon, vec2, origin, color, area,
        onKeyDown, onKeyPress, loop, rand, rect, move, UP, DOWN, cleanup, text,
        shake, wait, destroy, onCollide, go, center, width, height
    } = k;

    // Now we can use the functions directly without the 'k.' prefix

    loadFont("orbitron", "https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2");
    loadSound("music", "https://kaboomjs.com/sounds/detune.mp3");
    loadSound("laser", "https://kaboomjs.com/sounds/laser.mp3");
    loadSound("explosion", "https://kaboomjs.com/sounds/explosion.mp3");
    loadSound("win-sound", "https://kaboomjs.com/sounds/powerup.mp3");

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
        onWinCallback();
    });

    go("game");
}