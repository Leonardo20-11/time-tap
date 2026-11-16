const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const timerCircle = document.getElementById("timerCircle");
const countdown = document.getElementById("countdown");

const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");

const specialMessage = document.getElementById("specialMessage");

const gameOverScreen =
document.getElementById("gameOverScreen");

const finalScore =
document.getElementById("finalScore");

const finalRecord =
document.getElementById("finalRecord");

const playAgainBtn =
document.getElementById("playAgainBtn");

const homeBtn =
document.getElementById("homeBtn");

const newRecordMessage =
document.getElementById("newRecordMessage");

const greenSound =
document.getElementById("greenSound");

const redSound =
document.getElementById("redSound");

const goldSound =
document.getElementById("goldSound");

const epicSound =
document.getElementById("epicSound");

const threeSound =
document.getElementById("threeSound");

const twoSound =
document.getElementById("twoSound");

const oneSound =
document.getElementById("oneSound");

const goSound =
document.getElementById("goSound");

const bgMusic =
document.getElementById("bgMusic");

let time = 2.5;
let score = 0;
let comboCount = 0;

let running = false;
let doubleBonus = false;

let record =
localStorage.getItem("record") || 0;

document.getElementById("record").textContent =
"🏆 RECORD: " +
Number(record).toLocaleString("it-IT");

const activeButtons = [];

const arrows = [
"ArrowUp",
"ArrowDown",
"ArrowLeft",
"ArrowRight"
];

const symbols = {
ArrowUp:"↑",
ArrowDown:"↓",
ArrowLeft:"←",
ArrowRight:"→"
};

let buttonDuration = 1200;

if(window.innerWidth > 900){

    buttonDuration = 1550;

}

playBtn.onclick = startCountdown;

playAgainBtn.onclick =
() => location.reload();

homeBtn.onclick =
() => location.reload();

function playAudio(sound){

    if(!sound) return;

    sound.currentTime = 0;

    sound.volume = 1;

    sound.play().catch(()=>{});

}

function startCountdown(){

    menu.style.display = "none";

    countdown.style.display = "block";

    if(bgMusic){

        bgMusic.volume = 0.45;

        bgMusic.play().catch(()=>{});

    }

    const numbers =
    ["3","2","1","GO!"];

    let index = 0;

    countdown.textContent =
    numbers[index];

    playAudio(threeSound);

    const interval =
    setInterval(()=>{

        index++;

        if(index >= numbers.length){

            clearInterval(interval);

            countdown.style.display =
            "none";

            game.style.display =
            "block";

            startGame();

            return;
        }

        countdown.textContent =
        numbers[index];

        if(numbers[index] === "2"){
            playAudio(twoSound);
        }

        if(numbers[index] === "1"){
            playAudio(oneSound);
        }

        if(numbers[index] === "GO!"){
            playAudio(goSound);
        }

    },1000);

}

function startGame(){

    running = true;

    setInterval(()=>{

        if(!running) return;

        time -= 0.1;

        timerCircle.textContent =
        time.toFixed(1);

        if(time <= 1){

            timerCircle.style.border =
            "6px solid #ff4444";

        }

        if(time <= 0){

            gameOver();

        }

    },100);

    setInterval(()=>{

        if(!running) return;

        if(activeButtons.length < 5){

            createButton();

        }

    },320);

}
function createButton(){

    const freeArrows =
    arrows.filter(a =>
    !activeButtons.some(
    b => b.dataset.key === a
    ));

    if(freeArrows.length === 0) return;

    const btn =
    document.createElement("button");

    btn.classList.add(
    "button-circle"
    );

    const key =
    freeArrows[
    Math.floor(
    Math.random() *
    freeArrows.length
    )
    ];

    let type = "green";
    let valueText = "";

    if(Math.random() < 0.25){

        type = "red";

    }

    if(Math.random() < 0.03){

        type = "gold";

    }

    if(type === "green"){

        btn.classList.add("green");

        const values =
        [0.2,0.3,0.4,0.5];

        const value =
        values[
        Math.floor(
        Math.random() *
        values.length
        )
        ];

        btn.dataset.value =
        value;

        valueText =
        "+" + value;

    }else if(type === "red"){

        btn.classList.add("red");

        const values =
        [0.4,0.5,0.6,0.7];

        const value =
        values[
        Math.floor(
        Math.random() *
        values.length
        )
        ];

        btn.dataset.value =
        value;

        valueText =
        "-" + value;

    }else{

        btn.classList.add("gold");

        valueText = "x2";

    }

    btn.dataset.key = key;
    btn.dataset.action = type;

    btn.innerHTML =
    `<div class="arrow">${symbols[key]}</div>
     <div class="value">${valueText}</div>`;

    let x;
    let y;
    let valid = false;

    while(!valid){

        x =
        Math.random() *
        (window.innerWidth - 150);

        y =
        Math.random() *
        (window.innerHeight - 150);

        valid = true;

        if(
            x > window.innerWidth/2 - 240 &&
            x < window.innerWidth/2 + 120 &&
            y > window.innerHeight/2 - 240 &&
            y < window.innerHeight/2 + 120
        ){
            valid = false;
        }

        activeButtons.forEach(existing=>{

            const ex =
            parseInt(existing.style.left);

            const ey =
            parseInt(existing.style.top);

            const distance =
            Math.sqrt(
            Math.pow(x-ex,2) +
            Math.pow(y-ey,2)
            );

            if(distance < 160){

                valid = false;

            }

        });

    }

    btn.style.left = x + "px";
    btn.style.top = y + "px";

    btn.onclick =
    ()=>activateButton(btn);

    document.body.appendChild(btn);

    activeButtons.push(btn);

    setTimeout(()=>{

        removeButton(btn);

    },buttonDuration);

}

