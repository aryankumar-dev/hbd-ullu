// ============ Configuration ============
// Change this to the moment the site should unlock.
const UNLOCK_DATE = new Date('2026-08-03T00:00:00');

// ============ Floating hearts background ============
function spawnHearts() {
  const container = document.getElementById('heartsBg');
  const symbols = ['❤️', '💕', '💖', '💗', '💓'];
  setInterval(() => {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    const duration = 6 + Math.random() * 6;
    heart.style.animationDuration = duration + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
  }, 500);
}

// ============ Countdown ============
function startCountdown() {
  const countdownScreen = document.getElementById('countdownScreen');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function unlock() {
    countdownScreen.classList.add('d-none');
    showPasswordScreen();
  }

  function tick() {
    const now = new Date().getTime();
    const distance = UNLOCK_DATE.getTime() - now;

    if (distance <= 0) {
      clearInterval(timer);
      unlock();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  if (UNLOCK_DATE.getTime() - Date.now() <= 0) {
    unlock();
    return;
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// ============ Since we met ============
const MET_DATE = new Date('2026-05-24T00:00:00');

function startSinceMetTimer() {
  const monthsEl = document.getElementById('metMonths');
  const daysEl = document.getElementById('metDays');
  const hoursEl = document.getElementById('metHours');
  const minutesEl = document.getElementById('metMinutes');
  const secondsEl = document.getElementById('metSeconds');

  function tick() {
    const now = new Date();

    let months = (now.getFullYear() - MET_DATE.getFullYear()) * 12 + (now.getMonth() - MET_DATE.getMonth());
    const cursor = new Date(MET_DATE);
    cursor.setMonth(cursor.getMonth() + months);
    if (cursor > now) {
      months--;
      cursor.setMonth(cursor.getMonth() - 1);
    }

    const remainderMs = now.getTime() - cursor.getTime();
    const days = Math.floor(remainderMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainderMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainderMs % (1000 * 60)) / 1000);

    monthsEl.textContent = months;
    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// ============ Password game ============
function getDaysSinceMet() {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - MET_DATE.getTime()) / msPerDay);
}

function showPasswordScreen() {
  document.getElementById('passwordScreen').classList.remove('d-none');
}

function setupPasswordGame() {
  const form = document.getElementById('passwordForm');
  const input = document.getElementById('passwordInput');
  const wrongMsg = document.getElementById('wrongMsg');
  const hintToggle = document.getElementById('hintToggle');
  const hintText = document.getElementById('hintText');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const answer = input.value.trim().toLowerCase();

    if (answer === String(getDaysSinceMet())) {
      document.getElementById('passwordGameArea').classList.add('d-none');
      document.getElementById('correctMsg').classList.remove('d-none');
      launchConfetti();

      setTimeout(() => {
        document.getElementById('passwordScreen').classList.add('d-none');
        document.getElementById('mainContent').classList.remove('d-none');
        launchConfetti();
      }, 1800);
    } else {
      wrongMsg.classList.remove('d-none');
      input.value = '';
      input.focus();
    }
  });

  hintToggle.addEventListener('click', () => {
    hintText.classList.toggle('d-none');
    hintToggle.textContent = hintText.classList.contains('d-none') ? 'Need a hint?' : 'Hide hint';
  });
}

// ============ Cake / blow candle ============
function setupCake() {
  const cake = document.getElementById('cake');
  const tapHint = document.getElementById('tapHint');
  const wishMsg = document.getElementById('wishMsg');

  cake.addEventListener('click', () => {
    if (cake.classList.contains('blown')) return;
    cake.classList.add('blown');
    tapHint.classList.add('d-none');
    wishMsg.classList.remove('d-none');
    launchConfetti();
  });
}

// ============ Confetti ============
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff5c8a', '#ffd1dc', '#8b5cf6', '#ffe066', '#ff9f1c'];
  const pieces = [];
  const count = 150;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: -1.5 + Math.random() * 3,
      rotation: Math.random() * 360,
      rotationSpeed: -6 + Math.random() * 12
    });
  }

  let frame = 0;
  const maxFrames = 240;

  function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ============ Init ============
const COUNTDOWN_ENABLED = false; // set to true to re-enable the lock screen

document.addEventListener('DOMContentLoaded', () => {
  spawnHearts();
  startSinceMetTimer();
  setupPasswordGame();
  if (COUNTDOWN_ENABLED) {
    startCountdown();
  } else {
    document.getElementById('countdownScreen').classList.add('d-none');
    showPasswordScreen();
  }
  setupCake();
});
