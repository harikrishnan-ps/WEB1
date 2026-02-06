// Elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const messageText = document.getElementById('message-text');
const heroEmoji = document.getElementById('hero-emoji');
const celebrationOverlay = document.getElementById('celebration-overlay');
const confettiCanvas = document.getElementById('confetti-canvas');
const floatingShapes = document.getElementById('floating-shapes');

// State
let noClickCount = 0;
let yesScale = 1;

// Configuration
const messages = [
    "Are you sure?",
    "Really? Think about it.",
    "It'll be so cute!",
    "Pretty please?",
    "Now or never..?",
    "Just say yes!",
    "No way!",
    "Atleast once?",
    "Please?",
    "I'm not giving up!"
];



// Initialize Background Shapes
function initFloatingShapes() {
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');

        // Random size
        const size = Math.random() * 60 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;

        // Random position
        shape.style.left = `${Math.random() * 100}%`;

        // Random animation delay and duration
        shape.style.animationDelay = `${Math.random() * 10}s`;
        shape.style.animationDuration = `${15 + Math.random() * 20}s`;

        floatingShapes.appendChild(shape);
    }
}

initFloatingShapes();

// Interaction Logic
noBtn.addEventListener('click', handleNoClick);

function handleNoClick() {
    noClickCount++;
    updateUI();
}

const CONFIG = {
    growthFactor: 1.35, // Aggressive growth to fill window
    targetClicks: 10
};

function updateUI() {
    // 1. Update Message
    const msgIndex = Math.min(noClickCount - 1, messages.length - 1);
    messageText.textContent = messages[msgIndex];
    messageText.classList.add('visible');



    // 2. Grow Yes Button
    // Exponential growth
    yesScale = Math.pow(CONFIG.growthFactor, noClickCount);
    yesBtn.style.transform = `scale(${yesScale})`;

    // 3. Move No Button (Push Effect)
    // 3. Move No Button (Push Effect)
    const yesBaseWidth = yesBtn.offsetWidth;
    const noBaseWidth = noBtn.offsetWidth;
    const yesBaseHeight = yesBtn.offsetHeight;

    // Shrink No Button
    const noScale = Math.max(0, 1 - (noClickCount * 0.1));

    // Check if mobile (stacked layout)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        // Mobile: Move DOWN
        const yesGrowthBottom = (yesBaseHeight * (yesScale - 1)) / 2;
        // Move down to keep gap + add extra distance
        const moveAmountY = Math.max(0, yesGrowthBottom + (noClickCount * 10));
        noBtn.style.transform = `translate(0, ${moveAmountY}px) scale(${noScale})`;
    } else {
        // Desktop: Move RIGHT
        const yesGrowthRight = (yesBaseWidth * (yesScale - 1)) / 2;
        const noShrinkageLeft = (noBaseWidth * (1 - noScale)) / 2;
        const moveAmountX = Math.max(0, yesGrowthRight - noShrinkageLeft + (noClickCount * 10));
        noBtn.style.transform = `translate(${moveAmountX}px, 0) scale(${noScale})`;
    }

    // 4. (Animation removed to prevent conflict with growth scaling)
    yesBtn.style.animation = 'none';
    yesBtn.offsetHeight; /* trigger reflow */
    yesBtn.style.animation = null;


    // 5. Final State (Fill Screen)
    if (noClickCount >= CONFIG.targetClicks) {
        yesBtn.style.zIndex = 1000;
        // Ensure it covers full screen effectively
        yesBtn.style.position = 'fixed';
        yesBtn.style.top = '0';
        yesBtn.style.left = '0';
        yesBtn.style.width = '100vw';
        yesBtn.style.height = '100vh';
        yesBtn.style.transform = 'none'; // Reset scale, use width/height
        yesBtn.style.borderRadius = '0';
        yesBtn.style.display = 'flex';
        yesBtn.style.justifyContent = 'center';
        yesBtn.style.alignItems = 'center';

        // Hide No button when Yes fills screen
        noBtn.style.display = 'none';
    }

    // Hide No Button if invisible
    if (noScale <= 0) {
        noBtn.style.pointerEvents = 'none';
        noBtn.style.display = 'none';
    }
}

// Celebration Logic
yesBtn.addEventListener('click', () => {
    celebrationOverlay.classList.add('active');

    // Reset Yes button state to prevent it from interfering
    yesBtn.style.transform = 'scale(1)';
    yesBtn.style.display = 'none'; // Hide it completely
    noBtn.style.display = 'none';

    startConfetti();
});


// Confetti Implementation (Simple Canvas)
function startConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff4b8b', '#ff8fab', '#ffd700', '#ffffff', '#64e9ff'];

    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        particles.forEach((p, index) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > confettiCanvas.height) {
                p.y = -10;
                p.x = Math.random() * confettiCanvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
}
