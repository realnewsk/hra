const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fragCountEl = document.getElementById('frag-count');
const lunchModal = document.getElementById('lunch-modal');
const lunchList = document.getElementById('lunch-list');
const lunchLoader = document.getElementById('lunch-loader');

let frags = 0;
let gameOver = false;
let enemies = [];
let particles = [];
let spawnTimer = 0;

// Central coordinates (vanishing point)
const vpX = canvas.width / 2;
const vpY = canvas.height / 2;

class Enemy {
    constructor() {
        this.z = 100; // Distance away from screen (100 to 0)
        // Angle variation to make them spread out from center
        this.angle = Math.random() * Math.PI * 2;
        this.radiusFactor = Math.random() * 150 + 50; 
        this.speed = Math.random() * 0.8 + 0.5;
        this.color = Math.random() > 0.5 ? '#ff3333' : '#d45d00';
        this.size = 5;
        this.x = vpX;
        this.y = vpY;
    }

    update() {
        this.z -= this.speed;
        
        // Perspective calculation
        let screenDistance = (100 - this.z) / 100;
        this.x = vpX + Math.cos(this.angle) * this.radiusFactor * screenDistance;
        this.y = vpY + Math.sin(this.angle) * (this.radiusFactor * 0.6) * screenDistance;
        this.size = screenDistance * 45 + 5;

        // If it gets too close to screen
        if (this.z <= 0) {
            this.z = 100; // Reset back to distance
        }
    }

    draw() {
        // Draw retro pixelated blob
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        
        // Inner pixel accents
        ctx.fillStyle = '#ccff00';
        ctx.fillRect(this.x - this.size/6, this.y - this.size/6, this.size/3, this.size/3);
    }
}

// Particle explosion when hitting an enemy
function spawnParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 5 + 2,
            life: 20,
            color: color
        });
    }
}

// Draw the Sci-fi corridor lines
function drawBackground() {
    ctx.fillStyle = '#122422';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#23443e';
    ctx.lineWidth = 2;

    // Outer grid panels
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.strokeRect(150, 80, canvas.width - 300, canvas.height - 160);

    // Vanishing corner lines
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(vpX - 50, vpY - 30);
    ctx.moveTo(canvas.width, 0); ctx.lineTo(vpX + 50, vpY - 30);
    ctx.moveTo(0, canvas.height); ctx.lineTo(vpX - 50, vpY + 30);
    ctx.moveTo(canvas.width, canvas.height); ctx.lineTo(vpX + 50, vpY + 30);
    ctx.stroke();
}

function drawPlayerGun() {
    // Draw simple pixelated weapon at the bottom center
    ctx.fillStyle = '#2b3a37';
    ctx.fillRect(vpX - 40, canvas.height - 90, 80, 90);
    ctx.fillStyle = '#1c2624';
    ctx.fillRect(vpX - 25, canvas.height - 110, 50, 30);
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(vpX - 5, canvas.height - 115, 10, 10);
}

// Handle Shooting
canvas.addEventListener('mousedown', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check hit collision (from front-most items first)
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        let dist = Math.hypot(mouseX - enemy.x, mouseY - enemy.y);
        
        if (dist < enemy.size * 1.2) {
            spawnParticles(enemy.x, enemy.y, enemy.color);
            enemies.splice(i, 1);
            frags++;
            fragCountEl.innerText = frags;
            
            if (frags >= 30) {
                endGameAndFetchLunch();
            }
            break;
        }
    }
});

function gameLoop() {
    if (gameOver) return;

    drawBackground();

    // Spawn mechanism
    spawnTimer++;
    if (spawnTimer > 35 && enemies.length < 8) {
        enemies.push(new Enemy());
        spawnTimer = 0;
    }

    // Update & Draw Enemies
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });

    // Update & Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
    }

    drawPlayerGun();
    requestAnimationFrame(gameLoop);
}

// Lunch Scraper & End Game logic
function endGameAndFetchLunch() {
    gameOver = true;
    lunchModal.classList.remove('hidden');
    
    const targetUrl = "https://eskoly.sk/hlavna113/jedalen";
    // We use a public CORS proxy to grab the web page client-side
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.json();
        })
        .then(data => {
            lunchLoader.classList.add('hidden');
            
            // Setup a parser to sift through the school's webpage data
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            // Try to find structural blocks containing lunch items
            // School systems typically use table grids or specific list divs
            const menuElements = doc.querySelectorAll('.jedlo, tr, td, p');
            let menuItems = [];

            menuElements.forEach(el => {
                let text = el.innerText.trim();
                // Filter strings to find lines that look like food entries
                if (text.length > 15 && !text.includes('skoly.sk') && menuItems.length < 6) {
                    if (!menuItems.includes(text)) menuItems.push(text);
                }
            });

            if (menuItems.length > 0) {
                lunchList.innerHTML = menuItems.map(item => `<p>🍴 ${item}</p>`).join('');
            } else {
                // Smart fallback if the school page structure dynamically shifts layout
                lunchList.innerHTML = `<p>Couldn't parse structural text data directly, but you can check it out live right here:</p>
                                       <a href="${targetUrl}" target="_blank" style="color: #00ffcc;">Otvoriť jedálny lístok na webe ↗</a>`;
            }
        })
        .catch(err => {
            lunchLoader.classList.add('hidden');
            lunchList.innerHTML = `<p style="color: #ff5555;">Chyba pri načítaní (Error loading menu).</p>
                                   <a href="${targetUrl}" target="_blank" style="color: #00ffcc; text-decoration: underline;">Klikni sem pre obedový lístok ↗</a>`;
        });
}

// Start Game
gameLoop();
