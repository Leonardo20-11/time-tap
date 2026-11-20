function initTimeTapGame() {
    /* --- ELEMENTI SPLASH E PROFILO --- */
    const splashScreen = document.getElementById("splashScreen");
    const splashLoaderFill = document.getElementById("splashLoaderFill");
    const splashLoaderText = document.getElementById("splashLoaderText");
    const onboardingScreen = document.getElementById("onboardingScreen");
    const onboardingShieldPreview = document.getElementById("onboardingShieldPreview");
    const usernameInput = document.getElementById("usernameInput");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    const profileCornerBtn = document.getElementById("profileCornerBtn");
    const homeProfileShield = document.getElementById("homeProfileShield");
    const homeProfileName = document.getElementById("homeProfileName");
    const homeProfileTitle = document.getElementById("homeProfileTitle");

    /* --- ELEMENTI GIOCO E MENU --- */
    const playBtn = document.getElementById("playBtn");
    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const timerCircle = document.getElementById("timerCircle");
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

    /* --- PAUSA E RIPRISTINO --- */
    const pauseBtn = document.getElementById("pauseBtn");
    const pauseOverlay = document.getElementById("pauseOverlay");
    const resumeBtn = document.getElementById("resumeBtn");
    const quitToHomeBtn = document.getElementById("quitToHomeBtn");
    const pauseCooldownText = document.getElementById("pauseCooldownText");

    const savedRunModal = document.getElementById("savedRunModal");
    const resumeSavedRunBtn = document.getElementById("resumeSavedRunBtn");
    const newSavedRunBtn = document.getElementById("newSavedRunBtn");

    /* --- IMPOSTAZIONI --- */
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const audioToggleBtn = document.getElementById("audioToggleBtn");

    /* --- FULLSCREEN RANKED ROAD --- */
    const levelBtn = document.getElementById("levelBtn");
    const levelModal = document.getElementById("levelModal");
    const closeLevelBtn = document.getElementById("closeLevelBtn");
    const rankedHeaderShield = document.getElementById("rankedHeaderShield");
    const levelCurrentName = document.getElementById("levelCurrentName");
    const levelXpText = document.getElementById("levelXpText");
    const nextRankHint = document.getElementById("nextRankHint");
    const roadYellowFill = document.getElementById("roadYellowFill");
    const roadPlayerPin = document.getElementById("roadPlayerPin");
    const levelNodesContainer = document.getElementById("levelNodesContainer");

    /* --- FULLSCREEN STEMMI & TITOLI --- */
    const badgesModal = document.getElementById("badgesModal");
    const closeBadgesBtn = document.getElementById("closeBadgesBtn");
    const profileModalAvatar = document.getElementById("profileModalAvatar");
    const profileModalUsername = document.getElementById("profileModalUsername");
    const profileModalStats = document.getElementById("profileModalStats");
    const editUsernameInput = document.getElementById("editUsernameInput");
    const updateUsernameBtn = document.getElementById("updateUsernameBtn");
    const badgesGridContainer = document.getElementById("badgesGridContainer");

    /* --- CELEBRAZIONE NUOVO LIVELLO --- */
    const rankUpCelebration = document.getElementById("rankUpCelebration");
    const fireworksContainer = document.getElementById("fireworksContainer");
    const celebrationShieldSlot = document.getElementById("celebrationShieldSlot");
    const celebrationRankName = document.getElementById("celebrationRankName");
    const celebrationTitleUnlocked = document.getElementById("celebrationTitleUnlocked");
    const claimRankBtn = document.getElementById("claimRankBtn");

    /* --- CREAZIONE DINAMICA MESSAGGIO SPECIALE --- */
    let specialMessage = document.getElementById("specialMessage");
    if (!specialMessage) {
        specialMessage = document.createElement("div");
        specialMessage.id = "specialMessage";
        document.body.appendChild(specialMessage);
    }

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

    let freezeRemainingMs = 0;
    let slowMoRemainingMs = 0;
    let doubleBonusRemainingMs = 0;
    let pauseCooldownRemainingMs = 0;
    let gameLoopInterval = null;
    let spawnAccumulatorMs = 0;
    let messageTimeout = null;
    let panicTickCounter = 0;

    /* --- ICONE VETTORIALI UI (ZERO EMOJI) --- */
    const UI_SVGS = {
        lock: '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="4" y="11" width="16" height="10" rx="2.5" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="10" fill="#22c55e" stroke="#ffffff" stroke-width="1.5"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        soundOn: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#ffffff"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/></svg>',
        soundOff: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#cbd5e1"/><path d="M16 9l5 6M21 9l-5 6" stroke="#f87171" stroke-width="2.4" stroke-linecap="round"/></svg>',
        pause: '<svg viewBox="0 0 24 24" width="22" height="22"><rect x="6" y="5" width="4.5" height="14" rx="1.5" fill="#ffffff"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.5" fill="#ffffff"/></svg>'
    };

    /* --- PROFILO, STATISTICHE E 7 LIVELLI ESPONENZIALI --- */
    let playerUsername = localStorage.getItem("timeTapUsername") || "";
    let record = Number(localStorage.getItem("record")) || 0;
    let bestCombo = Number(localStorage.getItem("bestCombo")) || 0;
    let gamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;
    let totalScoreAccumulated = Number(localStorage.getItem("totalScoreAccumulated")) || 0;
    let equippedBadgeLevel = Number(localStorage.getItem("equippedBadgeLevel")) || 1;
    let highestCelebratedLevel = Number(localStorage.getItem("highestCelebratedLevel")) || 1;

    const LEVELS_CONFIG = [
        { level: 1, name: "ROOKIE", title: "FRESH TAPPER", xpRequired: 0, primary: "#cd7f32", secondary: "#7c2d12", accent: "#fdba74" },
        { level: 2, name: "CHALLENGER", title: "FAST FINGERS", xpRequired: 800, primary: "#e2e8f0", secondary: "#475569", accent: "#38bdf8" },
        { level: 3, name: "SKILLED", title: "GOLDEN REFLEX", xpRequired: 3200, primary: "#facc15", secondary: "#a16207", accent: "#fef08a" },
        { level: 4, name: "EXPERT", title: "CHRONO KNIGHT", xpRequired: 10500, primary: "#38bdf8", secondary: "#0369a1", accent: "#e0f2fe" },
        { level: 5, name: "MASTER", title: "TIME WARLORD", xpRequired: 28000, primary: "#c084fc", secondary: "#581c87", accent: "#f5d0fe" },
        { level: 6, name: "GRANDMASTER", title: "UNSTOPPABLE", xpRequired: 60000, primary: "#f43f5e", secondary: "#881337", accent: "#fde047" },
        { level: 7, name: "IMMORTAL", title: "GOD OF TIME", xpRequired: 100000, primary: "#10b981", secondary: "#064e3b", accent: "#facc15" }
    ];

    /* --- STEMMI VETTORIALI SEMPRE PIÙ AGGRESSIVI E RICCHI --- */
    function getAggressiveShieldSVG(lvlObj, size = 56) {
        const lv = lvlObj.level;
        let wings = "";
        let crownOrHorns = "";
        let coreEmblem = "";

        if (lv >= 2) {
            wings += '<polygon points="14,22 2,16 8,30 15,32" fill="' + lvlObj.primary + '" stroke="#ffffff" stroke-width="1.5"/>';
            wings += '<polygon points="50,22 62,16 56,30 49,32" fill="' + lvlObj.primary + '" stroke="#ffffff" stroke-width="1.5"/>';
        }
        if (lv >= 4) {
            wings += '<polygon points="15,34 1,35 9,46 18,44" fill="' + lvlObj.secondary + '" stroke="' + lvlObj.accent + '" stroke-width="1.5"/>';
            wings += '<polygon points="49,34 63,35 55,46 46,44" fill="' + lvlObj.secondary + '" stroke="' + lvlObj.accent + '" stroke-width="1.5"/>';
        }
        if (lv >= 6) {
            wings += '<polygon points="16,14 2,4 12,20" fill="' + lvlObj.accent + '"/>';
            wings += '<polygon points="48,14 62,4 52,20" fill="' + lvlObj.accent + '"/>';
        }

        if (lv === 3 || lv === 4) {
            crownOrHorns = '<polygon points="22,12 26,4 32,10 38,4 42,12" fill="#facc15" stroke="#ffffff" stroke-width="1.3"/>';
        } else if (lv === 5) {
            crownOrHorns = '<path d="M20 14 L14 3 L26 11 L32 2 L38 11 L50 3 L44 14 Z" fill="' + lvlObj.accent + '" stroke="#ffffff" stroke-width="1.3"/>';

} else if (lv >= 6) {
crownOrHorns = '';
}
if (lv === 1) {
coreEmblem = '';
} else if (lv === 2) {
coreEmblem = '';
} else if (lv === 3) {
coreEmblem = '';
} else if (lv === 4) {
coreEmblem = '';
} else if (lv === 5) {
coreEmblem = '';
} else if (lv === 6) {
coreEmblem = '';
} else {
coreEmblem = '';
}
const shieldPoints = lv >= 5
? "12,14 32,6 52,14 48,44 32,62 16,44"
: "14,15 32,8 50,15 47,42 32,59 17,42";
const innerPoints = lv >= 5
? "16,17 32,10 48,17 44,41 32,56 20,41"
: "18,18 32,12 46,18 43,39 32,53 21,39";
return '' +
wings +
crownOrHorns +
'' +
'' +
'' +
coreEmblem +
'LV.' + lv + '' +
'';
}
function calculateTotalXP() {
const xpFromGames = gamesPlayed * 120;
const xpFromRecord = Math.floor(record * 0.85);
const xpFromTotal = Math.floor(totalScoreAccumulated * 0.15);
return Math.min(100000, xpFromGames + xpFromRecord + xpFromTotal);
}
function getCurrentAndNextTier(currentXP) {
let currentTier = LEVELS_CONFIG;
let nextTier = LEVELS_CONFIG;
for (let i = 0; i < LEVELS_CONFIG.length; i++) {
if (currentXP >= LEVELS_CONFIG[i].xpRequired) {
currentTier = LEVELS_CONFIG[i];
nextTier = LEVELS_CONFIG[i + 1] || null;
}
}
return { currentTier, nextTier };
}
function computeRoadProgressPercent(currentXP) {
const totalSegments = LEVELS_CONFIG.length - 1;
if (currentXP >= LEVELS_CONFIG[totalSegments].xpRequired) return 100;
for (let i = 0; i < totalSegments; i++) {
const startXP = LEVELS_CONFIG[i].xpRequired;
const endXP = LEVELS_CONFIG[i + 1].xpRequired;
if (currentXP >= startXP && currentXP < endXP) {
const segFraction = (currentXP - startXP) / (endXP - startXP);
return ((i + segFraction) / totalSegments) * 100;
}
}
return 0;
}
/* --- AGGIORNAMENTO UI PROFILO, CLASSIFICATA E STEMMI --- */
function refreshAllProfileAndRankUI() {
const currentXP = calculateTotalXP();
const { currentTier, nextTier } = getCurrentAndNextTier(currentXP);
if (equippedBadgeLevel > currentTier.level) {
equippedBadgeLevel = currentTier.level;
localStorage.setItem("equippedBadgeLevel", equippedBadgeLevel);
}
const activeBadge = LEVELS_CONFIG.find(l => l.level === equippedBadgeLevel) || currentTier;
const displayName = playerUsername || "PLAYER";
if (homeProfileShield) homeProfileShield.innerHTML = getAggressiveShieldSVG(activeBadge, 46);
if (homeProfileName) homeProfileName.textContent = displayName;
if (homeProfileTitle) homeProfileTitle.textContent = activeBadge.title;
const recordEl = document.getElementById("record");
const bestComboEl = document.getElementById("bestComboHome");
if (recordEl) recordEl.textContent = record.toLocaleString("it-IT");
if (bestComboEl) bestComboEl.textContent = bestCombo.toLocaleString("it-IT");
/* Aggiorna schermata Fullscreen Classificata */
if (rankedHeaderShield) rankedHeaderShield.innerHTML = getAggressiveShieldSVG(currentTier, 52);
if (levelCurrentName) levelCurrentName.textContent = currentTier.level + ". " + currentTier.name;
if (levelXpText) levelXpText.textContent = currentXP.toLocaleString("it-IT") + " / 100.000 XP";
if (nextRankHint) {
nextRankHint.textContent = nextTier
? "NEXT: " + nextTier.name + " (" + nextTier.xpRequired.toLocaleString("it-IT") + " XP)"
: "MAX RANK ACHIEVED!";
}
const pct = computeRoadProgressPercent(currentXP);
const desktopNow = window.innerWidth >= 768;
if (roadYellowFill && roadPlayerPin) {
if (desktopNow) {
roadYellowFill.style.height = "10px";
roadYellowFill.style.width = "calc((100% - 144px) * " + (pct / 100) + ")";
roadPlayerPin.style.top = "102px";
roadPlayerPin.style.left = "calc(72px + (100% - 144px) * " + (pct / 100) + ")";
} else {
roadYellowFill.style.width = "8px";
roadYellowFill.style.height = "calc((100% - 72px) * " + (pct / 100) + ")";
roadPlayerPin.style.left = "26px";
roadPlayerPin.style.top = "calc(36px + (100% - 72px) * " + (pct / 100) + ")";
}
}
if (levelNodesContainer) {
levelNodesContainer.innerHTML = LEVELS_CONFIG.map(lvl => {
const unlocked = currentXP >= lvl.xpRequired;
return '<div class="road-node-card ' + (unlocked ? "unlocked" : "locked") + '">' +
'' + getAggressiveShieldSVG(lvl, 62) + '' +
'' +
'' + lvl.level + '. ' + lvl.name + '' +
'' + lvl.xpRequired.toLocaleString("it-IT") + ' XP' +
'TITLE: ' + lvl.title + '' +
'' +
'';
}).join("");
}
/* Aggiorna schermata Fullscreen Stemmi & Profilo */
if (profileModalAvatar) profileModalAvatar.innerHTML = getAggressiveShieldSVG(activeBadge, 56);
if (profileModalUsername) profileModalUsername.textContent = displayName;
if (profileModalStats) {
profileModalStats.textContent = "GAMES: " + gamesPlayed + " | XP: " + currentXP.toLocaleString("it-IT");
}
if (badgesGridContainer) {
badgesGridContainer.innerHTML = LEVELS_CONFIG.map(lvl => {
const unlocked = currentXP >= lvl.xpRequired;
const isEquipped = unlocked && lvl.level === equippedBadgeLevel;
const cls = "badge-card " + (unlocked ? "unlocked" : "locked") + (isEquipped ? " equipped" : "");
const statusHtml = !unlocked
? UI_SVGS.lock + '' + lvl.xpRequired.toLocaleString("it-IT") + ' XP'
: (isEquipped ? UI_SVGS.check + 'EQUIPPED' : 'TAP TO EQUIP');
return '' +
getAggressiveShieldSVG(lvl, 68) +
'' + lvl.level + '. ' + lvl.name + '' +
'' + lvl.title + '' +
'' + statusHtml + '' +
'';
}).join("");
badgesGridContainer.querySelectorAll(".badge-card.unlocked").forEach(card => {
card.addEventListener("click", () => {
equippedBadgeLevel = Number(card.dataset.lvl);
localStorage.setItem("equippedBadgeLevel", equippedBadgeLevel);
playSynthEffect("gold");
refreshAllProfileAndRankUI();
});
});
}
}
/* --- FUOCHI D'ARTIFICIO E CELEBRAZIONE NUOVO LIVELLO --- */
function launchFireworksShow() {
if (!fireworksContainer) return;
fireworksContainer.innerHTML = "";
const colors = ["#facc15", "#ef4444", "#22c55e", "#38bdf8", "#c084fc", "#ffffff"];
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
if (celebrationShieldSlot) celebrationShieldSlot.innerHTML = getAggressiveShieldSVG(currentTier, 118);
if (celebrationRankName) celebrationRankName.textContent = currentTier.level + ". " + currentTier.name;
if (celebrationTitleUnlocked) celebrationTitleUnlocked.textContent = "NEW TITLE: " + currentTier.title;
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
if (profileCornerBtn && badgesModal) {
        profileCornerBtn.addEventListener("click", () => {
            playSynthEffect("click");
            refreshAllProfileAndRankUI();
            if (editUsernameInput) editUsernameInput.value = playerUsername;
            badgesModal.style.display = "flex";
        });
    }

    if (closeBadgesBtn && badgesModal) {
        closeBadgesBtn.addEventListener("click", () => {
            playSynthEffect("click");
            badgesModal.style.display = "none";
        });
    }

    if (updateUsernameBtn && editUsernameInput) {
        updateUsernameBtn.addEventListener("click", () => {
            const cleaned = editUsernameInput.value.trim().toUpperCase();
            if (cleaned.length >= 2) {
                playerUsername = cleaned;
                localStorage.setItem("timeTapUsername", playerUsername);
                playSynthEffect("gold");
                refreshAllProfileAndRankUI();
            }
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

    window.addEventListener("resize", () => {
        if (levelModal && levelModal.style.display === "flex") {
            refreshAllProfileAndRankUI();
        }
    });

    /* --- ICONE SVG REALISTICHE PER POTERI --- */
    const SPECIAL_SVGS = {
        bomb: '<svg class="special-svg-icon" viewBox="0 0 64 64">' +
            '<defs>' +
                '<radialGradient id="bombGrad" cx="35%" cy="35%" r="65%">' +
                    '<stop offset="0%" stop-color="#94a3b8"/>' +
                    '<stop offset="45%" stop-color="#1e293b"/>' +
                    '<stop offset="100%" stop-color="#020617"/>' +
                '</radialGradient>' +
            '</defs>' +
            '<path d="M40 16 C45 10, 52 10, 56 14" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<circle cx="57" cy="14" r="4.5" fill="#fbbf24"/>' +
            '<circle cx="57" cy="14" r="2.2" fill="#ffffff"/>' +
            '<rect x="33" y="14" width="10" height="7" rx="2" transform="rotate(35 38 17)" fill="#475569"/>' +
            '<circle cx="30" cy="36" r="21" fill="url(#bombGrad)" stroke="#334155" stroke-width="1.5"/>' +
            '<ellipse cx="22" cy="27" rx="6" ry="3.5" transform="rotate(-35 22 27)" fill="rgba(255,255,255,0.4)"/>' +
        '</svg>',
        ice: '<svg class="special-svg-icon" viewBox="0 0 64 64">' +
            '<defs>' +
                '<linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#ffffff"/>' +
                    '<stop offset="50%" stop-color="#7dd3fc"/>' +
                    '<stop offset="100%" stop-color="#0284c7"/>' +
                '</linearGradient>' +
            '</defs>' +
            '<polygon points="32,4 42,20 58,20 48,34 56,50 38,46 32,60 26,46 8,50 16,34 6,20 22,20" fill="url(#iceGrad)" stroke="#e0f2fe" stroke-width="2" stroke-linejoin="round"/>' +
            '<polygon points="32,14 38,26 50,26 41,34 45,45 32,39 19,45 23,34 14,26 26,26" fill="rgba(255,255,255,0.5)"/>' +
        '</svg>',
        clock: '<svg class="special-svg-icon" viewBox="0 0 64 64">' +
            '<defs>' +
                '<radialGradient id="clockFace" cx="40%" cy="35%" r="65%">' +
                    '<stop offset="0%" stop-color="#ffffff"/>' +
                    '<stop offset="70%" stop-color="#f3e8ff"/>' +
                    '<stop offset="100%" stop-color="#d8b4fe"/>' +
                '</radialGradient>' +
            '</defs>' +
            '<circle cx="32" cy="34" r="23" fill="#581c87"/>' +
            '<circle cx="32" cy="34" r="19.5" fill="url(#clockFace)" stroke="#f5d0fe" stroke-width="1.5"/>' +
            '<rect x="29" y="6" width="6" height="5" rx="1.5" fill="#a855f7"/>' +
            '<line x1="32" y1="34" x2="32" y2="21" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>' +
            '<line x1="32" y1="34" x2="42" y2="34" stroke="#9333ea" stroke-width="2.5" stroke-linecap="round"/>' +
            '<circle cx="32" cy="34" r="2.5" fill="#0f172a"/>' +
        '</svg>'
    };

    /* --- GESTIONE AUDIO E IMPOSTAZIONI --- */
    let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

    function updateAudioButton() {
        if (!audioToggleBtn) return;
        audioToggleBtn.innerHTML = soundEnabled
            ? UI_SVGS.soundOn + ' <span>ON</span>'
            : UI_SVGS.soundOff + ' <span>OFF</span>';
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
function triggerScreenShake() {
game.classList.remove("screen-shake");
void game.offsetWidth;
game.classList.add("screen-shake");
}
/* --- GESTIONE PAUSA (STOP) CON COOLDOWN 6s + PULSANTE HOME FUNZIONANTE --- */
const PAUSE_STATE_KEY = "timeTapSavedPausedState";
function savePausedGameState() {
const savedButtons = activeButtons.map(btn => ({
action: btn.dataset.action,
key: btn.dataset.key,
value: btn.dataset.value || "",
left: parseFloat(btn.style.left) || 0,
top: parseFloat(btn.style.top) || 0,
remainingMs: Math.max(250, Number(btn.dataset.remainingMs) || baseButtonDuration)
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
buttons: savedButtons
};
localStorage.setItem(PAUSE_STATE_KEY, JSON.stringify(payload));
}
function clearSavedPausedState() {
localStorage.removeItem(PAUSE_STATE_KEY);
}
function updatePauseButtonUI() {
if (!pauseBtn) return;
if (pauseCooldownRemainingMs > 0) {
const secLeft = Math.ceil(pauseCooldownRemainingMs / 1000);
pauseBtn.disabled = true;
pauseBtn.classList.add("on-cooldown");
if (pauseCooldownText) {
pauseCooldownText.textContent = secLeft + "s";
pauseCooldownText.style.display = "inline";
} else {
pauseBtn.innerHTML = '' + secLeft + 's';
}
} else {
pauseBtn.disabled = false;
pauseBtn.classList.remove("on-cooldown");
if (pauseCooldownText) {
pauseCooldownText.style.display = "none";
} else {
pauseBtn.innerHTML = UI_SVGS.pause;
}
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
function returnDirectlyToHome() {
running = false;
isPaused = false;
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
clearInterval(gameLoopInterval);
clearSavedPausedState();
while (activeButtons.length > 0) {
const b = activeButtons.shift();
if (b && b.parentNode) b.remove();
}
if (pauseOverlay) pauseOverlay.style.display = "none";
if (gameOverScreen) gameOverScreen.style.display = "none";
if (game) game.style.display = "none";
if (countdown) countdown.style.display = "none";
if (menu) menu.style.display = "flex";
time = baseTime;
score = 0;
comboCount = 0;
maxComboRun = 0;
if (timerCircle) {
timerCircle.textContent = time.toFixed(1);
timerCircle.classList.remove("timer-panic", "timer-frozen", "timer-slowmo");
}
if (scoreText) scoreText.textContent = "SCORE: 0";
if (comboText) comboText.textContent = "COMBO 0";
refreshAllProfileAndRankUI();
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
returnDirectlyToHome();
});
}
window.addEventListener("beforeunload", () => {
if (running && isPaused) {
savePausedGameState();
}
});
if (playBtn) {
playBtn.addEventListener("click", () => {
clearSavedPausedState();
playSynthEffect("click");
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
if (timerCircle) timerCircle.textContent = time.toFixed(1);
if (scoreText) scoreText.textContent = "SCORE: 0";
if (comboText) comboText.textContent = "COMBO 0";
startCountdown();
}
});
}
if (homeBtn) {
homeBtn.addEventListener("click", () => {
if (!isAnimatingRecord) {
playSynthEffect("click");
returnDirectlyToHome();
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
timerCircle.classList.toggle("timer-frozen", isFrozen);
timerCircle.classList.toggle("timer-slowmo", isSlowMo && !isFrozen);
game.classList.toggle("slowmo-active", isSlowMo);
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
if (isFrozen) {
freezeRemainingMs -= TICK_MS;
if (freezeRemainingMs <= 0) {
isFrozen = false;
freezeRemainingMs = 0;
updateTimerVisuals();
}
}
if (isSlowMo) {
slowMoRemainingMs -= TICK_MS;
if (slowMoRemainingMs <= 0) {
isSlowMo = false;
slowMoRemainingMs = 0;
updateTimerVisuals();
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
btn.dataset.remainingMs = rem;
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
contentHtml = SPECIAL_SVGS.bomb;
} else if (type === "ice") {
contentHtml = SPECIAL_SVGS.ice + '1.0s';
} else if (type === "clock") {
contentHtml = SPECIAL_SVGS.clock + '1.5s';
} else {
contentHtml = valueText;
}
const desktopNow = window.innerWidth >= 768;
if (desktopNow) {
const arrowSymbol = symbols[key] || "";
btn.innerHTML = '' + arrowSymbol + '' + contentHtml + '';
} else {
btn.innerHTML = '' + contentHtml + '';
}
}
/* --- SPAWN BILANCIATO: SEMPRE MISTI VERDI E ROSSI (MAX 4 VERDI, MAX 2 ROSSI) --- */
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
/* Garantisce sempre il mix: non permette mai che siano tutti verdi o tutti rossi */
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
/* Poteri speciali: Orologio, Freeze e x2 prendono il posto di un VERDE; Bomba di un ROSSO */
if (!hasSpecialOnScreen) {
const rand = Math.random();
if (type === "green") {
if (rand < 0.025 && !isSlowMo) {
type = "clock"; // Orologio (1.5s slow-mo)
} else if (rand < 0.055 && !isFrozen) {
type = "ice"; // Freeze (1.0s)
} else if (rand < 0.095 && !doubleBonus) {
type = "gold"; // x2 (raddoppia i decimi verdi per 1.5s)
}
} else if (type === "red") {
if (rand < 0.035) {
type = "bomb"; // Bomba rara
}
}
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
const greenOptions = isDesktop ? [0.400, 0.500, 0.550] : [0.300, 0.350, 0.400];
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
valueText = "x2";
}
btn.dataset.key = key;
btn.dataset.action = type;
btn.dataset.remainingMs = forcedConfig ? forcedConfig.remainingMs : baseButtonDuration;
renderButtonInner(btn, type, key, valueText);
let x = 0;
let y = 0;
if (forcedConfig) {
x = forcedConfig.left;
y = forcedConfig.top;
} else {
const btnSize = isDesktop ? 165 : 108;
const minCenterDist = isDesktop ? 235 : 145;
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
time = Number((time + addedTime).toFixed(3));
comboCount++;
if (comboCount > maxComboRun) maxComboRun = comboCount;
const earnedPoints = 100 + comboCount * 20;
score += earnedPoints;
spawnStars(centerX, centerY, "green");
spawnFloatingText(
centerX,
centerY,
(doubleBonus ? "2X +" : "+") + earnedPoints,
doubleBonus ? "#facc15" : "#4ade80"
);
if (wasCritical) {
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
spawnStars(centerX, centerY, "ice");
spawnFloatingText(centerX, centerY, "FREEZE 1s!", "#7dd3fc");
showMessage("FREEZE!", "Freeze!");
} else if (action === "clock") {
playSynthEffect("clock");
isSlowMo = true;
slowMoRemainingMs = 1500;
updateTimerVisuals();
spawnStars(centerX, centerY, "clock");
spawnFloatingText(centerX, centerY, "SLOW MOTION 1.5s!", "#e9d5ff");
showMessage("SLOW TIME!", "Slow time!");
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
playSynthEffect("gold");
doubleBonus = true;
doubleBonusRemainingMs = 1500; // Raddoppia i decimi verdi per 1,5 secondi
spawnStars(centerX, centerY, "gold");
spawnFloatingText(centerX, centerY, "2X TIME 1.5s!", "#facc15");
showMessage("DOUBLE TIME!", "Double time!");
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
isPaused = false;
isFrozen = false;
isSlowMo = false;
doubleBonus = false;
clearSavedPausedState();
clearInterval(gameLoopInterval);
timerCircle.classList.remove("timer-panic", "timer-frozen", "timer-slowmo");
game.classList.remove("slowmo-active");
while (activeButtons.length > 0) {
const firstBtn = activeButtons.shift();
if (firstBtn && firstBtn.parentNode) firstBtn.remove();
}
gamesPlayed++;
totalScoreAccumulated += score;
localStorage.setItem("gamesPlayed", gamesPlayed);
localStorage.setItem("totalScoreAccumulated", totalScoreAccumulated);
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
refreshAllProfileAndRankUI();
}
function launchRestoredRun(saved) {
time = saved.time;
score = saved.score || 0;
comboCount = saved.comboCount || 0;
maxComboRun = saved.maxComboRun || 0;
doubleBonus = Boolean(saved.doubleBonus);
doubleBonusRemainingMs = saved.doubleBonusRemainingMs || 0;
isFrozen = Boolean(saved.isFrozen);
freezeRemainingMs = saved.freezeRemainingMs || 0;
isSlowMo = Boolean(saved.isSlowMo);
slowMoRemainingMs = saved.slowMoRemainingMs || 0;
if (savedRunModal) savedRunModal.style.display = "none";
if (menu) menu.style.display = "none";
if (countdown) countdown.style.display = "none";
if (game) game.style.display = "block";
timerCircle.textContent = time.toFixed(1);
scoreText.textContent = "SCORE: " + score.toLocaleString("it-IT");
comboText.textContent = "COMBO " + comboCount;
if (Array.isArray(saved.buttons)) {
saved.buttons.forEach(bData => createButton(bData));
}
startGame(true);
isPaused = true;
if (pauseOverlay) pauseOverlay.style.display = "flex";
}
function checkAndRestorePausedGame() {
const raw = localStorage.getItem(PAUSE_STATE_KEY);
if (!raw) return;
try {
const saved = JSON.parse(raw);
if (!saved || typeof saved.time !== "number" || saved.time <= 0) {
clearSavedPausedState();
return;
}
if (savedRunModal && resumeSavedRunBtn && newSavedRunBtn) {
savedRunModal.style.display = "flex";
resumeSavedRunBtn.onclick = () => {
playSynthEffect("click");
launchRestoredRun(saved);
};
newSavedRunBtn.onclick = () => {
playSynthEffect("click");
clearSavedPausedState();
savedRunModal.style.display = "none";
};
} else {
launchRestoredRun(saved);
}
} catch (e) {
clearSavedPausedState();
}
}
document.addEventListener("keydown", (event) => {
if (!running || isPaused) return;
const target = activeButtons.find(b => b.dataset.key === event.key);
if (target) activateButton(target);
});
/* --- FLUSSO DI AVVIO: SPLASH -> PROFILO (SE NUOVO) -> HOME --- */
function enterHomeScreen() {
refreshAllProfileAndRankUI();
if (menu) menu.style.display = "flex";
checkAndRestorePausedGame();
checkAndTriggerRankUpCelebration();
}
function runStartupSequence() {
if (onboardingShieldPreview) {
onboardingShieldPreview.innerHTML = getAggressiveShieldSVG(LEVELS_CONFIG[0], 88);
}
let progress = 0;
const loadTimer = setInterval(() => {
progress += 8;
if (splashLoaderFill) {
splashLoaderFill.style.width = Math.min(100, progress) + "%";
}
if (progress >= 100) {
clearInterval(loadTimer);
if (splashLoaderText) splashLoaderText.textContent = "READY!";
setTimeout(() => {
if (splashScreen) splashScreen.style.display = "none";
if (!playerUsername) {
if (onboardingScreen) onboardingScreen.style.display = "flex";
} else {
enterHomeScreen();
}
}, 260);
}
}, 75);
}
if (saveProfileBtn && usernameInput) {
saveProfileBtn.addEventListener("click", () => {
const chosen = usernameInput.value.trim().toUpperCase();
playerUsername = chosen.length >= 2 ? chosen : "PLAYER 1";
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