function initTimeTapGame() {
    const playBtn = document.getElementById("playBtn");
    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const timerCircle = document.getElementById("timerCircle");
    const countdown = document.getElementById("countdown");
    const scoreText = document.getElementById("score");
    const comboText = document.getElementById("combo");
    const specialMessage = document.getElementById("specialMessage");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScore = document.getElementById("finalScore");
    const finalRecord = document.getElementById("finalRecord");
    const finalCombo = document.getElementById("finalCombo");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const homeBtn = document.getElementById("homeBtn");
    const newRecordMessage = document.getElementById("newRecordMessage");

    const greenSound = document.getElementById("greenSound");
    const redSound = document.getElementById("redSound");
    const goldSound = document.getElementById("goldSound");
    const epicSound = document.getElementById("epicSound");
    const threeSound = document.getElementById("threeSound");
    const twoSound = document.getElementById("twoSound");
    const oneSound = document.getElementById("oneSound");
    const goSound = document.getElementById("goSound");
    const bgMusic = document.getElementById("bgMusic");

    const isDesktop = window.innerWidth >= 768;
    let time = isDesktop ? 3.0 : 2.5;
    if (timerCircle) {
        timerCircle.textContent = time.toFixed(1);
    }

    let score = 0;
    let comboCount = 0;
    let maxComboRun = 0;
    let running = false;
    let doubleBonus = false;
    let isFrozen = false;
    let freezeTimeout = null;
    let isAnimatingRecord = false;

    let timerInterval = null;
    let spawnInterval = null;
    let messageTimeout = null;
    let panicTickCounter = 0;

    let record = Number(localStorage.getItem("record")) || 0;
    let bestCombo = Number(localStorage.getItem("bestCombo")) || 0;

    const recordEl = document.getElementById("record");
    const bestComboEl = document.getElementById("bestComboHome");
    if (recordEl) recordEl.textContent = record.toLocaleString("it-IT");
    if (bestComboEl) bestComboEl.textContent = bestCombo.toLocaleString("it-IT");

    /* --- GESTIONE AUDIO / MUTO --- */
    let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    const audioToggleBtn = document.getElementById("audioToggleBtn");

    function updateAudioButton() {
        if (!audioToggleBtn) return;
        audioToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
        if (soundEnabled) {
            audioToggleBtn.classList.remove("muted");
        } else {
            audioToggleBtn.classList.add("muted");
        }
    }
    updateAudioButton();

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem("soundEnabled", soundEnabled);
            updateAudioButton();
            if (soundEnabled) {
                playSynthEffect("click");
            } else if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        });
    }

    const activeButtons = [];
    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const symbols = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→"
    };

    let buttonDuration = isDesktop ? 1850 : 1350;
    let spawnDelay = isDesktop ? 240 : 260;

    let audioCtx = null;

    function initAudio() {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!audioCtx) {
                audioCtx = new AudioCtx();
            }
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }
            const buffer = audioCtx.createBuffer(1, 1, 22050);
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);
        } catch (e) {}
    }

    document.addEventListener("touchstart", initAudio, { once: true });
    document.addEventListener("pointerdown", initAudio, { once: true });

    function playTone(freq, endFreq, type, startTime, duration, vol) {
        if (!audioCtx || !soundEnabled) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        if (endFreq !== null) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
        }
        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.008, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playSynthEffect(type) {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;

        if (type === "green") {
            const step = Math.min(comboCount * 10, 160);
            playTone(260 + step, 440 + step, "sine", now, 0.11, 0.55);
            playTone(150 + step * 0.4, 90, "triangle", now, 0.08, 0.35);
        } else if (type === "red") {
            playTone(190, 75, "sawtooth", now, 0.22, 0.45);
        } else if (type === "gold") {
            const goldNotes = [440, 554.37, 659.25, 880];
            goldNotes.forEach((f, i) => {
                playTone(f, null, "sine", now + i * 0.045, 0.16, 0.42);
            });
        } else if (type === "ice") {
            const iceNotes = [880, 1174.66, 1318.51, 1760];
            iceNotes.forEach((f, i) => {
                playTone(f, null, "sine", now + i * 0.04, 0.22, 0.35);
            });
        } else if (type === "bomb") {
            playTone(140, 35, "sawtooth", now, 0.45, 0.65);
            playTone(100, 28, "square", now, 0.45, 0.55);
        } else if (type === "epic") {
            const epicNotes = [392, 493.88, 587.33, 783.99];
            epicNotes.forEach((f) => {
                playTone(f, null, "triangle", now, 0.3, 0.32);
            });
        } else if (type === "milestone") {
            const mileNotes = [440, 587.33, 783.99];
            mileNotes.forEach((f, i) => {
                playTone(f, null, "sine", now + i * 0.055, 0.18, 0.28);
            });
        } else if (type === "newrecord") {
            const recNotes = [440, 554.37, 659.25, 880, 659.25, 880];
            recNotes.forEach((f, i) => {
                playTone(f, null, "triangle", now + i * 0.085, 0.22, 0.38);
            });
        } else if (type === "tick") {
            playTone(620, null, "sine", now, 0.045, 0.2);
        } else if (type === "click") {
            playTone(420, 640, "sine", now, 0.075, 0.32);
        } else if (type === "beep") {
            playTone(392, null, "sine", now, 0.11, 0.32);
        } else if (type === "go") {
            playTone(659.25, null, "sine", now, 0.22, 0.42);
        } else if (type === "gameover") {
            playTone(293.66, null, "sawtooth", now, 0.24, 0.28);
            playTone(277.18, null, "sawtooth", now + 0.26, 0.24, 0.28);
            playTone(261.63, null, "sawtooth", now + 0.52, 0.24, 0.28);
            playTone(246.94, 190, "sawtooth", now + 0.78, 0.7, 0.28);
        }
    }

    function spawnFloatingText(x, y, text, color) {
        const el = document.createElement("div");
        el.className = "floating-text";
        el.textContent = text;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.color = color;
        game.appendChild(el);
        setTimeout(() => el.remove(), 700);
    }

    function triggerScreenShake() {
        game.classList.remove("screen-shake");
        void game.offsetWidth;
        game.classList.add("screen-shake");
    }

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            playSynthEffect("click");
            startCountdown();
        });
    }

    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            if (!isAnimatingRecord) {
                playSynthEffect("click");
                setTimeout(() => {
                    location.reload();
                }, 90);
            }
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            if (!isAnimatingRecord) {
                playSynthEffect("click");
                setTimeout(() => {
                    location.reload();
                }, 90);
            }
        });
    }

    function playAudio(sound, synthFallback) {
        if (!soundEnabled) return;
        if (synthFallback) {
            playSynthEffect(synthFallback);
        }
        if (!sound) return;
        sound.currentTime = 0;
        sound.volume = 1;
        sound.play().catch(() => {});
    }

    function speakEnglish(phrase, rate = 1.05, pitch = 1.08) {
        if (!soundEnabled) return;
        try {
            if (!("speechSynthesis" in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.lang = "en-US";
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = 1;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoices = [
                "Google US English",
                "Microsoft Aria",
                "Microsoft Jenny",
                "Samantha",
                "Karen",
"Serena",
"Natural"
];
const selectedVoice =
voices.find(v => v.lang.startsWith("en") && preferredVoices.some(name => v.name.includes(name))) ||
voices.find(v => v.lang === "en-US") ||
voices.find(v => v.lang.startsWith("en"));
if (selectedVoice) {
utterance.voice = selectedVoice;
}
window.speechSynthesis.speak(utterance);
} catch (e) {}
}
if ("speechSynthesis" in window) {
window.speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = () => {
window.speechSynthesis.getVoices();
};
}
function triggerCountdownStep(text, soundObj, synthType, spoken, pitch) {
countdown.textContent = text;
countdown.classList.remove("countdown-pop");
void countdown.offsetWidth;
countdown.classList.add("countdown-pop");
playAudio(soundObj, synthType);
speakEnglish(spoken, 1.08, pitch);
}
function startCountdown() {
initAudio();
menu.style.display = "none";
countdown.style.display = "block";
triggerCountdownStep("3", threeSound, "beep", "Three!", 1.0);
setTimeout(() => {
triggerCountdownStep("2", twoSound, "beep", "Two!", 1.05);
}, 1000);
setTimeout(() => {
triggerCountdownStep("1", oneSound, "beep", "One!", 1.1);
}, 2000);
setTimeout(() => {
triggerCountdownStep("GO!", goSound, "go", "Go!", 1.2);
}, 3000);
setTimeout(() => {
countdown.style.display = "none";
game.style.display = "block";
if (bgMusic && soundEnabled) {
bgMusic.currentTime = 0;
bgMusic.volume = 0.4;
bgMusic.play().catch(() => {});
}
startGame();
}, 4000);
}
function updateTimerVisuals() {
if (isFrozen) {
timerCircle.style.background = "radial-gradient(circle at 30% 30%, #ffffff 0%, #7dd3fc 45%, #0284c7 100%)";
timerCircle.style.boxShadow = "inset 0 8px 0 rgba(255, 255, 255, 0.7), 0 11px 0 #0369a1, 0 0 32px rgba(56, 189, 248, 0.95)";
timerCircle.classList.remove("timer-panic");
return;
}
if (time <= 1.0) {
timerCircle.style.background = "radial-gradient(circle at 30% 30%, #fecaca 0%, #ef4444 50%, #b91c1c 100%)";
timerCircle.style.boxShadow = "inset 0 8px 0 rgba(255, 255, 255, 0.35), 0 11px 0 #7f1d1d, 0 0 28px rgba(239, 68, 68, 0.9)";
timerCircle.classList.add("timer-panic");
} else {
timerCircle.style.background = "radial-gradient(circle at 30% 30%, #bfdbfe 0%, #3b82f6 50%, #1d4ed8 100%)";
timerCircle.style.boxShadow = "inset 0 6px 0 rgba(255, 255, 255, 0.32), 0 11px 0 #1e3a8a, 0 20px 30px rgba(0, 0, 0, 0.45)";
timerCircle.classList.remove("timer-panic");
}
}
function startGame() {
running = true;
timerInterval = setInterval(() => {
if (!running) return;
if (!isFrozen) {
time = Math.max(0, Number((time - 0.1).toFixed(2)));
timerCircle.textContent = time.toFixed(1);
if (time <= 1.0) {
panicTickCounter++;
if (panicTickCounter % 2 === 0 && time > 0) {
playSynthEffect("tick");
}
} else {
panicTickCounter = 0;
}
}
updateTimerVisuals();
if (time <= 0) {
gameOver();
}
}, 100);
createButton();
spawnInterval = setInterval(() => {
if (!running) return;
if (activeButtons.length < 4) {
createButton();
}
}, spawnDelay);
}
function createButton() {
const freeArrows = arrows.filter(a => !activeButtons.some(b => b.dataset.key === a));
if (freeArrows.length === 0) return;
const greens = activeButtons.filter(b => b.dataset.action === "green").length;
const reds = activeButtons.filter(b => b.dataset.action === "red").length;
const hasSpecial = activeButtons.some(b => ["gold", "ice", "bomb"].includes(b.dataset.action));
let type = "green";
if (greens >= 3) {
type = "red";
} else if (reds >= 2) {
type = "green";
} else if (greens === 2 && reds === 0) {
type = "red";
} else {
type = Math.random() < 0.6 ? "green" : "red";
}
/* --- PALLINI SPECIALI RARI --- */
if (!hasSpecial && greens > 0) {
const rand = Math.random();
if (rand < 0.025) {
// Bomba molto rara (2.5% di probabilità)
type = "bomb";
} else if (rand < 0.065 && !isFrozen) {
// Ghiaccio raro (4% di probabilità)
type = "ice";
} else if (rand < 0.085 && time < 2.5) {
// Oro x2 raro
type = "gold";
}
}
const btn = document.createElement("button");
btn.classList.add("button-circle");
const key = freeArrows[Math.floor(
Math.random() * freeArrows.length)];
let valueText = "";
if (type === "green") {
btn.classList.add("green");
const greenOptions = isDesktop ? [0.400, 0.500, 0.550] : [0.300, 0.350, 0.400];
const value = greenOptions[Math.floor(Math.random() * greenOptions.length)];
btn.dataset.value = value;
valueText = "+" + value.toFixed(3);
} else if (type === "red") {
btn.classList.add("red");
const redOptions = [0.4, 0.5, 0.6, 0.7];
const value = redOptions[Math.floor(Math.random() * redOptions.length)];
btn.dataset.value = value;
valueText = "-" + value.toFixed(1);
} else if (type === "ice") {
btn.classList.add("ice");
valueText = "❄️3s";
} else if (type === "bomb") {
btn.classList.add("bomb");
valueText = "💣";
} else {
btn.classList.add("gold");
valueText = "x2";
}
btn.dataset.key = key;
btn.dataset.action = type;
if (isDesktop) {
btn.innerHTML = '' + symbols[key] + '' + valueText + '';
} else {
btn.innerHTML = '' + valueText + '';
}
const btnSize = isDesktop ? 165 : 108;
const minCenterDist = isDesktop ? 245 : 155;
const minBtnDist = isDesktop ? 195 : 128;
const margin = 20;
let x = 0;
let y = 0;
let valid = false;
let attempts = 0;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
while (!valid && attempts < 100) {
attempts++;
x = margin + Math.random() * (window.innerWidth - btnSize - margin * 2);
y = 95 + Math.random() * (window.innerHeight - btnSize - 115);
valid = true;
const distCenter = Math.hypot((x + btnSize / 2) - centerX, (y + btnSize / 2) - centerY);
if (distCenter < minCenterDist) {
valid = false;
}
if (valid) {
for (const existing of activeButtons) {
const ex = parseFloat(existing.style.left);
const ey = parseFloat(existing.style.top);
if (Math.hypot(x - ex, y - ey) < minBtnDist) {
valid = false;
break;
}
}
}
}
if (!valid) return;
btn.style.left = x + "px";
btn.style.top = y + "px";
btn.onpointerdown = (e) => {
e.preventDefault();
activateButton(btn);
};
game.appendChild(btn);
activeButtons.push(btn);
setTimeout(() => {
removeButton(btn);
}, buttonDuration);
}
function spawnStars(x, y, mode) {
let count = 9;
let icons = ["✨", "⭐"];
if (mode === "gold") {
count = 18;
icons = ["⭐", "✨", "🌟", "💫"];
} else if (mode === "ice") {
count = 16;
icons = ["❄️", "💎", "✨"];
} else if (mode === "bomb") {
count = 20;
icons = ["💥", "🔥", "💣"];
}
for (let i = 0; i < count; i++) {
const star = document.createElement("span");
star.className = "star-particle";
star.textContent = icons[Math.floor(Math.random() * icons.length)];
const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
const radius = 14 + Math.random() * 32;
star.style.left = x + "px";
star.style.top = y + "px";
star.style.setProperty("--dx", (Math.cos(angle) * radius) + "px");
star.style.setProperty("--dy", (Math.sin(angle) * radius) + "px");
game.appendChild(star);
setTimeout(() => {
star.remove();
}, 550);
}
}
function activateButton(btn) {
if (!btn.parentNode || !running) return;
const action = btn.dataset.action;
const rect = btn.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
if (action === "green") {
const wasCritical = time <= 0.6 && !isFrozen;
const value = Number(btn.dataset.value);
time = Number((time + (doubleBonus ? value * 2 : value)).toFixed(3));
comboCount++;
if (comboCount > maxComboRun) {
maxComboRun = comboCount;
}
const earnedPoints = 100 + comboCount * 20;
score += earnedPoints;
spawnStars(centerX, centerY, "green");
spawnFloatingText(centerX, centerY, "+" + earnedPoints, "#4ade80");
if (wasCritical) {
triggerScreenShake();
playAudio(epicSound, "epic");
showMessage("EPIC SAVE!", "Epic save!");
} else {
playAudio(greenSound, "green");
checkComboMessages();
}
} else if (action === "red") {
triggerScreenShake();
playAudio(redSound, "red");
const value = Number(btn.dataset.value);
time = Number((time - value).toFixed(3));
comboCount = 0;
spawnFloatingText(centerX, centerY, "-" + value.toFixed(1) + "s", "#f87171");
if (time <= 0) {
time = 0;
timerCircle.textContent = "0.0";
removeButton(btn);
gameOver();
return;
}
} else if (action === "ice") {
playSynthEffect("ice");
isFrozen = true;
updateTimerVisuals();
spawnStars(centerX, centerY, "ice");
spawnFloatingText(centerX, centerY, "FREEZE 3s!", "#7dd3fc");
showMessage("FREEZE!", "Freeze!");
clearTimeout(freezeTimeout);
freezeTimeout = setTimeout(() => {
isFrozen = false;
updateTimerVisuals();
}, 3000);
} else if (action === "bomb") {
triggerScreenShake();
playSynthEffect("bomb");
spawnStars(centerX, centerY, "bomb");
spawnFloatingText(centerX, centerY, "BOOM!", "#ef4444");
time = 0;
timerCircle.textContent = "0.0";
removeButton(btn);
gameOver();
return;
} else if (action === "gold") {
playAudio(goldSound, "gold");
doubleBonus = true;
spawnStars(centerX, centerY, "gold");
spawnFloatingText(centerX, centerY, "DOUBLE TIME!", "#facc15");
showMessage("INCREDIBLE!", "Incredible!");
setTimeout(() => {
doubleBonus = false;
}, 2000);
}
timerCircle.textContent = time.toFixed(1);
scoreText.textContent = "SCORE: " + score.toLocaleString("it-IT");
comboText.textContent = "COMBO " + comboCount;
removeButton(btn);
}
function checkComboMessages() {
if (comboCount === 5) {
playSynthEffect("milestone");
showMessage("GREAT!", "Great!");
} else if (comboCount === 10) {
playSynthEffect("milestone");
showMessage("FANTASTIC!", "Fantastic!");
} else if (comboCount === 15) {
playSynthEffect("milestone");
showMessage("AMAZING!", "Amazing!");
} else if (comboCount === 20) {
playSynthEffect("milestone");
showMessage("UNBELIEVABLE!", "Unbelievable!");
} else if (comboCount > 0 && comboCount % 25 === 0) {
playSynthEffect("milestone");
showMessage("LEGENDARY!", "Legendary!");
}
}
function showMessage(text, spokenText = "") {
clearTimeout(messageTimeout);
specialMessage.textContent = text;
specialMessage.style.display = "none";
void specialMessage.offsetWidth;
specialMessage.style.display = "block";
if (spokenText) {
speakEnglish(spokenText, 1.08, 1.12);
}
messageTimeout = setTimeout(() => {
specialMessage.style.display = "none";
}, 1100);
}
function removeButton(btn) {
if (!btn) return;
const index = activeButtons.indexOf(btn);
if (index > -1) {
activeButtons.splice(index, 1);
}
if (btn.parentNode) {
btn.remove();
}
}
function animateScoreCounter(element, targetValue, onComplete) {
let current = 0;
const steps = 45;
const increment = targetValue / steps;
const counter = setInterval(() => {
current += increment;
if (current >= targetValue) {
current = targetValue;
clearInterval(counter);
element.textContent = Math.round(current).toLocaleString("it-IT");
if (onComplete) onComplete();
} else {
element.textContent = Math.round(current).toLocaleString("it-IT");
}
}, 30);
}
function gameOver() {
if (!running) return;
running = false;
isFrozen = false;
clearTimeout(freezeTimeout);
clearInterval(timerInterval);
clearInterval(spawnInterval);
timerCircle.classList.remove("timer-panic");
if (bgMusic) {
bgMusic.pause();
}
while (activeButtons.length > 0) {
const firstBtn = activeButtons.shift();
if (firstBtn && firstBtn.parentNode) {
firstBtn.remove();
}
}
if (maxComboRun > bestCombo) {
bestCombo = maxComboRun;
localStorage.setItem("bestCombo", bestCombo);
}
gameOverScreen.style.display = "flex";
finalScore.textContent = score.toLocaleString("it-IT");
finalCombo.textContent = maxComboRun.toLocaleString("it-IT");
if (score > record && score > 0) {
record = score;
localStorage.setItem("record", record);
newRecordMessage.style.display = "block";
isAnimatingRecord = true;
playSynthEffect("newrecord");
speakEnglish("New record!", 1.05, 1.15);
finalRecord.textContent = "0";
animateScoreCounter(finalRecord, record, () => {
isAnimatingRecord = false;
});
} else {
newRecordMessage.style.display = "none";
playSynthEffect("gameover");
speakEnglish("Game over!", 0.95, 0.95);
finalRecord.textContent = record.toLocaleString("it-IT");
}
}
document.addEventListener("keydown", (event) => {
if (!running) return;
const target = activeButtons.find(b => b.dataset.key === event.key);
if (target) {
activateButton(target);
}
});
}
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initTimeTapGame);
} else {
initTimeTapGame();
}