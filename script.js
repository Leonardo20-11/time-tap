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

let time = 2.5;
let score = 0;
let comboCount = 0;
let maxComboRun = 0;
let running = false;
let doubleBonus = false;
let isAnimatingRecord = false;

let timerInterval = null;
let spawnInterval = null;
let messageTimeout = null;
let panicTickCounter = 0;

let record = Number(localStorage.getItem("record")) || 0;
let bestCombo = Number(localStorage.getItem("bestCombo")) || 0;

document.getElementById("record").textContent = record.toLocaleString("it-IT");
document.getElementById("bestComboHome").textContent = bestCombo.toLocaleString("it-IT");

const activeButtons = [];
const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const symbols = {
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→"
};

const isDesktop = window.innerWidth > 900;
let buttonDuration = isDesktop ? 1850 : 1350;
let spawnDelay = isDesktop ? 240 : 260;

let audioCtx = null;

function initAudio() {
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
}

document.addEventListener("touchstart", initAudio, { once: true });
document.addEventListener("pointerdown", initAudio, { once: true });

function playTone(freq, endFreq, type, startTime, duration, vol) {
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
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    if (type === "green") {
        const boost = Math.min(comboCount * 28, 520);
        playTone(520 + boost, 1040 + boost, "triangle", now, 0.13, 0.55);
    } else if (type === "red") {
        playTone(210, 80, "sawtooth", now, 0.24, 0.5);
    } else if (type === "gold") {
        const goldNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        goldNotes.forEach((f, i) => {
            playTone(f, null, "triangle", now + i * 0.05, 0.18, 0.45);
        });
    } else if (type === "epic") {
        const epicNotes = [440, 554.37, 659.25, 880];
        epicNotes.forEach((f) => {
            playTone(f, null, "triangle", now, 0.35, 0.35);
        });
    } else if (type === "milestone") {
        const mileNotes = [587.33, 783.99, 1046.5];
        mileNotes.forEach((f, i) => {
            playTone(f, null, "sine", now + i * 0.06, 0.2, 0.3);
        });
    } else if (type === "newrecord") {
        const recNotes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        recNotes.forEach((f, i) => {
            playTone(f, null, "triangle", now + i * 0.09, 0.25, 0.4);
        });
    } else if (type === "tick") {
        playTone(750, null, "sine", now, 0.05, 0.22);
    } else if (type === "click") {
        playTone(660, 990, "sine", now, 0.08, 0.35);
    } else if (type === "beep") {
        playTone(440, null, "sine", now, 0.12, 0.35);
    } else if (type === "go") {
        playTone(880, null, "sine", now, 0.25, 0.45);
    } else if (type === "gameover") {
        playTone(311.13, null, "sawtooth", now, 0.26, 0.32);
        playTone(293.66, null, "sawtooth", now + 0.28, 0.26, 0.32);
        playTone(277.18, null, "sawtooth", now + 0.56, 0.26, 0.32);
        playTone(261.63, 210, "sawtooth", now + 0.84, 0.75, 0.32);
    }
}

playBtn.onclick = () => {
    playSynthEffect("click");
    startCountdown();
};

playAgainBtn.onclick = () => {
    if (!isAnimatingRecord) {
        playSynthEffect("click");
        setTimeout(() => {
            location.reload();
        }, 90);
    }
};

homeBtn.onclick = () => {
    if (!isAnimatingRecord) {
        playSynthEffect("click");
        setTimeout(() => {
            location.reload();
        }, 90);
    }
};

function playAudio(sound, synthFallback) {
    if (synthFallback) {
        playSynthEffect(synthFallback);
    }
    if (!sound) return;
    sound.currentTime = 0;
    sound.volume = 1;
    sound.play().catch(() => {});
}

function speakEnglish(phrase, rate = 1.0, pitch = 0.85) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const maleNames = ["Daniel", "Alex", "David", "Guy", "Arthur", "Male", "Mark", "James"];
    const maleVoice =
        voices.find(v => v.lang.startsWith("en") && maleNames.some(n => v.name.includes(n))) ||
        voices.find(v => v.lang.startsWith("en-GB")) ||
        voices.find(v => v.lang.startsWith("en"));

    if (maleVoice) {
        utterance.voice = maleVoice;
    }
    window.speechSynthesis.speak(utterance);
}

if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
}

function triggerCountdownStep(text, soundObj, synthType, spoken, pitch) {
    countdown.textContent = text;
    countdown.classList.remove("countdown-pop");
    void countdown.offsetWidth;
    countdown.classList.add("countdown-pop");
    playAudio(soundObj, synthType);
    speakEnglish(spoken, 1.05, pitch);
}

