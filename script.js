console.log("BreakBuddy loaded - Hack Your Burnout!");

// Matrix Background Animation
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = `${fontSize}px 'Courier New'`;

    for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

let frameCount = 0;
function animateCanvas() {
    draw();
    frameCount++;
    if (frameCount === 300) {
        canvas.style.transition = "opacity 2s";
        canvas.style.opacity = "0.2";
    }
    requestAnimationFrame(animateCanvas);
}

animateCanvas();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(1);
});

// GSAP Animations
gsap.from("#title", { opacity: 0, y: -50, duration: 1, delay: 0.5, ease: "power2.out" });
gsap.from("#tagline", { opacity: 0, y: 20, duration: 1, delay: 1, ease: "power2.out" });

gsap.registerPlugin(ScrollTrigger);
gsap.from(".timer-controls", {
    scrollTrigger: { trigger: ".timer-controls", start: "top 80%" },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out"
});

// Timer Logic
let timeLeft = 0;
let timerInterval = null;
const timerDisplay = document.getElementById("timer");
const toggleBtn = document.getElementById("toggle-btn");
const resetBtn = document.getElementById("reset-btn");
const progressBar = document.getElementById("progress-bar");
const breakSound = document.getElementById("breakSound");
let totalTime = 0;
let isRunning = false;

document.querySelectorAll(".break-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (isRunning) return; // Prevent changes while running
        const minutes = parseInt(btn.getAttribute("data-minutes"));
        timeLeft = minutes * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        progressBar.style.width = "0%"; // Reset progress bar
    });

    // GSAP Hover Effect
    btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.1, duration: 0.3, ease: "power1.out" });
    });
    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
});

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (timeLeft <= 0) return; // No time set
    if (!isRunning) {
        isRunning = true;
        toggleBtn.textContent = "Pause";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            const progress = (totalTime - timeLeft) / totalTime * 100;

            // Anime.js Progress Bar Animation
            anime({
                targets: progressBar,
                width: `${progress}%`,
                duration: 1000,
                easing: "linear"
            });

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                toggleBtn.textContent = "Start";
                breakSound.play(); // Play sound when break ends
                alert("Break’s over, player! Back to the grind!");
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        toggleBtn.textContent = "Start";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 0;
    totalTime = 0;
    updateTimerDisplay();
    progressBar.style.width = "0%";
    toggleBtn.textContent = "Start";
}

toggleBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// GSAP Hover Effect for Toggle and Reset Buttons
[toggleBtn, resetBtn].forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.1, duration: 0.3, ease: "power1.out" });
    });
    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
});
