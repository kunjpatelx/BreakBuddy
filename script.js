const breakSuggestions = {
    relaxation: [
        "Take 10 slow, deep breaths with your eyes closed.",
        "Listen to a calming song for a minute.",
        "Imagine you’re on a quiet beach—just chill.",
        "Rest your head on your desk for 30 seconds."
    ],
    physical: [
        "Stretch your arms overhead for 30 seconds.",
        "Do 5 quick jumping jacks by your desk.",
        "Walk to the nearest window and back.",
        "Roll your shoulders 10 times."
    ],
    mental: [
        "Jot down three things you’re grateful for.",
        "Doodle a silly shape on some paper.",
        "Think of a fun riddle and guess the answer.",
        "Count backward from 20 in your head."
    ]
};

const techniques = {
    "pomodoro": { work: 25, break: 5 },
    "52-17": { work: 52, break: 17 },
    "90-minute": { work: 90, break: 20 },
    "20-20-20": { work: 20, break: 0.33 }
};

let timerInterval = null;
let isPaused = false;
let timeLeft = 0;
let isBreak = false;

function toggleMode() {
    const body = document.body;
    const button = document.getElementById("modeSwitch");
    if (body.classList.contains("light")) {
        body.classList.remove("light");
        body.classList.add("dark");
        button.textContent = "Light Mode";
    } else {
        body.classList.remove("dark");
        body.classList.add("light");
        button.textContent = "Dark Mode";
    }
}

document.body.classList.add("light");

function updateCustomFields() {
    const technique = document.getElementById("technique").value;
    const customFields = document.querySelector(".custom-fields");
    customFields.style.display = technique === "custom" ? "block" : "none";
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    const technique = document.getElementById("technique").value;
    const breakType = document.getElementById("breakType").value;
    let workTime, breakTime;

    if (technique === "custom") {
        workTime = parseFloat(document.getElementById("workTime").value) * 60;
        breakTime = parseFloat(document.getElementById("breakTime").value);
    } else {
        workTime = techniques[technique].work * 60;
        breakTime = techniques[technique].break;
    }

    if (workTime < 1 || breakTime < 0.1) {
        alert("Please enter valid times!");
        return;
    }

    timeLeft = workTime;
    isBreak = false;
    runTimer(workTime, breakTime, breakType);
}

function pauseTimer() {
    if (!timerInterval) return;
    if (isPaused) {
        runTimer(timeLeft, null, null, true);
        document.getElementById("pauseBtn").textContent = "Pause";
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isPaused = !isPaused;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    timeLeft = 0;
    isBreak = false;
    document.getElementById("timerDisplay").textContent = "Select a technique to begin.";
    document.getElementById("status").textContent = "Ready to start your workday?";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("resetBtn").disabled = true;
    document.getElementById("feelingCheck").style.display = "none";
}

function runTimer(workTime, breakTime, breakType, resume = false) {
    const status = document.getElementById("status");
    const timerDisplay = document.getElementById("timerDisplay");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    if (!resume) {
        status.textContent = `Working for ${Math.floor(workTime / 60)} minutes...`;
    }

    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = Math.round(timeLeft % 60);
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds} ${isBreak ? "break" : "work"} remaining`;
        
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            if (!isBreak) {
                let suggestion = breakSuggestions[breakType][Math.floor(Math.random() * breakSuggestions[breakType].length)];
                let breakText = breakTime < 1 ? `${Math.round(breakTime * 60)} seconds` : `${breakTime} minutes`;
                showPopup(`Time for a ${breakText} break! ${suggestion}`);
                status.textContent = "Break time. Relax and recharge.";
                timeLeft = breakTime * 60;
                isBreak = true;
                runTimer(breakTime * 60, breakTime, breakType);
            } else {
                status.textContent = "Break’s over! How do you feel?";
                timerDisplay.textContent = "Ready for your next session.";
                document.getElementById("feelingCheck").style.display = "block";
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                resetBtn.disabled = true;
            }
        }
    }, 1000);
}

function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 7000);
}

function logFeeling(feeling) {
    console.log(`User felt: ${feeling}`); // Placeholder—could store or display later
    document.getElementById("feelingCheck").style.display = "none";
    document.getElementById("status").textContent = `Glad you’re feeling ${feeling.toLowerCase()}! Ready for more?`;
}
