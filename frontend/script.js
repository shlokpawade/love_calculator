const calculateBtn = document.getElementById('calculateBtn');
const result = document.getElementById('result');
const heartsContainer = document.getElementById('hearts-container');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

const container = document.querySelector('.container');
const containerRect = container.getBoundingClientRect();

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

/* --- Love Calculation --- */
function calculateLove(male, female) {
    male = male.toLowerCase();
    female = female.toLowerCase();

    // Special cases
    if (
        (male === 'shlok' && female === 'aastha') ||
        (male === 'anunay' && female === 'sonal') ||
        (male === 'mayank' && female === 'parthvi')
    ) {
        return 100;
    }

    // Regular calculation
    let common = 0;
    for (let char of male) {
        if (female.includes(char)) common++;
    }
    let total = male.length + female.length;
    let percentage = Math.min(100, Math.floor((common / total) * 200));
    return percentage;
}

/* --- Hearts Animation --- */
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * containerRect.width + 'px';
    heart.style.top = containerRect.height - 30 + 'px';
    heart.style.fontSize = 15 + Math.random() * 25 + 'px';
    heart.innerHTML = '❤️';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
}

function showHearts() {
    for (let i = 0; i < 30; i++) {
        setTimeout(createHeart, i * 100);
    }
}

/* --- Confetti Animation --- */
let particles = [];
function createParticles() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: containerRect.left + Math.random() * containerRect.width,
            y: containerRect.top + Math.random() * containerRect.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 20 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    updateParticles();
}

function updateParticles() {
    for (let p of particles) {
        p.y += Math.sqrt(p.d);
        if (p.y > containerRect.top + containerRect.height) {
            p.y = containerRect.top - 10;
            p.x = containerRect.left + Math.random() * containerRect.width;
        }
    }
    requestAnimationFrame(drawParticles);
}

/* --- Button Click --- */
calculateBtn.addEventListener('click', async () => {
    const maleName = document.getElementById('maleName').value.trim();
    const femaleName = document.getElementById('femaleName').value.trim();

    if (!maleName || !femaleName) {
        alert('Please enter both names!');
        return;
    }

    const lovePercent = calculateLove(maleName, femaleName);
    result.innerHTML = `💖 Love Percentage: ${lovePercent}% 💖`;

    // Animate result pop
    result.style.animation = 'pop 0.5s ease';
    setTimeout(() => result.style.animation = '', 500);

    // Add shimmer effect
    result.classList.add('shimmer');
    setTimeout(() => result.classList.remove('shimmer'), 1000);

    // Pulse container
    container.style.animation = 'pulse 0.5s ease';
    setTimeout(() => container.style.animation = '', 500);

    // Hearts & confetti
    showHearts();
    if (lovePercent >= 50) {
        createParticles();
        drawParticles();
    }

    // Send result to backend
    await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maleName, femaleName, lovePercent })
    });
});