function startCountdown() {
    initAudio();
    menu.style.display = "none";
    countdown.style.display = "block";

    triggerCountdownStep("3", threeSound, "beep", "Three!", 0.85);
    setTimeout(() => {
        triggerCountdownStep("2", twoSound, "beep", "Two!", 0.9);
    }, 1000);
    setTimeout(() => {
        triggerCountdownStep("1", oneSound, "beep", "One!", 0.95);
    }, 2000);
    setTimeout(() => {
        triggerCountdownStep("GO!", goSound, "go", "Go!", 1.05);
    }, 3000);

    setTimeout(() => {
        countdown.style.display = "none";
        game.style.display = "block";
        if (bgMusic) {
            bgMusic.currentTime = 0;
            bgMusic.volume = 0.4;
            bgMusic.play().catch(() => {});
        }
        startGame();
    }, 4000);
}
function startGame() {
    running = true;

    timerInterval = setInterval(() => {
        if (!running) return;

        time = Math.max(0, Number((time - 0.1).toFixed(2)));
        timerCircle.textContent = time.toFixed(1);

        if (time <= 1.0) {
            timerCircle.style.background = "radial-gradient(circle at 30% 30%, #fecaca 0%, #ef4444 50%, #b91c1c 100%)";
            timerCircle.style.boxShadow = "inset 0 8px 0 rgba(255, 255, 255, 0.45), 0 11px 0 #7f1d1d, 0 0 28px rgba(239, 68, 68, 0.9)";
            timerCircle.classList.add("timer-panic");

            panicTickCounter++;
            if (panicTickCounter % 2 === 0 && time > 0) {
                playSynthEffect("tick");
            }
        } else {
            timerCircle.style.background = "radial-gradient(circle at 30% 30%, #ffffff 0%, #60a5fa 45%, #1d4ed8 100%)";
            timerCircle.style.boxShadow = "inset 0 8px 0 rgba(255, 255, 255, 0.55), 0 11px 0 #1e3a8a, 0 20px 30px rgba(0, 0, 0, 0.45)";
            timerCircle.classList.remove("timer-panic");
            panicTickCounter = 0;
        }

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

    if (time < 2.5 && greens > 0 && Math.random() < 0.015) {
        type = "gold";
    }

    const btn = document.createElement("button");
    btn.classList.add("button-circle");

    const key = freeArrows[Math.floor(Math.random() * freeArrows.length)];
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
    } else {
        btn.classList.add("gold");
        valueText = "x2";
    }

    btn.dataset.key = key;
    btn.dataset.action = type;
    btn.innerHTML = `<div class="arrow">${symbols[key]}</div><div class="value">${valueText}</div>`;

    const btnSize = isDesktop ? 150 : 96;
    const minCenterDist = isDesktop ? 230 : 155;
    const minBtnDist = isDesktop ? 185 : 118;
    const margin = 22;
    let x = 0;
    let y = 0;
    let valid = false;
    let attempts = 0;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    while (!valid && attempts < 90) {
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

function spawnStars(x, y, isGold) {
    const count = isGold ? 18 : 9;
    const icons = isGold ? ["⭐", "✨", "🌟", "💫"] : ["✨", "⭐"];

    for (let i = 0; i < count; i++) {
        const star = document.createElement("span");
        star.className = "star-particle";
        star.textContent = icons[Math.floor(Math.random() * icons.length)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
        const radius = 12 + Math.random() * 26;
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
        const wasCritical = time <= 0.6;
        const value = Number(btn.dataset.value);

        time = Number((time + (doubleBonus ? value * 2 : value)).toFixed(3));
        comboCount++;
        if (comboCount > maxComboRun) {
            maxComboRun = comboCount;
        }
        score += 100 + comboCount * 20;

        spawnStars(centerX, centerY, false);

        if (wasCritical) {
            playAudio(epicSound, "epic");
            showMessage("EPIC SAVE!", "Epic save!");
        } else {
            playAudio(greenSound, "green");
            checkComboMessages();
        }
    } else if (action === "red") {
        playAudio(redSound, "red");
        const value = Number(btn.dataset.value);
        time = Number((time - value).toFixed(3));
        comboCount = 0;

        if (time <= 0) {
            time = 0;
            timerCircle.textContent = "0.0";
            removeButton(btn);
            gameOver();
            return;
        }
    } else if (action === "gold") {
        playAudio(goldSound, "gold");
        doubleBonus = true;
        spawnStars(centerX, centerY, true);
        showMessage("INCREDIBLE!", "Incredible!");
        setTimeout(() => {
            doubleBonus = false;
        }, 5000);
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
        speakEnglish(spokenText, 1.05, 0.9);
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
        speakEnglish("New record!", 1.0, 0.9);

        finalRecord.textContent = "0";
animateScoreCounter(finalRecord, record, () => {
isAnimatingRecord = false;
});
} else {
newRecordMessage.style.display = "none";
playSynthEffect("gameover");
speakEnglish("Game over!", 0.9, 0.7);
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