function activateButton(btn){

    if(navigator.vibrate){

        navigator.vibrate(20);

    }

    const action =
    btn.dataset.action;

    if(action === "green"){

        playAudio(greenSound);

        const value =
        Number(btn.dataset.value);

        time +=
        doubleBonus
        ? value * 2
        : value;

        comboCount++;

        let gained =
        100 +
        comboCount * 20;

        if(time <= 0.6){

            playAudio(epicSound);

            showMessage(
            "EPIC SAVE!"
            );

            gained *= 2;

        }

        score += gained;
    }

    if(action === "red"){

        playAudio(redSound);

        const value =
        Number(btn.dataset.value);

        time -= value;

        comboCount = 0;
    }

    if(action === "gold"){

        playAudio(goldSound);

        doubleBonus = true;

        showMessage(
        "INCREDIBLE!"
        );

        setTimeout(()=>{

            doubleBonus = false;

        },5000);
    }

    scoreText.textContent =
    "SCORE: " +
    Number(score)
    .toLocaleString("it-IT");

    comboText.textContent =
    "COMBO " +
    comboCount;

    checkCombo();

    removeButton(btn);
}

function checkCombo(){

    if(comboCount >= 100){
        showMessage("TIME MASTER!");
    }
    else if(comboCount >= 75){
        showMessage("UNSTOPPABLE!");
    }
    else if(comboCount >= 50){
        showMessage("IMMORTAL!");
    }
    else if(comboCount >= 40){
        showMessage("GODLIKE!");
    }
    else if(comboCount >= 30){
        showMessage("LEGENDARY!");
    }
    else if(comboCount >= 20){
        showMessage("INCREDIBLE!");
    }
    else if(comboCount >= 10){
        showMessage("AMAZING!");
    }
    else if(comboCount >= 5){
        showMessage("FANTASTIC!");
    }
}

function showMessage(text){

    specialMessage.textContent =
    text;

    specialMessage.style.display =
    "block";

    setTimeout(()=>{

        specialMessage.style.display =
        "none";

    },1200);
}

function removeButton(btn){

    if(!btn.parentNode) return;

    const index =
    activeButtons.indexOf(btn);

    if(index > -1){

        activeButtons.splice(
        index,
        1
        );
    }

    btn.remove();
}

function gameOver(){

    running = false;

    if(score > record){

        record = score;

        localStorage.setItem(
        "record",
        record
        );

        if(newRecordMessage){

            newRecordMessage.style.display =
            "block";

        }
    }

    finalScore.textContent =
    "SCORE: " +
    Number(score)
    .toLocaleString("it-IT");

    finalRecord.textContent =
    "RECORD: " +
    Number(record)
    .toLocaleString("it-IT");

    gameOverScreen.style.display =
    "flex";
}

document.addEventListener(
"keydown",
(event)=>{

    const target =
    activeButtons.find(
    b =>
    b.dataset.key ===
    event.key
    );

    if(target){

        activateButton(target);

    }

});