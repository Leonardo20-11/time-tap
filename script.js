const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const timerCircle =
document.getElementById("timerCircle");

const countdown =
document.getElementById("countdown");

const scoreText =
document.getElementById("score");

const comboText =
document.getElementById("combo");

const specialMessage =
document.getElementById("specialMessage");

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

let time = 2.5;
let score = 0;
let comboCount = 0;

let running = false;
let doubleBonus = false;

let record =
localStorage.getItem("record") || 0;

document.getElementById("record")
.textContent =
"🏆 RECORD: " +
Number(record)
.toLocaleString("it-IT");

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

let buttonDuration = 1300;

if(window.innerWidth > 900){

    buttonDuration = 1700;

}

playBtn.onclick =
startCountdown;

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

    countdown.style.display =
    "block";

    countdown.textContent = "3";

    setTimeout(()=>{
        countdown.textContent="2";
    },1000);

    setTimeout(()=>{
        countdown.textContent="1";
    },2000);

    setTimeout(()=>{
        countdown.textContent="GO!";
    },3000);

    setTimeout(()=>{

        countdown.style.display =
        "none";

        game.style.display =
        "block";

        startGame();

    },4000);

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
            "5px solid red";

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

    },300);

}function createButton(){

    const freeArrows =
    arrows.filter(a =>
    !activeButtons.some(
    b => b.dataset.key === a
    ));

    if(freeArrows.length === 0)
    return;

    const greens =
    activeButtons.filter(
    b => b.dataset.action === "green"
    ).length;

    const reds =
    activeButtons.filter(
    b => b.dataset.action === "red"
    ).length;

    let type = "green";

    if(greens >= 3){

        type = "red";

    }

    if(reds >= 2){

        type = "green";

    }

    if(
    Math.random() < 0.02 &&
    greens > 0
    ){

        type = "gold";

    }

    const btn =
    document.createElement("button");

    btn.classList.add(
    "button-circle"
    );

    const key =
    freeArrows[
    Math.floor(
    Math.random()
    *
    freeArrows.length
    )
    ];

    let valueText = "";

    if(type === "green"){

        btn.classList.add("green");

        const value =
        [0.2,0.3,0.4,0.5]
        [
        Math.floor(
        Math.random()*4
        )
        ];

        btn.dataset.value =
        value;

        valueText =
        "+" + value;

    }else if(type==="red"){

        btn.classList.add("red");

        const value =
        [0.4,0.5,0.6,0.7]
        [
        Math.floor(
        Math.random()*4
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

    `<div class="arrow">
    ${symbols[key]}
    </div>

    <div class="value">
    ${valueText}
    </div>`;

    let x;
    let y;

    let valid = false;
    let attempts = 0;

    while(
        !valid &&
        attempts < 50
    ){

        attempts++;

        x =
        Math.random()
        *
        (window.innerWidth-120);

        y =
        Math.random()
        *
        (window.innerHeight-120);

        valid = true;

        if(
        x >
        window.innerWidth/2-320 &&
        x <
        window.innerWidth/2+180 &&
        y >
        window.innerHeight/2-320 &&
        y <
        window.innerHeight/2+180
        ){
            valid = false;
        }

        activeButtons.forEach(
        existing=>{

            const ex =
            parseInt(
            existing.style.left
            );

            const ey =
            parseInt(
            existing.style.top
            );

            const distance =
            Math.sqrt(

            Math.pow(
            x-ex,
            2
            )

            +

            Math.pow(
            y-ey,
            2
            )

            );

            if(distance < 210){

                valid = false;

            }

        });

    }

    if(!valid){
        return;
    }

    btn.style.left =
    x + "px";

    btn.style.top =
    y + "px";

    btn.onclick =
    () => activateButton(btn);

    document.body.appendChild(btn);

    activeButtons.push(btn);

    setTimeout(()=>{

        removeButton(btn);

    },buttonDuration);

}

function activateButton(btn){

    const action =
    btn.dataset.action;

    if(action==="green"){

        playAudio(greenSound);

        const value =
        Number(btn.dataset.value);

        time +=
        doubleBonus
        ? value*2
        : value;

        comboCount++;

        score +=
        100 +
        comboCount*20;

    }

    if(action==="red"){

        playAudio(redSound);

        const value =
        Number(btn.dataset.value);

        time -= value;

        comboCount = 0;
    }

    if(action==="gold"){

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

    removeButton(btn);
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

    if(!btn.parentNode)
    return;

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

        newRecordMessage.style.display =
        "block";

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

        activateButton(
        target
        );

    }

});
