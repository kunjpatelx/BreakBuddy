// DOM Elements
const breakDurationInput = document.getElementById('break-duration');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const timerDisplay = document.querySelector('.timer-display');
const activityText = document.getElementById('activity-text');
const progressRing = document.querySelector('.progress-ring__circle');
const breakCountSpan = document.getElementById('break-count');
const totalTimeSpan = document.getElementById('total-time');
const rewardText = document.getElementById('reward-text');
const notificationsCheckbox = document.getElementById('notifications');
const reminderIntervalInput = document.getElementById('reminder-interval');
const soundCheckbox = document.getElementById('sound');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const notificationSound = document.getElementById('notification-sound');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main > section');

// Timer Variables
let timeLeft = 0;
let totalTime = 0;
let isRunning = false;
let timerInterval = null;
let reminderInterval = null;

// Progress Ring Setup
const radius = progressRing.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

// Activity Suggestions
const activities = {
    physical: ["Stretch your arms", "Take a short walk", "Do a quick yoga pose"],
    mental: ["Practice deep breathing", "Close your eyes for a minute", "Meditate briefly"],
    fun: ["Doodle something silly", "Listen to a song", "Watch a funny video"]
};

// Progress Tracking
let breakCount = parseInt(localStorage.getItem('breakCount')) || 0;
let totalBreakTime = parseInt(localStorage.getItem('totalBreakTime')) || 0;
breakCountSpan.textContent = breakCount;
totalTimeSpan.textContent = totalBreakTime;

// Functions
function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (timeLeft <= 0) return;
    if (!isRunning) {
        isRunning = true;
        startPauseButton.textContent = 'Pause';
        const category = Object.keys(activities)[Math.floor(Math.random() * 3)];
        const activityList = activities[category];
        activityText.textContent = activityList[Math.floor(Math.random() * activityList.length)];
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            const percent = (timeLeft / totalTime) * 100;
            setProgress(percent);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startPauseButton.textContent = 'Start';
                activityText.textContent = 'Break over! Feeling refreshed?';
                breakCount++;
                totalBreakTime += totalTime / 60;
                localStorage.setItem('breakCount', breakCount);
                localStorage.setItem('totalBreakTime', totalBreakTime);
                breakCountSpan.textContent = breakCount;
                totalTimeSpan.textContent = Math.round(totalBreakTime);
                checkRewards();
                if (soundCheckbox.checked) notificationSound.play();
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startPauseButton.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = parseInt(breakDurationInput.value) * 60 || 0;
    totalTime = timeLeft;
    updateTimerDisplay();
    setProgress(100);
    activityText.textContent = 'Press Start for a relaxing activity!';
    startPauseButton.textContent = 'Start';
}

function checkRewards() {
    if (breakCount % 5 === 0) {
        rewardText.textContent = `Great job! You've earned a ${breakCount}-break streak badge!`;
    } else {
        rewardText.textContent = '';
    }
}

function setReminder() {
    if (reminderInterval) clearInterval(reminderInterval);
    if (notificationsCheckbox.checked && Notification.permission === 'granted') {
        const interval = parseInt(reminderIntervalInput.value) * 60 * 1000;
        reminderInterval = setInterval(() => {
            new Notification('BreakBuddy Reminder', { body: 'Time for a break!' });
            if (soundCheckbox.checked) notificationSound.play();
        }, interval);
    }
}

// Event Listeners
breakDurationInput.addEventListener('change', () => {
    if (!isRunning) resetTimer();
});

startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

notificationsCheckbox.addEventListener('change', () => {
    if (notificationsCheckbox.checked && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') setReminder();
        });
    } else {
        setReminder();
    }
});

reminderIntervalInput.addEventListener('change', setReminder);
soundCheckbox.addEventListener('change', setReminder);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        sections.forEach(section => {
            section.classList.toggle('hidden', section.id !== target);
        });
    });
});

// Initial Setup
resetTimer();
if (Notification.permission === 'granted') setReminder();

// Note: Replace notification sound src with a valid URL if needed
