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
let running = false;
let doubleBonus = false;
let isAnimatingRecord = false;

let timerInterval = null;
let spawnInterval = null;
let messageTimeout = null;

let record = Number(localStorage.getItem("record")) || 0;
document.getElementById("record").textContent =
    "🏆 RECORD: " + record.toLocaleString("it-IT");

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

// --- MOTORE AUDIO SINTETIZZATO PER TELEFONO E PC ---
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

function playSynthEffect(type) {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === "green") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(1150, now + 0.11);
        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    } else if (type === "red") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.linearRampToValueAtTime(85, now + 0.22);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
    } else if (type === "gold") {
        const goldNotes = new Array(523.25, 659.25, 783.99, 1046.50);
        goldNotes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + idx * 0.055);
            gain.gain.setValueAtTime(0.45, now + idx * 0.055);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.055 + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.055);
            osc.stop(now + idx * 0.055 + 0.18);
        });
    } else if (type === "epic") {
        const epicNotes = new Array(440, 554.37, 659.25, 880);
        epicNotes.forEach((freq) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        });
    } else if (type === "beep") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    } else if (type === "go") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }
}

playBtn.onclick = startCountdown;

playAgainBtn.onclick = () => {
    if (!isAnimatingRecord) location.reload();
};

homeBtn.onclick = () => {
    if (!isAnimatingRecord) location.reload();
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

// Voce sintetizzata in inglese
function speakEnglish(phrase, rate = 1.15, pitch = 1.15) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-US")) ||
                         voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
}

if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
}

