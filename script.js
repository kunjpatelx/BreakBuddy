// Break suggestions
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

// Technique timings (in minutes)
const techniques = {
    "pomodoro": { work: 25, break: 5 },
    "52-17": { work: 52, break: 17 },
    "90-minute": { work: 90, break: 20 },
    "20-20-20": { work: 20, break: 0.33 } // 20 seconds
};

let timerInterval = null;

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

function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Clear any existing timer

    let technique = document.getElementById("technique").value;
    let breakType = document.getElementById("breakType").value;
    let workTime = techniques[technique].work * 60; // Convert to seconds
    let breakTime = techniques[technique].break;

    let status = document.getElementById("status");
    let timerDisplay = document.getElementById("timerDisplay");
    status.textContent = `Working for ${techniques[technique].work} minutes...`;

    // Countdown timer
    timerInterval = setInterval(() => {
        let minutes = Math.floor(workTime / 60);
        let seconds = workTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds} remaining`;
        workTime--;
        if (workTime < 0) {
            clearInterval(timerInterval);
            let suggestion = breakSuggestions[breakType][Math.floor(Math.random() * breakSuggestions[breakType].length)];
            let breakText = technique === "20-20-20" ? "20 seconds" : `${breakTime} minutes`;
            showPopup(`Time for a ${breakText} break! ${suggestion}`);
            status.textContent = "Break time. Relax and recharge.";
            timerDisplay.textContent = "Break in progress...";
        }
    }, 1000);
}

function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
}