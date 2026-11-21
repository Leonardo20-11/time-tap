function initTimeTapGame() {
    const onboardingScreen = document.getElementById("onboardingScreen");
    const onboardingShieldPreview = document.getElementById("onboardingShieldPreview");
    const usernameInput = document.getElementById("usernameInput");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    const profileCornerBtn = document.getElementById("profileCornerBtn");
    const homeProfileShield = document.getElementById("homeProfileShield");
    const homeProfileName = document.getElementById("homeProfileName");
    const homeProfileTitle = document.getElementById("homeProfileTitle");

    const homeXpRank = document.getElementById("homeXpRank");
    const homeXpNums = document.getElementById("homeXpNums");
    const homeXpFill = document.getElementById("homeXpFill");

    const profileModal = document.getElementById("profileModal");
    const closeProfileBtn = document.getElementById("closeProfileBtn");
    const profileEquipSlotBtn = document.getElementById("profileEquipSlotBtn");
    const goToBadgesFromProfileBtn = document.getElementById("goToBadgesFromProfileBtn");
    const profileModalAvatar = document.getElementById("profileModalAvatar");
    const profileModalUsername = document.getElementById("profileModalUsername");
    const profileModalStats = document.getElementById("profileModalStats");
    const equippedTitleLabel = document.getElementById("equippedTitleLabel");
    const profileBestScore = document.getElementById("profileBestScore");
    const profileBestCombo = document.getElementById("profileBestCombo");
    const profileCurrentRank = document.getElementById("profileCurrentRank");

    const openBadgesBtn = document.getElementById("openBadgesBtn");
    const badgesModal = document.getElementById("badgesModal");
    const closeBadgesBtn = document.getElementById("closeBadgesBtn");
    const badgesEquippedBanner = document.getElementById("badgesEquippedBanner");
    const badgesGridContainer = document.getElementById("badgesGridContainer");

    const playBtn = document.getElementById("playBtn");
    const discardSavedBtn = document.getElementById("discardSavedBtn");
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
    const levelModal = document.getElementById("levelModal");
    const closeLevelBtn = document.getElementById("closeLevelBtn");
    const rankedHeaderShield = document.getElementById("rankedHeaderShield");
    const levelCurrentName = document.getElementById("levelCurrentName");
    const levelXpText = document.getElementById("levelXpText");
    const nextRankHint = document.getElementById("nextRankHint");
    const levelNodesContainer = document.getElementById("levelNodesContainer");

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

    const LOCALE = "it-IT";
    const PAUSE_STATE_KEY = "timeTapSavedPausedState";
    const MAX_TIME = 8.0;
    const RING_CIRCUMFERENCE = 427.25;
    const BTN_RING_CIRCUMFERENCE = 314;

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
    let doubleBonus = false;
    let isFrozen = false;
    let isSlowMo = false;
    let isAnimatingRecord = false;
    let normalSpawnsSinceLastSpecial = 8;

    let freezeRemainingMs = 0;
    let slowMoRemainingMs = 0;
    let doubleBonusRemainingMs = 0;
    let overdriveRemainingMs = 0;
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
    let equippedBadgeLevel = Number(localStorage.getItem("equippedBadgeLevel")) || 1;
    let highestCelebratedLevel = Number(localStorage.getItem("highestCelebratedLevel")) || 1;

    const LEVELS_CONFIG = [
        { level: 1, name: "ROOKIE", title: "FRESH TAPPER", xpRequired: 0, gemColor: "#cbd5e1" },
        { level: 2, name: "BRONZE", title: "FAST FINGERS", xpRequired: 50000, gemColor: "#fbbf24" },
        { level: 3, name: "SILVER", title: "SHARP EYE", xpRequired: 250000, gemColor: "#f8fafc" },
        { level: 4, name: "GOLD", title: "GOLDEN REFLEX", xpRequired: 900000, gemColor: "#fde047" },
        { level: 5, name: "PLATINUM", title: "CHRONO KNIGHT", xpRequired: 2800000, gemColor: "#38bdf8" },
        { level: 6, name: "EMERALD", title: "TIME HUNTER", xpRequired: 7500000, gemColor: "#34d399" },
        { level: 7, name: "RUBY", title: "BLAZE TAPPER", xpRequired: 18000000, gemColor: "#fb7185" },
        { level: 8, name: "MASTER", title: "TIME WARLORD", xpRequired: 35000000, gemColor: "#e879f9" },
        { level: 9, name: "GRANDMASTER", title: "UNSTOPPABLE", xpRequired: 58000000, gemColor: "#fb923c" },
        { level: 10, name: "LEGEND", title: "MYTHIC CHRONO", xpRequired: 80000000, gemColor: "#38bdf8" },
        { level: 11, name: "IMMORTAL", title: "GOD OF TIME", xpRequired: 100000000, gemColor: "#fde047" }
    ];

    function fmtNum(n) {
        return Number(n || 0).toLocaleString(LOCALE);
    }

    function getAggressiveCrestHTML(lvlObj, sizePx = 58) {
        const tier = (lvlObj && typeof lvlObj.level === "number") ? lvlObj : LEVELS_CONFIG;
        const lv = tier.level || 1;
        const auraHtml = lv >= 5 ? '<div class="emblem-aura"></div>' : "";
        const haloHtml = lv >= 9 ? '<div class="emblem-halo"></div>' : "";
        const wingsClass = lv >= 8 ? "tier-high" : (lv >= 5 ? "tier-mid" : "");
        const wingsHtml = lv >= 2 ? '<div class="emblem-wings ' + wingsClass + '"></div>' : "";
        const bladesHtml = lv >= 7 ? '<div class="emblem-blades"></div>' : "";
        const hornsHtml = lv >= 6 ? '<div class="emblem-horns"></div>' : "";
        const crownHtml = lv >= 4 ? '<div class="emblem-crown"></div>' : "";
        const sideGemsHtml = lv >= 8 ? '<div class="emblem-side-gems"><span></span><span></span></div>' : "";
        const shieldClass = lv >= 6 ? "emblem-shield aggressive" : "emblem-shield";
        const gemClass = lv >= 7 ? "emblem-gem star-cut" : "emblem-gem";

        return '<div class="rank-emblem lv-' + lv + '" style="--sz:' + sizePx + 'px; --gem:' + tier.gemColor + ';">' +
            auraHtml + haloHtml + wingsHtml + bladesHtml + hornsHtml + crownHtml + sideGemsHtml +
            '<div class="' + shieldClass + '">' +
                '<div class="emblem-inner-rim">' +
                    '<div class="emblem-core">' +
                        '<div class="' + gemClass + '"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function calculateTotalXP() {
        const xpFromScore = totalScoreAccumulated * 2;
        const xpFromRecord = record * 5;
        const xpFromGames = gamesPlayed * 1200;
        return Math.min(100000000, xpFromScore + xpFromRecord + xpFromGames + storedBonusXP);
    }

    function getCurrentAndNextTier(currentXP) {
        let currentTier = LEVELS_CONFIG;
let nextTier = LEVELS_CONFIG || null;
for (let i = 0; i < LEVELS_CONFIG.length; i++) {
const item = LEVELS_CONFIG[i];
if (currentXP >= item.xpRequired) {
currentTier = item;
nextTier = LEVELS_CONFIG[i + 1] || null;
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
function triggerEquipFlash(el) {
if (!el) return;
el.classList.remove("equip-glow-anim");
void el.offsetWidth;
el.classList.add("equip-glow-anim");
}
function refreshAllProfileAndRankUI(animateHomeBarFromXP = null) {
const currentXP = calculateTotalXP();
const { currentTier, nextTier } = getCurrentAndNextTier(currentXP);
if (equippedBadgeLevel > currentTier.level) {
equippedBadgeLevel = currentTier.level;
localStorage.setItem("equippedBadgeLevel", equippedBadgeLevel);
}
const activeBadge = LEVELS_CONFIG.find(l => l.level === equippedBadgeLevel) || currentTier;
const displayName = playerUsername || "PLAYER";
if (homeProfileShield) homeProfileShield.innerHTML = getAggressiveCrestHTML(activeBadge, 48);
if (homeProfileName) homeProfileName.textContent = displayName;
if (homeProfileTitle) homeProfileTitle.textContent = activeBadge.name;
const targetPct = computeSegmentPercent(currentXP);
if (homeXpRank) homeXpRank.textContent = currentTier.name;
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
if (profileModalAvatar) profileModalAvatar.innerHTML = getAggressiveCrestHTML(activeBadge, 78);
if (profileModalUsername) profileModalUsername.textContent = displayName;
if (profileModalStats) {
profileModalStats.textContent = "GAMES: " + fmtNum(gamesPlayed) + " | XP: " + fmtNum(currentXP);
}
if (equippedTitleLabel) {
equippedTitleLabel.textContent = "EQUIPPED: " + activeBadge.name;
}
if (profileBestScore) profileBestScore.textContent = fmtNum(record);
if (profileBestCombo) profileBestCombo.textContent = fmtNum(bestCombo);
if (profileCurrentRank) profileCurrentRank.textContent = currentTier.name;
if (badgesEquippedBanner) badgesEquippedBanner.textContent = "EQUIPPED: " + activeBadge.name;
// GALLERIA STEMMI: mostra solo gli stemmi sbloccati + solo il nome accanto
if (badgesGridContainer) {
const unlockedLevels = LEVELS_CONFIG.filter(lvl => currentXP >= lvl.xpRequired);
badgesGridContainer.innerHTML = unlockedLevels.map(lvl => {
const isEquipped = lvl.level === equippedBadgeLevel;
const cls = "badge-card tier-" + lvl.level + (isEquipped ? " equipped" : "");
return '' +
getAggressiveCrestHTML(lvl, 78) +
'' + lvl.name + '' +
'';
}).join("");
badgesGridContainer.querySelectorAll(".badge-card").forEach(card => {
card.addEventListener("click", () => {
equippedBadgeLevel = Number(card.dataset.lvl);
localStorage.setItem("equippedBadgeLevel", equippedBadgeLevel);
playSynthEffect("gold");
refreshAllProfileAndRankUI();
if (badgesModal) badgesModal.style.display = "none";
if (profileModal) {
profileModal.style.display = "flex";
triggerEquipFlash(profileModalAvatar);
triggerEquipFlash(homeProfileShield);
}
});
});
}
// RANKED ROAD: 11 righe con stemma grande a sx + XP necessari sotto, linea gialla/bianca con pallino XP, stemma piccolo a dx
if (rankedHeaderShield) rankedHeaderShield.innerHTML = getAggressiveCrestHTML(currentTier, 54);
if (levelCurrentName) levelCurrentName.textContent = currentTier.name;
if (levelXpText) levelXpText.textContent = fmtNum(currentXP) + " / 100.000.000 XP";
if (nextRankHint) {
nextRankHint.textContent = nextTier
? nextTier.name + " • " + fmtNum(nextTier.xpRequired) + " XP"
: "MAX RANK";
}
if (levelNodesContainer) {
levelNodesContainer.innerHTML = LEVELS_CONFIG.map((lvl, i) => {
const nextLvl = LEVELS_CONFIG[i + 1] || null;
const unlocked = currentXP >= lvl.xpRequired;
let fillPct = 0;
let hasPin = false;
if (nextLvl) {
const span = nextLvl.xpRequired - lvl.xpRequired;
if (currentXP >= nextLvl.xpRequired) {
fillPct = 100;
} else if (currentXP >= lvl.xpRequired) {
fillPct = ((currentXP - lvl.xpRequired) / span) * 100;
hasPin = true;
}
} else {
fillPct = unlocked ? 100 : 0;
hasPin = unlocked;
}
const stateClass = (nextLvl && currentXP >= nextLvl.xpRequired) || (!nextLvl && unlocked)
? "completed"
: (hasPin ? "active" : "locked");
const rightEndHtml = nextLvl
? getAggressiveCrestHTML(nextLvl, 34)
: '';
const pinHtml = hasPin
? '' + fmtNum(currentXP) + ' XP'
: "";
const rowTitle = nextLvl ? nextLvl.name : lvl.name;
const rowXp = nextLvl ? fmtNum(nextLvl.xpRequired) + " XP" : fmtNum(lvl.xpRequired) + " XP";
return '' +
'' +
getAggressiveCrestHTML(lvl, 60) +
'' + lvl.name + '' +
'' + fmtNum(lvl.xpRequired) + ' XP' +
'' +
'' +
'' +
'' + rowTitle + '' +
'' + rowXp + '' +
'' +
'' +
'' +
'' +
pinHtml +
'' +
'' + rightEndHtml + '' +
'' +
'' +
'';
}).join("");
}
lastKnownXP = currentXP;
updateHomePlayButtonState();
}
if (profileCornerBtn && profileModal) {
profileCornerBtn.addEventListener("click", () => {
playSynthEffect("click");
refreshAllProfileAndRankUI();
profileModal.style.display = "flex";
});
}
if (closeProfileBtn && profileModal) {
closeProfileBtn.addEventListener("click", () => {
playSynthEffect("click");
profileModal.style.display = "none";
});
}
function openBadgesFromProfile() {
playSynthEffect("click");
if (profileModal) profileModal.style.display = "none";
refreshAllProfileAndRankUI();
if (badgesModal) badgesModal.style.display = "flex";
}
if (profileEquipSlotBtn) {
profileEquipSlotBtn.addEventListener("click", openBadgesFromProfile);
}
if (goToBadgesFromProfileBtn) {
goToBadgesFromProfileBtn.addEventListener("click", openBadgesFromProfile);
}
if (openBadgesBtn && badgesModal) {
openBadgesBtn.addEventListener("click", () => {
playSynthEffect("click");
refreshAllProfileAndRankUI();
badgesModal.style.display = "flex";
});
}
if (closeBadgesBtn && badgesModal) {
closeBadgesBtn.addEventListener("click", () => {
playSynthEffect("click");
badgesModal.style.display = "none";
});
}
if (levelBtn && levelModal) {
levelBtn.addEventListener("click", () => {
playSynthEffect("click");
levelModal.style.display = "flex";
refreshAllProfileAndRankUI();
});
}
if (closeLevelBtn && levelModal) {
closeLevelBtn.addEventListener("click", () => {
playSynthEffect("click");
levelModal.style.display = "none";
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
equippedBadgeLevel = currentTier.level;
localStorage.setItem("equippedBadgeLevel", equippedBadgeLevel);
refreshAllProfileAndRankUI();
if (rankUpCelebration) {
if (celebrationShieldSlot) celebrationShieldSlot.innerHTML = getAggressiveCrestHTML(currentTier, 112);
if (celebrationRankName) celebrationRankName.textContent = currentTier.name;
if (celebrationTitleUnlocked) celebrationTitleUnlocked.textContent = "RANK " + currentTier.level + " / 11";
rankUpCelebration.style.display = "flex";
playSynthEffect("newrecord");
speakEnglish("New rank unlocked! " + currentTier.name, 1.05, 1.15);
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
// --- ICONE SVG REALISTICHE E DETTAGLIATE PER I POWER-UP ---
const SPECIAL_SVGS = {
bomb: '' +
'' +
'' +
'' +
'' +
'' +
'' +
'' +
'',
ice: '' +
'' +
'' +
'' +
'',
clock: '' +
'' +
'' +
'' +
'' +
'' +
'',
gold: '' +
'' +
''
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
const symbols = {
ArrowUp: "↑",
ArrowDown: "↓",
ArrowLeft: "←",
ArrowRight: "→"
};
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
if (!running || isPaused || pauseCooldownRemainingMs > 0) return;
isPaused = true;
savePausedGameState();
if (pauseOverlay) pauseOverlay.style.display = "flex";
}
function resumeGame() {
if (!isPaused) return;
isPaused = false;
clearSavedPausedState();
if (pauseOverlay) pauseOverlay.style.display = "none";
pauseCooldownRemainingMs = 6000;
updatePauseButtonUI();
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
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
overdriveRemainingMs = 0;
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
if (menu) menu.style.display = "none";
if (countdown) countdown.style.display = "none";
if (game) game.style.display = "block";
timerCircle.textContent = time.toFixed(1);
scoreText.textContent = "SCORE: " + fmtNum(score);
comboText.textContent = "COMBO " + comboCount;
if (Array.isArray(saved.buttons)) {
saved.buttons.forEach(bData => createButton(bData));
}
clearSavedPausedState();
startGame(true);
pauseCooldownRemainingMs = 6000;
updatePauseButtonUI();
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
if (discardSavedBtn) {
discardSavedBtn.addEventListener("click", () => {
playSynthEffect("click");
clearSavedPausedState();
startCountdown();
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
updatePauseButtonUI();
updateTimerVisuals();
if (!isRestored) {
normalSpawnsSinceLastSpecial = 8;
createButton();
createButton();
}
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
function renderButtonInner(btn, type, key, valueText) {
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
const desktopNow = window.innerWidth >= 768;
if (desktopNow) {
const arrowSymbol = symbols[key] || "";
btn.innerHTML = ringSvg + '' + arrowSymbol + '' + contentHtml + '';
} else {
btn.innerHTML = ringSvg + '' + contentHtml + '';
}
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
// x2, freeze e orologio appaiono SOLO sotto i 3.0 secondi e sono rarissimi
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
// Durante i 6 secondi di overdrive (ogni 30 combo) i tasti verdi restano leggermente di meno
let durationMs = baseButtonDuration;
if (type === "green" && overdriveRemainingMs > 0) {
durationMs = Math.round(baseButtonDuration * 0.80);
}
btn.dataset.key = key;
btn.dataset.action = type;
btn.dataset.totalMs = forcedConfig ? (forcedConfig.totalMs || durationMs) : durationMs;
btn.dataset.remainingMs = forcedConfig ? forcedConfig.remainingMs : durationMs;
renderButtonInner(btn, type, key, valueText);
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
// Ogni 30 combo: schermo tutto illuminato per 6 secondi
if (comboCount > 0 && comboCount % 30 === 0) {
overdriveRemainingMs = 6000;
playSynthEffect("newrecord");
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
freezeRemainingMs = 1000;
updateTimerVisuals();
spawnTapRipple(centerX, centerY, "#38bdf8");
spawnStars(centerX, centerY, "ice");
spawnFloatingText(centerX, centerY, "FREEZE 1s!", "#7dd3fc");
showMessage("FREEZE!", "Freeze!");
} else if (action === "clock") {
playSynthEffect("clock");
isSlowMo = true;
slowMoRemainingMs = 1500;
updateTimerVisuals();
spawnTapRipple(centerX, centerY, "#c084fc");
spawnStars(centerX, centerY, "clock");
spawnFloatingText(centerX, centerY, "SLOW 1.5s!", "#e9d5ff");
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
doubleBonusRemainingMs = 1000;
spawnTapRipple(centerX, centerY, "#fde047");
spawnStars(centerX, centerY, "gold");
spawnFloatingText(centerX, centerY, "2X TIME 1s!", "#facc15");
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
} else if (comboCount > 0 && comboCount % 25 === 0 && comboCount % 30 !== 0) {
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
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
overdriveRemainingMs = 0;
clearSavedPausedState();
clearInterval(gameLoopInterval);
timerCircle.classList.remove("timer-panic", "timer-frozen", "timer-slowmo", "timer-max-cap");
game.classList.remove("slowmo-active", "overdrive-active");
while (activeButtons.length > 0) {
const firstBtn = activeButtons.shift();
if (firstBtn && firstBtn.parentNode) firstBtn.remove();
}
const xpBeforeRun = calculateTotalXP();
const isNewBest = score > record && score > 0;
gamesPlayed++;
totalScoreAccumulated += score;
if (isNewBest) {
record = score;
localStorage.setItem("record", record);
}
const runBonusXP = Math.floor(score * 1.5) + (maxComboRun * 250) + (isNewBest ? 5000 : 0);
storedBonusXP += runBonusXP;
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
xpEarnedBadge.textContent = "+" + fmtNum(earnedXP) + " XP";
}
const { currentTier: tierAfter, nextTier: nextAfter } = getCurrentAndNextTier(xpAfterRun);
if (goRankFrom) goRankFrom.textContent = tierAfter.name;
if (goRankTo) goRankTo.textContent = nextAfter ? nextAfter.name : "MAX";
if (goXpProgressText) {
goXpProgressText.textContent = nextAfter
? fmtNum(xpAfterRun) + " / " + fmtNum(nextAfter.xpRequired) + " XP"
: fmtNum(xpAfterRun) + " XP";
}
gameOverScreen.style.display = "flex";
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
document.addEventListener("keydown", (event) => {
if (!running || isPaused) return;
const target = activeButtons.find(b => b.dataset.key === event.key);
if (target) activateButton(target);
});
function enterHomeScreen() {
refreshAllProfileAndRankUI();
if (menu) menu.style.display = "flex";
checkAndTriggerRankUpCelebration();
}
function runStartupSequence() {
if (onboardingShieldPreview) {
onboardingShieldPreview.innerHTML = getAggressiveCrestHTML(LEVELS_CONFIG, 88);
}
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