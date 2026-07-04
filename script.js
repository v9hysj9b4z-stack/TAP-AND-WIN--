// ================================
// TAP & WIN
// PART 4A - DRAW THE WHEEL
// ================================

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const prizes = [
    "FREE HAIRCUT",
    "20% OFF",
    "10% OFF",
    "FREE COFFEE",
    "FREE DRINK",
    "FREE HAIR WAX",
    "FREE BEARD TRIM",
    "TRY AGAIN"
];

const colors = [
    "#F44336",
    "#FF9800",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
    "#00BCD4",
    "#FFD700",
    "#607D8B"
];

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 180;

let rotation = 0;

function drawWheel() {

    const angle = (Math.PI * 2) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < prizes.length; i++) {

        const start = rotation + i * angle;
        const end = start + angle;

        // Segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#111";
        ctx.stroke();

        // Text
        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate(start + angle / 2);

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Poppins";
        ctx.textAlign = "right";

        ctx.fillText(prizes[i], radius - 20, 5);

        ctx.restore();

    }

    // Center Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);

    ctx.fillStyle = "#FFD700";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

}

drawWheel();
// ================================
// PART 4B - SPIN ANIMATION
// ================================

const spinBtn = document.getElementById("spinBtn");

let spinning = false;
let spinSpeed = 0;

spinBtn.addEventListener("click", startSpin);

function startSpin(){

    if(spinning) return;

    spinning = true;

    spinBtn.disabled = true;

    spinSpeed = Math.random() * 0.35 + 0.45;

    animateSpin();

}

function animateSpin(){

    rotation += spinSpeed;

    spinSpeed *= 0.985;

    drawWheel();

    if(spinSpeed > 0.002){

        requestAnimationFrame(animateSpin);

    }else{

        spinning = false;

        spinBtn.disabled = false;

        showPrize();

    }

}
// ==========================================
// PART 4C
// SOUND + RESULT + CONFETTI
// ==========================================

const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

function playSpinSound(){

    if(spinSound){

        spinSound.currentTime = 0;
        spinSound.play().catch(()=>{});

    }

}

function playWinSound(){

    if(winSound){

        winSound.currentTime = 0;
        winSound.play().catch(()=>{});

    }

}

const oldStartSpin = startSpin;

startSpin = function(){

    document.getElementById("resultBox").classList.add("hidden");

    playSpinSound();

    oldStartSpin();

}


// Înlocuiește funcția showPrize() cu aceasta

function showPrize(){

    const slice = (Math.PI * 2) / prizes.length;

    let degrees = rotation * (180 / Math.PI);

    degrees = ((degrees % 360) + 360) % 360;

    let pointer = 270 - degrees;

    if(pointer < 0){

        pointer += 360;

    }

    const index = Math.floor(pointer / (360 / prizes.length));

    const prize = prizes[index];

    const box = document.getElementById("resultBox");

    const title = document.getElementById("resultTitle");

    const text = document.getElementById("resultPrize");

    if(prize === "TRY AGAIN"){

        title.innerHTML = "Better Luck Next Time";

        text.innerHTML = "Come back and try again!";

    }else{

        title.innerHTML = "Congratulations!";

        text.innerHTML = prize;

        playWinSound();

        confetti({

            particleCount:250,

            spread:120,

            startVelocity:45,

            origin:{y:0.6}

        });

    }

    box.classList.remove("hidden");

    box.animate(

        [

            {
                transform:"scale(.5)",
                opacity:0
            },

            {
                transform:"scale(1.08)",
                opacity:1
            },

            {
                transform:"scale(1)"
            }

        ],

        {

            duration:500,

            easing:"ease-out"

        }

    );

}
