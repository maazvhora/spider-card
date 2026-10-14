// 1. Element Selectors
const card = document.getElementById('spideyCard');
const scene = document.getElementById('cardScene');
const flipBtn = document.getElementById('flipBtn');
const editBtn = document.getElementById('editBtn');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');

let flipped = false;

// 2. Flip Card Toggle
function flipCard() {
  flipped = !flipped;
  card.classList.toggle('is-flipped', flipped);
}

card.addEventListener('click', flipCard);
flipBtn.addEventListener('click', flipCard);

// 3. 3D Perspective Tilt on Mouse Move
scene.addEventListener('mousemove', (e) => {
  const rect = scene.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = (-y / 22).toFixed(2);
  const rotateY = (x / 22).toFixed(2);
  const baseRotateY = flipped ? 180 : 0;
  card.style.transform = `rotateY(${baseRotateY + parseFloat(rotateY)}deg) rotateX(${rotateX}deg)`;
});

scene.addEventListener('mouseleave', () => {
  card.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
});

// 4. Customize Name & Contact Info
editBtn.addEventListener('click', () => {
  const nameEl = document.getElementById('cardName');
  const contactEl = document.getElementById('cardContact');

  const newName = prompt('Enter your Full Name for the Business Card:', nameEl.innerText);
  if (newName && newName.trim() !== '') {
    nameEl.innerText = newName.trim();
  }

  const newContact = prompt('Enter your Email / GitHub / Phone line:', contactEl.innerText);
  if (newContact && newContact.trim() !== '') {
    contactEl.innerText = newContact.trim();
  }
});

// 5. Print / Save as PDF
printBtn.addEventListener('click', () => {
  window.print();
});

// 6. Download Current HTML Snapshot
downloadBtn.addEventListener('click', () => {
  const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'spiderman-business-card-resume.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// 7. Interactive Spider-Web Background Canvas
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
let width, height;
const particles = [];
const mouse = { x: -999, y: -999 };

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Spawn Web Nodes
for (let i = 0; i < 65; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1.1,
    vy: (Math.random() - 0.5) * 1.1,
    r: Math.random() * 2 + 1
  });
}

function animateWeb() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.fill();

    // Connect nearby nodes like a spider-web
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 120})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    // Shoot red web lines toward cursor
    const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (mDist < 170) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(230, 36, 41, ${1 - mDist / 170})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
  }

  requestAnimationFrame(animateWeb);
}

animateWeb();