function startCountdown() {
    initAudio();
    menu.style.display = "none";
    countdown.style.display = "block";
    countdown.textContent = "3";
    playAudio(threeSound, "beep");
    speakEnglish("Three!", 1.1, 1.1);

    setTimeout(() => {
        countdown.textContent = "2";
        playAudio(twoSound, "beep");
        speakEnglish("Two!", 1.1, 1.15);
    }, 1000);

    setTimeout(() => {
        countdown.textContent = "1";
        playAudio(oneSound, "beep");
        speakEnglish("One!", 1.1, 1.2);
    }, 2000);

    setTimeout(() => {
        countdown.textContent = "GO!";
        playAudio(goSound, "go");
        speakEnglish("Go!", 1.25, 1.3);
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
            timerCircle.style.border = "6px solid #ef4444";
            timerCircle.style.boxShadow = "0 10px 0 #8e1b1b, 0 0 25px rgba(239, 68, 68, 0.8)";
        } else {
            timerCircle.style.border = "6px solid #ffffff";
            timerCircle.style.boxShadow = "0 10px 0 #1e3a8a, 0 18px 28px rgba(0, 0, 0, 0.45)";
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
    const freeArrows = arrows.filter(
        a => !activeButtons.some(b => b.dataset.key === a)
    );

    if (freeArrows.length === 0) return;

    const greens = activeButtons.filter(b => b.dataset.action === "green").length;
    const reds = activeButtons.filter(b => b.dataset.action === "red").length;

    let type = "green";

    // Massimo 3 verdi e 2 rossi, mai tutti verdi
    if (greens >= 3) {
        type = "red";
    } else if (reds >= 2) {
        type = "green";
    } else if (greens === 2 && reds === 0) {
        type = "red";
    } else {
        type = Math.random() < 0.6 ? "green" : "red";
    }

    // Pulsante Oro molto raro: appare SOLO se timer < 2.5s (1.5% di probabilità)
    if (time < 2.5 && greens > 0 && Math.random() < 0.015) {
        type = "gold";
    }

    const btn = document.createElement("button");
    btn.classList.add("button-circle");

    const key = freeArrows[Math.floor(Math.random() * freeArrows.length)];
    let valueText = "";

    if (type === "green") {
        btn.classList.add("green");
        // Tre possibilità: +0.25s (250ms), +0.3s (300ms), +0.35s (350ms)
        const greenOptions = new Array(0.25, 0.3, 0.35);
        const value = greenOptions[Math.floor(Math.random() * greenOptions.length)];
        btn.dataset.value = value;
        valueText = "+" + value;
    } else if (type === "red") {
        btn.classList.add("red");
        const redOptions = new Array(0.4, 0.5, 0.6, 0.7);
        const value = redOptions[Math.floor(Math.random() * redOptions.length)];
        btn.dataset.value = value;
        valueText = "-" + value.toFixed(1);
    } else {
        btn.classList.add("gold");
        valueText = "x2";
    }

    btn.dataset.key = key;
    btn.dataset.action = type;
    btn.innerHTML = `
        <div class="arrow">${symbols[key]}</div>
        <div class="value">${valueText}</div>
    `;

    const btnSize = 92;
    const margin = 15;
    let x, y;
    let valid = false;
    let attempts = 0;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    while (!valid && attempts < 80) {
        attempts++;
        x = margin + Math.random() * (window.innerWidth - btnSize - margin * 2);
        y = 85 + Math.random() * (window.innerHeight - btnSize - 105);

        valid = true;

        const distCenter = Math.hypot((x + btnSize / 2) - centerX, (y + btnSize / 2) - centerY);
        if (distCenter < 155) {
            valid = false;
        }

        if (valid) {
            for (const existing of activeButtons) {
                const ex = parseFloat(existing.style.left);
                const ey = parseFloat(existing.style.top);
                const distance = Math.hypot(x - ex, y - ey);
                if (distance < 115) {
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
    const icons = isGold ? new Array("⭐", "✨", "🌟", "💫") : new Array("✨", "⭐");

    for (let i = 0; i < count; i++) {
        const star = document.createElement("span");
        star.className = "star-particle";
        star.textContent = icons[Math.floor(Math.random() * icons.length)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
        const radius = 12 + Math.random() * 26;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;

        star.style.left = x + "px";
        star.style.top = y + "px";
        star.style.setProperty("--dx", dx + "px");
        star.style.setProperty("--dy", dy + "px");

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

        time = Number((time + (doubleBonus ? value * 2 : value)).toFixed(2));
        comboCount++;
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
        time = Number((time - value).toFixed(2));
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
        showMessage("GREAT!", "Great!");
    } else if (comboCount === 10) {
        showMessage("FANTASTIC!", "Fantastic!");
    } else if (comboCount === 15) {
        showMessage("AMAZING!", "Amazing!");
    } else if (comboCount === 20) {
        showMessage("UNBELIEVABLE!", "Unbelievable!");
    } else if (comboCount > 0 && comboCount % 25 === 0) {
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
        speakEnglish(spokenText, 1.2, 1.25);
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

function animateScoreCounter(element, prefix, targetValue, onComplete) {
    let current = 0;
    const duration = 1400;
    const steps = 45;
    const increment = targetValue / steps;
    const stepTime = duration / steps;

    const counter = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(counter);
            element.textContent = prefix + Math.round(current).toLocaleString("it-IT");
            if (onComplete) onComplete();
        } else {
            element.textContent = prefix + Math.round(current).toLocaleString("it-IT");
        }
    }, stepTime);
}

function gameOver() {
    if (!running) return;
    running = false;
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    if (bgMusic) bgMusic.pause();

    while (activeButtons.length > 0) {
        const firstBtn = activeButtons.shift();
        if (firstBtn && firstBtn.parentNode) {
            firstBtn.remove();
        }
    }

    gameOverScreen.style.display = "flex";
    finalScore.textContent = "SCORE: " + score.toLocaleString("it-IT");

    if (score > record && score > 0) {
        record = score;
        localStorage.setItem("record", record);
        newRecordMessage.style.display = "block";
        isAnimatingRecord = true;
        speakEnglish("New record!", 1.15, 1.25);

        finalRecord.textContent = "RECORD: 0";
        animateScoreCounter(finalRecord, "RECORD: ", record, () => {
            isAnimatingRecord = false;
        });
    } else {
        newRecordMessage.style.display = "none";
        finalRecord.textContent = "RECORD: " + record.toLocaleString("it-IT");
    }
}

document.addEventListener("keydown", (event) => {
    if (!running) return;
    const target = activeButtons.find(b => b.dataset.key === event.key);
    if (target) {
        activateButton(target);
    }
});