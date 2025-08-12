const simbolos = [
  'symbol-10', 'symbol-j', 'symbol-q',
  'symbol-fire', 'symbol-water', 'symbol-wind',
  'symbol-lightning', 'symbol-rock'
];

const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
  document.getElementById("reel4"),
  document.getElementById("reel5"),
  document.getElementById("reel6")
];

const spinBtn = document.getElementById("spin-btn");
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const message = document.getElementById("message");

const spinSound = document.getElementById("spin-sound");
const stopSound = document.getElementById("stop-sound");
const winSound = document.getElementById("win-sound");
const bgMusic = document.getElementById("bg-music");

let credits = 1000;
const bet = 50;

function createReel(reel) {
  reel.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const symbolEl = document.createElement("div");
    const symbolClass = simbolos[Math.floor(Math.random() * simbolos.length)];
    symbolEl.classList.add("symbol", symbolClass);
    reel.appendChild(symbolEl);
  }
}

function spinReel(reel, duration, delay) {
  return new Promise(resolve => {
    const start = Date.now();
    let pos = 0;

    function animate() {
      const elapsed = Date.now() - start;
      if (elapsed > duration) {
        stopSound.play();
        resolve();
        return;
      }
      pos += 20;
      reel.style.transform = `translateY(${-pos}px)`;
      if (pos >= reel.scrollHeight / 2) pos = 0;
      requestAnimationFrame(animate);
    }

    setTimeout(() => requestAnimationFrame(animate), delay);
  });
}

spinBtn.addEventListener("click", async () => {
  if (credits < bet) {
    message.textContent = "No tienes suficientes créditos.";
    return;
  }
  credits -= bet;
  creditsEl.textContent = credits;
  message.textContent = "";
  spinBtn.disabled = true;
  spinSound.play();
  bgMusic.play();

  reels.forEach(createReel);

  for (let i = 0; i < reels.length; i++) {
    await spinReel(reels[i], 1500 + i * 500, i * 200);
  }

  const result = reels.map(r => r.children[2].classList[1]);
  if (result.every(s => s === result[0])) {
    message.textContent = "🎉 ¡Gran Victoria!";
    winSound.play();
    credits += bet * 10;
    creditsEl.textContent = credits;
    reels.forEach(r => r.classList.add("win-highlight"));
    setTimeout(() => reels.forEach(r => r.classList.remove("win-highlight")), 3000);
  } else {
    message.textContent = "❌ Intenta de nuevo";
  }

  spinBtn.disabled = false;
});
