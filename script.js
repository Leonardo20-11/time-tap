function initTimeTapGame() {
    const onboardingScreen = document.getElementById("onboardingScreen");
    const onboardingShieldPreview = document.getElementById("onboardingShieldPreview");
    const usernameInput = document.getElementById("usernameInput");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    const profileCornerBtn = document.getElementById("profileCornerBtn");
    const homeProfileShield = document.getElementById("homeProfileShield");
    const homeProfileName = document.getElementById("homeProfileName");
    const homeProfileTitle = document.getElementById("homeProfileTitle");

    const homeXpWidget = document.getElementById("homeXpWidget");
    const homeXpRank = document.getElementById("homeXpRank");
    const homeXpNums = document.getElementById("homeXpNums");
    const homeXpFill = document.getElementById("homeXpFill");

    const profileModal = document.getElementById("profileModal");
    const closeProfileBtn = document.getElementById("closeProfileBtn");
    const profileEquipSlotBtn = document.getElementById("profileEquipSlotBtn");
    const goToBadgesFromProfileBtn = document.getElementById("goToBadgesFromProfileBtn");
    const profileModalUsername = document.getElementById("profileModalUsername");
    const profileModalStats = document.getElementById("profileModalStats");
    const equippedTitleLabel = document.getElementById("equippedTitleLabel");
    const profileBestScore = document.getElementById("profileBestScore");
    const profileBestCombo = document.getElementById("profileBestCombo");
    const profileCurrentRank = document.getElementById("profileCurrentRank");

    const editUsernameBtn = document.getElementById("editUsernameBtn");
    const editUsernameBox = document.getElementById("editUsernameBox");
    const newUsernameInput = document.getElementById("newUsernameInput");
    const confirmUsernameChangeBtn = document.getElementById("confirmUsernameChangeBtn");
    const cancelUsernameChangeBtn = document.getElementById("cancelUsernameChangeBtn");

    const openBadgesBtn = document.getElementById("openBadgesBtn");
    const badgesModal = document.getElementById("badgesModal");

    const playBtn = document.getElementById("playBtn");
    const discardSavedBtn = document.getElementById("discardSavedBtn");
    const confirmNewRunModal = document.getElementById("confirmNewRunModal");
    const confirmNewRunYesBtn = document.getElementById("confirmNewRunYesBtn");
    const confirmNewRunNoBtn = document.getElementById("confirmNewRunNoBtn");

    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const timerCircle = document.getElementById("timerCircle");
    const timerRingProgress = document.getElementById("timerRingProgress");
    const countdown = document.getElementById("countdown");
    const scoreText = document.getElementById("score");
    const comboText = document.getElementById("combo");

    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScore = document.getElementById("finalScore");
    const finalRecord = document.getElementById("finalRecord");
    const finalCombo = document.getElementById("finalCombo");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const homeBtn = document.getElementById("homeBtn");
    const newRecordMessage = document.getElementById("newRecordMessage");
    const xpEarnedBadge = document.getElementById("xpEarnedBadge");
    const goRankFrom = document.getElementById("goRankFrom");
    const goXpProgressText = document.getElementById("goXpProgressText");
    const goRankTo = document.getElementById("goRankTo");
    const goXpBarFill = document.getElementById("goXpBarFill");

    const pauseBtn = document.getElementById("pauseBtn");
    const pauseOverlay = document.getElementById("pauseOverlay");
    const resumeBtn = document.getElementById("resumeBtn");
    const quitToHomeBtn = document.getElementById("quitToHomeBtn");

    const settingsBtn = document.getElementById("settingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const audioToggleBtn = document.getElementById("audioToggleBtn");

    const levelBtn = document.getElementById("levelBtn");
    if (levelBtn) levelBtn.style.display = "none";
    const levelModal = document.getElementById("levelModal");
    if (levelModal) levelModal.style.display = "none";
    if (openBadgesBtn) openBadgesBtn.style.display = "none";
    if (badgesModal) badgesModal.style.display = "none";
    if (profileEquipSlotBtn) profileEquipSlotBtn.style.display = "none";
    if (goToBadgesFromProfileBtn) goToBadgesFromProfileBtn.style.display = "none";
    if (homeProfileShield) homeProfileShield.style.display = "none";
    if (onboardingShieldPreview) onboardingShieldPreview.style.display = "none";

    const rankUpCelebration = document.getElementById("rankUpCelebration");
    const fireworksContainer = document.getElementById("fireworksContainer");
    const celebrationShieldSlot = document.getElementById("celebrationShieldSlot");
    const celebrationRankName = document.getElementById("celebrationRankName");
    const celebrationTitleUnlocked = document.getElementById("celebrationTitleUnlocked");
    const claimRankBtn = document.getElementById("claimRankBtn");

    let specialMessage = document.getElementById("specialMessage");
    if (!specialMessage) {
        specialMessage = document.createElement("div");
        specialMessage.id = "specialMessage";
        document.body.appendChild(specialMessage);
    }

    let homeXpNextLevel = document.getElementById("homeXpNextLevel");
    if (!homeXpNextLevel && homeXpWidget) {
        const topRow = homeXpWidget.querySelector(".home-xp-top");
        if (topRow) {
            homeXpNextLevel = document.createElement("span");
            homeXpNextLevel.id = "homeXpNextLevel";
            homeXpNextLevel.className = "home-xp-next";
            topRow.appendChild(homeXpNextLevel);
        }
    }

    const LOCALE = "it-IT";
    const PAUSE_STATE_KEY = "timeTapSavedPausedState";
    const MAX_TIME = 8.0;
    const RING_CIRCUMFERENCE = 427.25;
    const BTN_RING_CIRCUMFERENCE = 314;
    const MAX_LEVEL = 100;
    const MAX_XP = 100000000;
    const PAUSE_COOLDOWN_MS = 5000;

    const isDesktop = window.innerWidth >= 768;
    const baseTime = isDesktop ? 3.0 : 2.5;
    let time = baseTime;
    if (timerCircle) {
        timerCircle.textContent = time.toFixed(1);
    }

    let score = 0;
    let comboCount = 0;
    let maxComboRun = 0;
    let running = false;
    let isPaused = false;
    let isResumingCountdown = false;
    let doubleBonus = false;
    let isFrozen = false;
    let isSlowMo = false;
    let isAnimatingRecord = false;
    let normalSpawnsSinceLastSpecial = 8;

    let freezeRemainingMs = 0;
    let slowMoRemainingMs = 0;
    let doubleBonusRemainingMs = 0;
    let overdriveRemainingMs = 0;
    let feverMusicTimer = 0;
    let feverNoteStep = 0;
    let pauseCooldownRemainingMs = 0;
    let gameLoopInterval = null;
    let spawnAccumulatorMs = 0;
    let messageTimeout = null;
    let panicTickCounter = 0;
    let lastKnownXP = 0;

    let playerUsername = localStorage.getItem("timeTapUsername") || "";
    let record = Number(localStorage.getItem("record")) || 0;
    let bestCombo = Number(localStorage.getItem("bestCombo")) || 0;
    let gamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;
    let totalScoreAccumulated = Number(localStorage.getItem("totalScoreAccumulated")) || 0;
    let storedBonusXP = Number(localStorage.getItem("storedBonusXP")) || 0;
    let highestCelebratedLevel = Number(localStorage.getItem("highestCelebratedLevel")) || 1;

    const LEVELS_CONFIG = [];
    const EXPONENT = 3.2;
    for (let lv = 1; lv <= MAX_LEVEL; lv++) {
        let xpReq = 0;
        if (lv === 1) {
            xpReq = 0;
        } else if (lv === MAX_LEVEL) {
            xpReq = MAX_XP;
        } else {
            const ratio = (lv - 1) / (MAX_LEVEL - 1);
            xpReq = Math.round(MAX_XP * Math.pow(ratio, EXPONENT));
        }
        LEVELS_CONFIG.push({
            level: lv,
            name: "LEVEL " + lv,
            xpRequired: xpReq
        });
    }

    function fmtNum(n) {
        return Number(n || 0).toLocaleString(LOCALE);
    }

    function calculateTotalXP() {
        const xpFromGames = gamesPlayed * 2000;
        const xpFromRecord = Math.floor(record * 0.1);
        const xpFromScore = Math.floor(totalScoreAccumulated * 0.04);
        return Math.min(MAX_XP, xpFromGames + xpFromRecord + xpFromScore + storedBonusXP);
    }

    function getCurrentAndNextTier(currentXP) {
        let currentTier = LEVELS_CONFIG[0];
        let nextTier = LEVELS_CONFIG[1] || null;
        for (let i = 0; i < LEVELS_CONFIG.length; i++) {
            const item = LEVELS_CONFIG[i];
            if (currentXP >= item.xpRequired) {
                currentTier = item;
                nextTier = LEVELS_CONFIG[i + 1] || null;
            } else {
                break;
            }
        }
        return { currentTier, nextTier };
    }

    function computeSegmentPercent(xpVal) {
        const { currentTier, nextTier } = getCurrentAndNextTier(xpVal);
        if (!nextTier) return 100;
        const span = nextTier.xpRequired - currentTier.xpRequired;
        if (span <= 0) return 100;
        return Math.max(0, Math.min(100, ((xpVal - currentTier.xpRequired) / span) * 100));
    }

    function hasSavedRun() {
        const raw = localStorage.getItem(PAUSE_STATE_KEY);
        if (!raw) return false;
        try {
            const saved = JSON.parse(raw);
            return Boolean(saved && typeof saved.time === "number" && saved.time > 0);
        } catch (e) {
            return false;
        }
    }

    function updateHomePlayButtonState() {
        if (!playBtn) return;
if (hasSavedRun()) {
playBtn.textContent = "CONTINUE";
playBtn.classList.add("continue-mode");
if (discardSavedBtn) discardSavedBtn.style.display = "inline-block";
} else {
playBtn.textContent = "PLAY";
playBtn.classList.remove("continue-mode");
if (discardSavedBtn) discardSavedBtn.style.display = "none";
}
}
function refreshAllProfileAndRankUI(animateHomeBarFromXP = null) {
const currentXP = calculateTotalXP();
const { currentTier, nextTier } = getCurrentAndNextTier(currentXP);
const displayName = playerUsername || "PLAYER";
if (homeProfileName) homeProfileName.textContent = displayName;
if (homeProfileTitle) homeProfileTitle.textContent = currentTier.name;
const targetPct = computeSegmentPercent(currentXP);
if (homeXpRank) homeXpRank.textContent = currentTier.name;
if (homeXpNextLevel) {
homeXpNextLevel.textContent = nextTier ? nextTier.name : "MAX";
}
if (homeXpNums) {
homeXpNums.textContent = nextTier
? fmtNum(currentXP) + " / " + fmtNum(nextTier.xpRequired) + " XP"
: fmtNum(currentXP) + " XP (MAX)";
}
if (homeXpFill) {
if (animateHomeBarFromXP !== null && animateHomeBarFromXP < currentXP) {
const startPct = computeSegmentPercent(animateHomeBarFromXP);
homeXpFill.style.transition = "none";
homeXpFill.style.width = startPct.toFixed(1) + "%";
void homeXpFill.offsetWidth;
homeXpFill.classList.add("xp-boosting");
homeXpFill.style.transition = "width 1.15s cubic-bezier(0.22, 1, 0.36, 1)";
homeXpFill.style.width = targetPct.toFixed(1) + "%";
setTimeout(() => homeXpFill.classList.remove("xp-boosting"), 1300);
} else {
homeXpFill.style.width = targetPct.toFixed(1) + "%";
}
}
const recordEl = document.getElementById("record");
const bestComboEl = document.getElementById("bestComboHome");
if (recordEl) recordEl.textContent = fmtNum(record);
if (bestComboEl) bestComboEl.textContent = fmtNum(bestCombo);
if (profileModalUsername) profileModalUsername.textContent = displayName;
if (profileModalStats) {
profileModalStats.textContent = "GAMES: " + fmtNum(gamesPlayed) + " | XP: " + fmtNum(currentXP);
}
if (equippedTitleLabel) {
equippedTitleLabel.textContent = currentTier.name;
}
if (profileBestScore) profileBestScore.textContent = fmtNum(record);
if (profileBestCombo) profileBestCombo.textContent = fmtNum(bestCombo);
if (profileCurrentRank) profileCurrentRank.textContent = currentTier.name;
lastKnownXP = currentXP;
updateHomePlayButtonState();
}
if (profileCornerBtn && profileModal) {
profileCornerBtn.addEventListener("click", () => {
playSynthEffect("click");
if (editUsernameBox) editUsernameBox.style.display = "none";
refreshAllProfileAndRankUI();
profileModal.style.display = "flex";
});
}
if (closeProfileBtn && profileModal) {
closeProfileBtn.addEventListener("click", (e) => {
e.stopPropagation();
playSynthEffect("click");
if (editUsernameBox) editUsernameBox.style.display = "none";
profileModal.style.display = "none";
});
}
if (editUsernameBtn && editUsernameBox) {
editUsernameBtn.addEventListener("click", (e) => {
e.stopPropagation();
playSynthEffect("click");
if (newUsernameInput) newUsernameInput.value = playerUsername;
editUsernameBox.style.display = "flex";
if (newUsernameInput) newUsernameInput.focus();
});
}
if (cancelUsernameChangeBtn && editUsernameBox) {
cancelUsernameChangeBtn.addEventListener("click", () => {
playSynthEffect("click");
editUsernameBox.style.display = "none";
});
}
if (confirmUsernameChangeBtn && newUsernameInput) {
confirmUsernameChangeBtn.addEventListener("click", () => {
const updated = newUsernameInput.value.trim().toUpperCase();
if (updated.length < 2) {
newUsernameInput.focus();
return;
}
playerUsername = updated;
localStorage.setItem("timeTapUsername", playerUsername);
playSynthEffect("gold");
if (editUsernameBox) editUsernameBox.style.display = "none";
refreshAllProfileAndRankUI();
});
}
function launchFireworksShow() {
if (!fireworksContainer) return;
fireworksContainer.innerHTML = "";
const colors = ["#fde047", "#ef4444", "#4ade80", "#38bdf8", "#c084fc", "#ffffff"];
for (let b = 0; b < 6; b++) {
setTimeout(() => {
const cx = 15 + Math.random() * 70;
const cy = 15 + Math.random() * 55;
playSynthEffect("milestone");
for (let p = 0; p < 26; p++) {
const dot = document.createElement("span");
dot.className = "fw-particle";
const col = colors[Math.floor(Math.random() * colors.length)];
const sz = (6 + Math.random() * 6).toFixed(0) + "px";
dot.style.width = sz;
dot.style.height = sz;
dot.style.background = col;
dot.style.boxShadow = "0 0 10px " + col;
dot.style.left = cx + "%";
dot.style.top = cy + "%";
const angle = (Math.PI * 2 * p) / 26 + (Math.random() * 0.25);
const dist = 60 + Math.random() * 110;
dot.style.setProperty("--dx", (Math.cos(angle) * dist) + "px");
dot.style.setProperty("--dy", (Math.sin(angle) * dist) + "px");
fireworksContainer.appendChild(dot);
setTimeout(() => dot.remove(), 1150);
}
}, b * 360);
}
}
function checkAndTriggerRankUpCelebration() {
const currentXP = calculateTotalXP();
const { currentTier } = getCurrentAndNextTier(currentXP);
if (currentTier.level > highestCelebratedLevel) {
highestCelebratedLevel = currentTier.level;
localStorage.setItem("highestCelebratedLevel", highestCelebratedLevel);
refreshAllProfileAndRankUI();
if (rankUpCelebration) {
if (celebrationShieldSlot) celebrationShieldSlot.style.display = "none";
if (celebrationRankName) celebrationRankName.textContent = currentTier.name;
if (celebrationTitleUnlocked) {
celebrationTitleUnlocked.textContent = "LEVEL " + currentTier.level + " / " + MAX_LEVEL;
}
rankUpCelebration.style.display = "flex";
playSynthEffect("newrecord");
speakEnglish("Level up! " + currentTier.name, 1.05, 1.15);
launchFireworksShow();
}
}
}
if (claimRankBtn && rankUpCelebration) {
claimRankBtn.addEventListener("click", () => {
playSynthEffect("click");
rankUpCelebration.style.display = "none";
});
}
const SPECIAL_SVGS = {
bomb: '',
ice: '',
clock: '',
gold: ''
};
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
function updateAudioButton() {
if (!audioToggleBtn) return;
audioToggleBtn.textContent = soundEnabled ? "ON" : "OFF";
audioToggleBtn.classList.toggle("muted", !soundEnabled);
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
if (settingsBtn && settingsModal) {
settingsBtn.addEventListener("click", () => {
playSynthEffect("click");
settingsModal.style.display = "flex";
});
}
if (closeSettingsBtn && settingsModal) {
closeSettingsBtn.addEventListener("click", () => {
playSynthEffect("click");
settingsModal.style.display = "none";
});
}
const activeButtons = [];
const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
let baseButtonDuration = isDesktop ? 1850 : 1350;
let baseSpawnDelay = isDesktop ? 210 : 220;
let audioCtx = null;
function initAudio() {
if (!soundEnabled) return;
try {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (!AudioCtx) return;
if (!audioCtx) audioCtx = new AudioCtx();
if (audioCtx.state === "suspended") audioCtx.resume();
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
function playFeverRushBeat() {
if (!soundEnabled) return;
initAudio();
if (!audioCtx) return;
const now = audioCtx.currentTime;
const leadMelody = [440, 523.25, 659.25, 880, 783.99, 659.25, 587.33, 659.25];
const bassLine = [110, 110, 130.81, 130.81, 146.83, 146.83, 164.81, 164.81];
const idx = feverNoteStep % leadMelody.length;
feverNoteStep++;
playTone(leadMelody[idx], leadMelody[idx] * 1.02, "triangle", now, 0.14, 0.24);
playTone(bassLine[idx], null, "sine", now, 0.15, 0.28);
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
[440, 554.37, 659.25, 880].forEach((f, i) => {
playTone(f, null, "sine", now + i * 0.045, 0.16, 0.42);
});
} else if (type === "ice") {
[880, 1174.66, 1318.51, 1760].forEach((f, i) => {
playTone(f, null, "sine", now + i * 0.04, 0.22, 0.35);
});
} else if (type === "clock") {
playTone(720, 260, "sine", now, 0.45, 0.4);
playTone(540, 195, "triangle", now + 0.06, 0.45, 0.35);
} else if (type === "bomb") {
playTone(140, 35, "sawtooth", now, 0.45, 0.65);
playTone(100, 28, "square", now, 0.45, 0.55);
} else if (type === "epic") {
[392, 493.88, 587.33, 783.99].forEach((f) => {
playTone(f, null, "triangle", now, 0.3, 0.32);
});
} else if (type === "milestone") {
[440, 587.33, 783.99].forEach((f, i) => {
playTone(f, null, "sine", now + i * 0.055, 0.18, 0.28);
});
} else if (type === "newrecord") {
[440, 554.37, 659.25, 880, 659.25, 880].forEach((f, i) => {
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
setTimeout(() => el.remove(), 600);
}
function spawnTapRipple(x, y, color) {
const ripple = document.createElement("div");
ripple.className = "tap-ripple";
ripple.style.left = x + "px";
ripple.style.top = y + "px";
ripple.style.borderColor = color;
game.appendChild(ripple);
setTimeout(() => ripple.remove(), 460);
}
function triggerScreenShake() {
game.classList.remove("screen-shake");
void game.offsetWidth;
game.classList.add("screen-shake");
}
function triggerMaxCapFeedback() {
if (navigator.vibrate) {
try { navigator.vibrate(35); } catch (e) {}
}
if (timerCircle) {
timerCircle.classList.remove("timer-max-cap");
void timerCircle.offsetWidth;
timerCircle.classList.add("timer-max-cap");
}
}
function savePausedGameState() {
const savedButtons = activeButtons.map(btn => ({
action: btn.dataset.action,
key: btn.dataset.key,
value: btn.dataset.value || "",
left: parseFloat(btn.style.left) || 0,
top: parseFloat(btn.style.top) || 0,
remainingMs: Math.max(250, Number(btn.dataset.remainingMs) || baseButtonDuration),
totalMs: Number(btn.dataset.totalMs) || baseButtonDuration
}));
const payload = {
time,
score,
comboCount,
maxComboRun,
doubleBonus,
doubleBonusRemainingMs,
isFrozen,
freezeRemainingMs,
isSlowMo,
slowMoRemainingMs,
overdriveRemainingMs,
buttons: savedButtons
};
localStorage.setItem(PAUSE_STATE_KEY, JSON.stringify(payload));
}
function clearSavedPausedState() {
localStorage.removeItem(PAUSE_STATE_KEY);
updateHomePlayButtonState();
}
function updatePauseButtonUI() {
if (!pauseBtn) return;
if (pauseCooldownRemainingMs > 0) {
const secLeft = Math.ceil(pauseCooldownRemainingMs / 1000);
pauseBtn.disabled = true;
pauseBtn.classList.add("on-cooldown");
pauseBtn.textContent = secLeft + "s";
} else {
pauseBtn.disabled = false;
pauseBtn.classList.remove("on-cooldown");
pauseBtn.textContent = "II";
}
}
function pauseGame() {
if (!running || isPaused || isResumingCountdown || pauseCooldownRemainingMs > 0) return;
isPaused = true;
savePausedGameState();
if (pauseOverlay) pauseOverlay.style.display = "flex";
}
function runResumeCountdown(onComplete) {
if (isResumingCountdown) return;
isResumingCountdown = true;
initAudio();
if (pauseOverlay) pauseOverlay.style.display = "none";
if (menu) menu.style.display = "none";
if (game) game.style.display = "block";
if (pauseBtn) pauseBtn.disabled = true;
countdown.style.display = "block";
triggerCountdownStep("3", "beep", "Three!", 1.0);
setTimeout(() => triggerCountdownStep("2", "beep", "Two!", 1.05), 1000);
setTimeout(() => triggerCountdownStep("1", "beep", "One!", 1.1), 2000);
setTimeout(() => triggerCountdownStep("GO!", "go", "Go!", 1.2), 3000);
setTimeout(() => {
countdown.style.display = "none";
isResumingCountdown = false;
onComplete();
}, 4000);
}
function resumeGame() {
if (!isPaused || isResumingCountdown) return;
runResumeCountdown(() => {
isPaused = false;
clearSavedPausedState();
pauseCooldownRemainingMs = PAUSE_COOLDOWN_MS;
updatePauseButtonUI();
});
}
function finalizeRunStatsAndShowSummary() {
const xpBeforeRun = calculateTotalXP();
const isNewBest = score > record && score > 0;
const pcMultiplier = isDesktop ? 1.25 : 1.0;
let comboBonusPct = 0;
if (maxComboRun > 200) {
comboBonusPct = 20;
} else if (maxComboRun > 100) {
comboBonusPct = 10;
}
gamesPlayed++;
totalScoreAccumulated += score;
if (isNewBest) {
record = score;
localStorage.setItem("record", record);
}
const baseRunXP = 2000 + Math.floor(score * 0.1) + (isNewBest ? 1500 : 0);
const withPcXP = Math.floor(baseRunXP * pcMultiplier);
const comboBonusXP = Math.floor(withPcXP * (comboBonusPct / 100));
const finalRunXP = withPcXP + comboBonusXP;
const diffPart = isNewBest ? Math.floor((score - record) * 0.1) : 0;
const naturalFormulaDiff = 2000 + Math.floor(score * 0.04) + diffPart;
const extraToStore = Math.max(0, finalRunXP - Math.max(0, naturalFormulaDiff));
storedBonusXP += extraToStore;
localStorage.setItem("gamesPlayed", gamesPlayed);
localStorage.setItem("totalScoreAccumulated", totalScoreAccumulated);
localStorage.setItem("storedBonusXP", storedBonusXP);
if (maxComboRun > bestCombo) {
bestCombo = maxComboRun;
localStorage.setItem("bestCombo", bestCombo);
}
const xpAfterRun = calculateTotalXP();
const earnedXP = Math.max(0, xpAfterRun - xpBeforeRun);
if (xpEarnedBadge) {
const comboLabel = comboBonusPct > 0 ? " + " + comboBonusPct + "% COMBO" : "";
xpEarnedBadge.textContent = "+" + fmtNum(earnedXP) + " XP" + comboLabel;
}
const { currentTier: tierAfter, nextTier: nextAfter } = getCurrentAndNextTier(xpAfterRun);
if (goRankFrom) goRankFrom.textContent = tierAfter.name;
if (goRankTo) goRankTo.textContent = nextAfter ? nextAfter.name : "MAX";
if (goXpProgressText) {
goXpProgressText.textContent = nextAfter
? fmtNum(xpAfterRun) + " / " + fmtNum(nextAfter.xpRequired) + " XP"
: fmtNum(xpAfterRun) + " XP";
}
if (menu) menu.style.display = "none";
if (gameOverScreen) gameOverScreen.style.display = "flex";
finalScore.textContent = fmtNum(score);
finalCombo.textContent = fmtNum(maxComboRun);
if (goXpBarFill) {
const startPct = computeSegmentPercent(xpBeforeRun);
const endPct = computeSegmentPercent(xpAfterRun);
goXpBarFill.style.transition = "none";
goXpBarFill.style.width = startPct.toFixed(1) + "%";
setTimeout(() => {
goXpBarFill.style.transition = "width 1.15s cubic-bezier(0.22, 1, 0.36, 1)";
goXpBarFill.style.width = endPct.toFixed(1) + "%";
}, 120);
}
if (isNewBest) {
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
finalRecord.textContent = fmtNum(record);
}
refreshAllProfileAndRankUI(xpBeforeRun);
}
function returnToHome(keepPausedRun = false) {
const xpAtEnter = lastKnownXP;
if (keepPausedRun) {
savePausedGameState();
} else {
clearSavedPausedState();
}
running = false;
isPaused = false;
isResumingCountdown = false;
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
overdriveRemainingMs = 0;
pauseCooldownRemainingMs = 0;
updatePauseButtonUI();
clearInterval(gameLoopInterval);
while (activeButtons.length > 0) {
const b = activeButtons.shift();
if (b && b.parentNode) b.remove();
}
if (pauseOverlay) pauseOverlay.style.display = "none";
if (gameOverScreen) gameOverScreen.style.display = "none";
if (game) {
game.style.display = "none";
game.classList.remove("overdrive-active", "slowmo-active");
}
if (countdown) countdown.style.display = "none";
if (menu) menu.style.display = "flex";
time = baseTime;
score = 0;
comboCount = 0;
maxComboRun = 0;
normalSpawnsSinceLastSpecial = 8;
if (timerCircle) {
timerCircle.textContent = time.toFixed(1);
timerCircle.classList.remove("timer-panic", "timer-frozen", "timer-slowmo", "timer-max-cap");
}
if (scoreText) scoreText.textContent = "SCORE: 0";
if (comboText) {
comboText.textContent = "COMBO 0";
comboText.classList.remove("combo-fire");
}
refreshAllProfileAndRankUI(xpAtEnter);
checkAndTriggerRankUpCelebration();
}
if (pauseBtn) {
pauseBtn.addEventListener("click", () => {
playSynthEffect("click");
pauseGame();
});
}
if (resumeBtn) {
resumeBtn.addEventListener("click", () => {
playSynthEffect("click");
resumeGame();
});
}
if (quitToHomeBtn) {
quitToHomeBtn.addEventListener("click", () => {
playSynthEffect("click");
returnToHome(true);
});
}
window.addEventListener("beforeunload", () => {
if (running && isPaused) {
savePausedGameState();
}
});
function resumeSavedRunFromHome() {
const raw = localStorage.getItem(PAUSE_STATE_KEY);
if (!raw) {
startCountdown();
return;
}
try {
const saved = JSON.parse(raw);
if (!saved || typeof saved.time !== "number" || saved.time <= 0) {
clearSavedPausedState();
startCountdown();
return;
}
time = Math.min(MAX_TIME, saved.time);
score = saved.score || 0;
comboCount = saved.comboCount || 0;
maxComboRun = saved.maxComboRun || 0;
doubleBonus = Boolean(saved.doubleBonus);
doubleBonusRemainingMs = saved.doubleBonusRemainingMs || 0;
isFrozen = Boolean(saved.isFrozen);
freezeRemainingMs = saved.freezeRemainingMs || 0;
isSlowMo = Boolean(saved.isSlowMo);
slowMoRemainingMs = saved.slowMoRemainingMs || 0;
overdriveRemainingMs = saved.overdriveRemainingMs || 0;
pauseCooldownRemainingMs = 0;
if (menu) menu.style.display = "none";
if (game) game.style.display = "block";
timerCircle.textContent = time.toFixed(1);
scoreText.textContent = "SCORE: " + fmtNum(score);
comboText.textContent = "COMBO " + comboCount;
updateTimerVisuals();
if (Array.isArray(saved.buttons)) {
saved.buttons.forEach(bData => createButton(bData));
}
running = true;
isPaused = true;
runResumeCountdown(() => {
isPaused = false;
clearSavedPausedState();
startGame(true);
pauseCooldownRemainingMs = PAUSE_COOLDOWN_MS;
updatePauseButtonUI();
});
} catch (e) {
clearSavedPausedState();
startCountdown();
}
}
if (playBtn) {
playBtn.addEventListener("click", () => {
playSynthEffect("click");
if (hasSavedRun()) {
resumeSavedRunFromHome();
} else {
startCountdown();
}
});
}
if (discardSavedBtn && confirmNewRunModal) {
discardSavedBtn.addEventListener("click", () => {
playSynthEffect("click");
confirmNewRunModal.style.display = "flex";
});
}
if (confirmNewRunNoBtn) {
confirmNewRunNoBtn.addEventListener("click", () => {
playSynthEffect("click");
if (confirmNewRunModal) confirmNewRunModal.style.display = "none";
});
}
if (confirmNewRunYesBtn) {
confirmNewRunYesBtn.addEventListener("click", () => {
playSynthEffect("click");
if (confirmNewRunModal) confirmNewRunModal.style.display = "none";
const raw = localStorage.getItem(PAUSE_STATE_KEY);
clearSavedPausedState();
if (raw) {
try {
const saved = JSON.parse(raw);
score = saved.score || 0;
maxComboRun = saved.maxComboRun || 0;
} catch (e) {
score = 0;
maxComboRun = 0;
}
}
finalizeRunStatsAndShowSummary();
});
}
if (playAgainBtn) {
playAgainBtn.addEventListener("click", () => {
if (!isAnimatingRecord) {
clearSavedPausedState();
playSynthEffect("click");
if (gameOverScreen) gameOverScreen.style.display = "none";
if (game) game.style.display = "none";
time = baseTime;
score = 0;
comboCount = 0;
maxComboRun = 0;
overdriveRemainingMs = 0;
pauseCooldownRemainingMs = 0;
updatePauseButtonUI();
normalSpawnsSinceLastSpecial = 8;
if (timerCircle) timerCircle.textContent = time.toFixed(1);
if (scoreText) scoreText.textContent = "SCORE: 0";
if (comboText) {
comboText.textContent = "COMBO 0";
comboText.classList.remove("combo-fire");
}
startCountdown();
}
});
}
if (homeBtn) {
homeBtn.addEventListener("click", () => {
if (!isAnimatingRecord) {
playSynthEffect("click");
returnToHome(false);
}
});
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
if (selectedVoice) utterance.voice = selectedVoice;
window.speechSynthesis.speak(utterance);
} catch (e) {}
}
if ("speechSynthesis" in window) {
window.speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
function triggerCountdownStep(text, synthType, spoken, pitch) {
countdown.textContent = text;
countdown.classList.remove("countdown-pop");
void countdown.offsetWidth;
countdown.classList.add("countdown-pop");
playSynthEffect(synthType);
speakEnglish(spoken, 1.08, pitch);
}
function startCountdown() {
initAudio();
pauseCooldownRemainingMs = 0;
updatePauseButtonUI();
menu.style.display = "none";
countdown.style.display = "block";
triggerCountdownStep("3", "beep", "Three!", 1.0);
setTimeout(() => triggerCountdownStep("2", "beep", "Two!", 1.05), 1000);
setTimeout(() => triggerCountdownStep("1", "beep", "One!", 1.1), 2000);
setTimeout(() => triggerCountdownStep("GO!", "go", "Go!", 1.2), 3000);
setTimeout(() => {
countdown.style.display = "none";
game.style.display = "block";
startGame(false);
}, 4000);
}
function updateTimerVisuals() {
if (timerRingProgress) {
const ratio = Math.max(0, Math.min(1, time / MAX_TIME));
const offset = RING_CIRCUMFERENCE * (1 - ratio);
timerRingProgress.style.strokeDashoffset = offset.toFixed(1);
if (isFrozen) {
timerRingProgress.style.stroke = "#7dd3fc";
} else if (isSlowMo) {
timerRingProgress.style.stroke = "#e879f9";
} else if (time <= 1.2) {
timerRingProgress.style.stroke = "#ef4444";
} else if (time <= 3.0) {
timerRingProgress.style.stroke = "#facc15";
} else {
timerRingProgress.style.stroke = "#4ade80";
}
}
timerCircle.classList.toggle("timer-frozen", isFrozen);
timerCircle.classList.toggle("timer-slowmo", isSlowMo && !isFrozen);
game.classList.toggle("slowmo-active", isSlowMo);
game.classList.toggle("overdrive-active", overdriveRemainingMs > 0);
if (isFrozen) {
timerCircle.classList.remove("timer-panic");
return;
}
if (isSlowMo) {
timerCircle.style.background =
"radial-gradient(circle at 30% 30%, #f5d0fe 0%, #c084fc 55%, #7e22ce 100%)";
timerCircle.style.boxShadow =
"inset 0 8px 0 rgba(255,255,255,0.45), 0 11px 0 #581c87, 0 0 32px rgba(192,132,252,0.9)";
timerCircle.classList.remove("timer-panic");
return;
}
if (time <= 1.0) {
timerCircle.style.background =
"radial-gradient(circle at 30% 30%, #fecaca 0%, #ef4444 50%, #b91c1c 100%)";
timerCircle.style.boxShadow =
"inset 0 8px 0 rgba(255, 255, 255, 0.35), 0 11px 0 #7f1d1d, 0 0 28px rgba(239, 68, 68, 0.9)";
timerCircle.classList.add("timer-panic");
} else {
timerCircle.style.background =
"radial-gradient(circle at 30% 30%, #bfdbfe 0%, #3b82f6 50%, #1d4ed8 100%)";
timerCircle.style.boxShadow =
"inset 0 6px 0 rgba(255, 255, 255, 0.32), 0 11px 0 #1e3a8a, 0 20px 30px rgba(0, 0, 0, 0.45)";
timerCircle.classList.remove("timer-panic");
}
}
function startGame(isRestored = false) {
running = true;
if (!isRestored) {
pauseCooldownRemainingMs = 0;
normalSpawnsSinceLastSpecial = 8;
createButton();
createButton();
}
updatePauseButtonUI();
updateTimerVisuals();
const TICK_MS = 50;
clearInterval(gameLoopInterval);
gameLoopInterval = setInterval(() => {
if (!running || isPaused) return;
if (pauseCooldownRemainingMs > 0) {
pauseCooldownRemainingMs = Math.max(0, pauseCooldownRemainingMs - TICK_MS);
updatePauseButtonUI();
}
if (overdriveRemainingMs > 0) {
overdriveRemainingMs = Math.max(0, overdriveRemainingMs - TICK_MS);
feverMusicTimer += TICK_MS;
if (feverMusicTimer >= 165) {
feverMusicTimer = 0;
playFeverRushBeat();
}
} else {
feverMusicTimer = 0;
}
if (isFrozen) {
freezeRemainingMs -= TICK_MS;
if (freezeRemainingMs <= 0) {
isFrozen = false;
freezeRemainingMs = 0;
}
}
if (isSlowMo) {
slowMoRemainingMs -= TICK_MS;
if (slowMoRemainingMs <= 0) {
isSlowMo = false;
slowMoRemainingMs = 0;
}
}
if (doubleBonus) {
doubleBonusRemainingMs -= TICK_MS;
if (doubleBonusRemainingMs <= 0) {
doubleBonus = false;
doubleBonusRemainingMs = 0;
}
}
const speedFactor = isSlowMo ? 0.4 : 1.0;
if (!isFrozen) {
const deltaSeconds = (TICK_MS / 1000) * speedFactor;
time = Math.max(0, Number((time - deltaSeconds).toFixed(3)));
timerCircle.textContent = time.toFixed(1);
if (time <= 1.0) {
panicTickCounter++;
if (panicTickCounter % 4 === 0 && time > 0) {
playSynthEffect("tick");
}
} else {
panicTickCounter = 0;
}
}
updateTimerVisuals();
if (time <= 0) {
gameOver();
return;
}
for (let i = activeButtons.length - 1; i >= 0; i--) {
const btn = activeButtons[i];
const rem = Number(btn.dataset.remainingMs) - TICK_MS * speedFactor;
const tot = Number(btn.dataset.totalMs) || baseButtonDuration;
btn.dataset.remainingMs = rem;
const ringCircle = btn.querySelector(".btn-expiry-ring circle");
if (ringCircle) {
const frac = Math.max(0, Math.min(1, rem / tot));
ringCircle.style.strokeDashoffset = (BTN_RING_CIRCUMFERENCE * (1 - frac)).toFixed(1);
}
if (rem <= 0) {
removeButton(btn);
}
}
spawnAccumulatorMs += TICK_MS * speedFactor;
if (spawnAccumulatorMs >= baseSpawnDelay) {
spawnAccumulatorMs = 0;
if (activeButtons.length < 6) {
createButton();
}
}
}, TICK_MS);
}
function renderButtonInner(btn, type, valueText) {
let contentHtml = "";
if (type === "bomb") {
contentHtml = SPECIAL_SVGS.bomb + 'BOMB';
} else if (type === "ice") {
contentHtml = SPECIAL_SVGS.ice + 'FREEZE';
} else if (type === "clock") {
contentHtml = SPECIAL_SVGS.clock + 'SLOW';
} else if (type === "gold") {
contentHtml = SPECIAL_SVGS.gold + '2X TIME';
} else {
contentHtml = valueText;
}
const ringSvg = '';
btn.innerHTML = ringSvg + '' + contentHtml + '';
}
function createButton(forcedConfig = null) {
let type = "green";
let key = "";
let valueStr = "";
if (forcedConfig) {
type = forcedConfig.action;
key = forcedConfig.key;
valueStr = forcedConfig.value;
} else {
const greenSlotsCount = activeButtons.filter(b =>
["green", "gold", "ice", "clock"].includes(b.dataset.action)
).length;
const redSlotsCount = activeButtons.filter(b =>
["red", "bomb"].includes(b.dataset.action)
).length;
if (greenSlotsCount >= 4 && redSlotsCount >= 2) return;
const hasSpecialOnScreen = activeButtons.some(b =>
["gold", "ice", "bomb", "clock"].includes(b.dataset.action)
);
if (greenSlotsCount >= 4) {
type = "red";
} else if (redSlotsCount >= 2) {
type = "green";
} else if (greenSlotsCount >= 2 && redSlotsCount === 0) {
type = "red";
} else if (redSlotsCount >= 1 && greenSlotsCount === 0) {
type = "green";
} else {
type = Math.random() < 0.65 ? "green" : "red";
}
const canSpawnPowerup = !hasSpecialOnScreen && normalSpawnsSinceLastSpecial >= 8 && time < 3.0;
const canSpawnBomb = !hasSpecialOnScreen && normalSpawnsSinceLastSpecial >= 8;
if (type === "green" && canSpawnPowerup) {
const rand = Math.random();
if (rand < 0.008 && !isSlowMo) {
type = "clock";
} else if (rand < 0.017 && !isFrozen) {
type = "ice";
} else if (rand < 0.027 && !doubleBonus) {
type = "gold";
}
} else if (type === "red" && canSpawnBomb) {
if (Math.random() < 0.014) {
type = "bomb";
}
}
if (["gold", "ice", "bomb", "clock"].includes(type)) {
normalSpawnsSinceLastSpecial = 0;
} else {
normalSpawnsSinceLastSpecial++;
}
const freeArrows = arrows.filter(a => !activeButtons.some(b => b.dataset.key === a));
key = freeArrows.length > 0
? freeArrows[Math.floor(Math.random() * freeArrows.length)]
: arrows[Math.floor(Math.random() * arrows.length)];
}
const btn = document.createElement("button");
btn.classList.add("button-circle");
let valueText = "";
if (type === "green") {
btn.classList.add("green");
const greenOptions = isDesktop ? [0.400, 0.500, 0.550] : [0.250, 0.300, 0.350, 0.380];
const value = forcedConfig ? Number(valueStr) : greenOptions[Math.floor(Math.random() * greenOptions.length)];
btn.dataset.value = value;
valueText = "+" + value.toFixed(3);
} else if (type === "red") {
btn.classList.add("red");
const redOptions = [0.4, 0.5, 0.6, 0.7];
const value = forcedConfig ? Number(valueStr) : redOptions[Math.floor(Math.random() * redOptions.length)];
btn.dataset.value = value;
valueText = "-" + value.toFixed(1);
} else if (type === "ice") {
btn.classList.add("ice");
} else if (type === "clock") {
btn.classList.add("clock");
} else if (type === "bomb") {
btn.classList.add("bomb");
} else {
btn.classList.add("gold");
valueText = "2X";
}
let durationMs = baseButtonDuration;
if (type === "green" && overdriveRemainingMs > 0) {
durationMs = Math.round(baseButtonDuration * 0.80);
}
btn.dataset.key = key;
btn.dataset.action = type;
btn.dataset.totalMs = forcedConfig ? (forcedConfig.totalMs || durationMs) : durationMs;
btn.dataset.remainingMs = forcedConfig ? forcedConfig.remainingMs : durationMs;
renderButtonInner(btn, type, valueText);
let x = 0;
let y = 0;
if (forcedConfig) {
x = forcedConfig.left;
y = forcedConfig.top;
} else {
const btnSize = isDesktop ? 165 : 108;
const minCenterDist = isDesktop ? 245 : 150;
const minBtnDist = isDesktop ? 175 : 114;
const margin = 16;
let valid = false;
let attempts = 0;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
while (!valid && attempts < 140) {
attempts++;
x = margin + Math.random() * (window.innerWidth - btnSize - margin * 2);
y = 80 + Math.random() * (window.innerHeight - btnSize - 98);
valid = true;
const distCenter = Math.hypot((x + btnSize / 2) - centerX, (y + btnSize / 2) - centerY);
if (distCenter < minCenterDist) valid = false;
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
}
btn.style.left = x + "px";
btn.style.top = y + "px";
btn.onpointerdown = (e) => {
e.preventDefault();
activateButton(btn);
};
game.appendChild(btn);
activeButtons.push(btn);
}
function spawnStars(x, y, mode) {
let count = 12;
let colors = ["#4ade80", "#bbf7d0", "#ffffff"];
let isDiamond = false;
if (mode === "gold") {
count = 20;
colors = ["#fde047", "#f59e0b", "#ffffff"];
isDiamond = true;
} else if (mode === "ice") {
count = 20;
colors = ["#ffffff", "#bae6fd", "#38bdf8", "#0284c7"];
isDiamond = true;
} else if (mode === "clock") {
count = 18;
colors = ["#f5d0fe", "#c084fc", "#fde047"];
isDiamond = true;
} else if (mode === "bomb") {
count = 24;
colors = ["#ef4444", "#f97316", "#facc15", "#1e293b"];
}
for (let i = 0; i < count; i++) {
const spark = document.createElement("span");
spark.className = "fx-spark" + (isDiamond ? " diamond" : "");
const size = (6 + Math.random() * 7).toFixed(0) + "px";
const color = colors[Math.floor(Math.random() * colors.length)];
spark.style.width = size;
spark.style.height = size;
spark.style.background = color;
spark.style.boxShadow = "0 0 8px " + color;
const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
const radius = 22 + Math.random() * 42;
spark.style.left = x + "px";
spark.style.top = y + "px";
spark.style.setProperty("--dx", (Math.cos(angle) * radius) + "px");
spark.style.setProperty("--dy", (Math.sin(angle) * radius) + "px");
game.appendChild(spark);
setTimeout(() => spark.remove(), 480);
}
}
function activateButton(btn) {
if (!btn.parentNode || !running || isPaused) return;
const action = btn.dataset.action;
const rect = btn.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
if (action === "green") {
const wasCritical = time <= 0.6 && !isFrozen;
const value = Number(btn.dataset.value);
const addedTime = doubleBonus ? value * 2 : value;
const rawNextTime = Number((time + addedTime).toFixed(3));
if (rawNextTime >= MAX_TIME) {
time = MAX_TIME;
triggerMaxCapFeedback();
} else {
time = rawNextTime;
}
comboCount++;
if (comboCount > maxComboRun) maxComboRun = comboCount;
const earnedPoints = 100 + comboCount * 20;
score += earnedPoints;
if (timerCircle) {
timerCircle.classList.remove("timer-bounce");
void timerCircle.offsetWidth;
timerCircle.classList.add("timer-bounce");
}
spawnTapRipple(centerX, centerY, doubleBonus ? "#fde047" : "#4ade80");
spawnStars(centerX, centerY, "green");
spawnFloatingText(
centerX,
centerY,
(doubleBonus ? "2X +" : "+") + earnedPoints,
doubleBonus ? "#facc15" : "#4ade80"
);
if (comboCount === 101) {
playSynthEffect("newrecord");
showMessage("+10% XP BONUS!", "Ten percent X P bonus!");
} else if (comboCount === 201) {
playSynthEffect("newrecord");
showMessage("+20% XP BONUS!", "Twenty percent X P bonus!");
} else if (comboCount > 0 && comboCount % 80 === 0) {
overdriveRemainingMs = 6000;
feverNoteStep = 0;
playFeverRushBeat();
showMessage("FEVER x" + comboCount + "!", "Fever mode!");
} else if (wasCritical) {
triggerScreenShake();
playSynthEffect("epic");
showMessage("EPIC SAVE!", "Epic save!");
} else {
playSynthEffect("green");
checkComboMessages();
}
} else if (action === "red") {
triggerScreenShake();
playSynthEffect("red");
const value = Number(btn.dataset.value);
time = Number((time - value).toFixed(3));
comboCount = 0;
overdriveRemainingMs = 0;
spawnTapRipple(centerX, centerY, "#ef4444");
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
freezeRemainingMs = isDesktop ? 1700 : 1000;
updateTimerVisuals();
spawnTapRipple(centerX, centerY, "#38bdf8");
spawnStars(centerX, centerY, "ice");
spawnFloatingText(centerX, centerY, isDesktop ? "FREEZE 1.7s!" : "FREEZE 1s!", "#7dd3fc");
showMessage("FREEZE!", "Freeze!");
} else if (action === "clock") {
playSynthEffect("clock");
isSlowMo = true;
slowMoRemainingMs = isDesktop ? 2550 : 1500;
updateTimerVisuals();
spawnTapRipple(centerX, centerY, "#c084fc");
spawnStars(centerX, centerY, "clock");
spawnFloatingText(centerX, centerY, isDesktop ? "SLOW 2.55s!" : "SLOW 1.5s!", "#e9d5ff");
showMessage("SLOW TIME!", "Slow time!");
} else if (action === "bomb") {
triggerScreenShake();
playSynthEffect("bomb");
spawnTapRipple(centerX, centerY, "#ef4444");
spawnStars(centerX, centerY, "bomb");
spawnFloatingText(centerX, centerY, "BOOM!", "#ef4444");
time = 0;
timerCircle.textContent = "0.0";
removeButton(btn);
gameOver();
return;
} else if (action === "gold") {
playSynthEffect("gold");
doubleBonus = true;
doubleBonusRemainingMs = isDesktop ? 1700 : 1000;
spawnTapRipple(centerX, centerY, "#fde047");
spawnStars(centerX, centerY, "gold");
spawnFloatingText(centerX, centerY, isDesktop ? "2X TIME 1.7s!" : "2X TIME 1s!", "#facc15");
showMessage("2X TIME!", "Double time!");
}
timerCircle.textContent = time.toFixed(1);
scoreText.textContent = "SCORE: " + fmtNum(score);
comboText.textContent = "COMBO " + comboCount;
comboText.classList.toggle("combo-fire", comboCount >= 10);
updateTimerVisuals();
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
} else if (comboCount > 0 && comboCount % 25 === 0 && comboCount % 80 !== 0) {
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
if (spokenText) speakEnglish(spokenText, 1.08, 1.12);
messageTimeout = setTimeout(() => {
specialMessage.style.display = "none";
}, 1100);
}
function removeButton(btn) {
if (!btn) return;
const index = activeButtons.indexOf(btn);
if (index > -1) activeButtons.splice(index, 1);
if (btn.parentNode) btn.remove();
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
element.textContent = fmtNum(Math.round(current));
if (onComplete) onComplete();
} else {
element.textContent = fmtNum(Math.round(current));
}
}, 30);
}
function gameOver() {
if (!running) return;
running = false;
isPaused = false;
isResumingCountdown = false;
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
overdriveRemainingMs = 0;
pauseCooldownRemainingMs = 0;
updatePauseButtonUI();
clearSavedPausedState();
clearInterval(gameLoopInterval);
timerCircle.classList.remove("timer-panic", "timer-frozen", "timer-slowmo", "timer-max-cap");
game.classList.remove("slowmo-active", "overdrive-active");
while (activeButtons.length > 0) {
const firstBtn = activeButtons.shift();
if (firstBtn && firstBtn.parentNode) firstBtn.remove();
}
finalizeRunStatsAndShowSummary();
}
document.addEventListener("keydown", (event) => {
if (!running || isResumingCountdown) return;
const k = event.key.toLowerCase();
if (k === "d") {
event.preventDefault();
if (isPaused) {
playSynthEffect("click");
resumeGame();
} else if (pauseCooldownRemainingMs <= 0) {
playSynthEffect("click");
pauseGame();
}
}
});
function enterHomeScreen() {
refreshAllProfileAndRankUI();
if (menu) menu.style.display = "flex";
checkAndTriggerRankUpCelebration();
}
function runStartupSequence() {
if (!playerUsername) {
if (onboardingScreen) onboardingScreen.style.display = "flex";
} else {
enterHomeScreen();
}
}
if (saveProfileBtn && usernameInput) {
saveProfileBtn.addEventListener("click", () => {
if (playerUsername) return;
const chosen = usernameInput.value.trim().toUpperCase();
if (chosen.length < 2) {
usernameInput.focus();
return;
}
playerUsername = chosen;
localStorage.setItem("timeTapUsername", playerUsername);
initAudio();
playSynthEffect("newrecord");
if (onboardingScreen) onboardingScreen.style.display = "none";
enterHomeScreen();
});
}
runStartupSequence();
}
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initTimeTapGame);
} else {
initTimeTapGame();
}