// Jeux d'exemple intégrés à la plateforme : la galerie n'est jamais vide,
// même sans galerie communautaire configurée. Chaque jeu est un fichier
// HTML autonome, exactement ce que produit le générateur IA.

const SNAKE_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Neon Snake</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a1a; color: #fff; font-family: system-ui, sans-serif;
         display: flex; flex-direction: column; align-items: center; justify-content: center;
         min-height: 100vh; user-select: none; }
  h1 { color: #22d3ee; text-shadow: 0 0 12px #22d3ee; margin-bottom: 4px; font-size: 1.4rem; }
  #score { color: #7c5cff; margin-bottom: 8px; font-weight: bold; }
  canvas { border: 2px solid #22d3ee; border-radius: 8px; box-shadow: 0 0 20px #22d3ee44;
           max-width: 92vw; max-height: 70vh; touch-action: none; }
  #hint { color: #667; margin-top: 8px; font-size: 0.85rem; text-align: center; }
</style>
</head>
<body>
<h1>NEON SNAKE</h1>
<div id="score">Score : 0</div>
<canvas id="c" width="400" height="400"></canvas>
<div id="hint">Flèches / WASD ou glisser le doigt — Espace pour recommencer</div>
<script>
const c = document.getElementById('c'), x = c.getContext('2d'), N = 20, S = 400 / N;
let snake, dir, nextDir, food, score, dead, timer;
function reset() {
  snake = [{ x: 10, y: 10 }]; dir = { x: 1, y: 0 }; nextDir = dir;
  score = 0; dead = false; placeFood(); update();
  clearInterval(timer); timer = setInterval(tick, 110);
}
function placeFood() {
  do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
  while (snake.some(s => s.x === food.x && s.y === food.y));
}
function tick() {
  if (dead) return;
  dir = nextDir;
  const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
  if (snake.some(s => s.x === h.x && s.y === h.y)) { dead = true; draw(); return; }
  snake.unshift(h);
  if (h.x === food.x && h.y === food.y) { score += 10; placeFood(); }
  else snake.pop();
  draw();
}
function update() { document.getElementById('score').textContent = 'Score : ' + score; }
function draw() {
  update();
  x.fillStyle = '#0a0a1a'; x.fillRect(0, 0, 400, 400);
  x.fillStyle = '#ff5c7a'; x.shadowColor = '#ff5c7a'; x.shadowBlur = 12;
  x.fillRect(food.x * S + 3, food.y * S + 3, S - 6, S - 6);
  snake.forEach((s, i) => {
    x.fillStyle = i === 0 ? '#22d3ee' : '#7c5cff';
    x.shadowColor = x.fillStyle; x.shadowBlur = 8;
    x.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
  });
  x.shadowBlur = 0;
  if (dead) {
    x.fillStyle = 'rgba(10,10,26,0.8)'; x.fillRect(0, 0, 400, 400);
    x.fillStyle = '#ff5c7a'; x.font = 'bold 30px system-ui'; x.textAlign = 'center';
    x.fillText('GAME OVER', 200, 185);
    x.fillStyle = '#fff'; x.font = '16px system-ui';
    x.fillText('Espace ou toucher pour rejouer', 200, 220);
  }
}
function setDir(dx, dy) {
  if (dx === -dir.x && dy === -dir.y) return;
  nextDir = { x: dx, y: dy };
}
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'arrowup' || k === 'w') setDir(0, -1);
  else if (k === 'arrowdown' || k === 's') setDir(0, 1);
  else if (k === 'arrowleft' || k === 'a') setDir(-1, 0);
  else if (k === 'arrowright' || k === 'd') setDir(1, 0);
  else if (k === ' ') { if (dead) reset(); e.preventDefault(); }
});
let touchStart = null;
c.addEventListener('touchstart', e => { touchStart = e.touches[0]; if (dead) reset(); }, { passive: true });
c.addEventListener('touchend', e => {
  if (!touchStart) return;
  const t = e.changedTouches[0], dx = t.clientX - touchStart.clientX, dy = t.clientY - touchStart.clientY;
  if (Math.abs(dx) > Math.abs(dy)) setDir(Math.sign(dx), 0); else setDir(0, Math.sign(dy));
  touchStart = null;
}, { passive: true });
reset();
</script>
</body>
</html>`

const CASSE_BRIQUES_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Casse-Briques Cosmique</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: radial-gradient(circle at 50% 20%, #1a1035, #05030f); color: #fff;
         font-family: system-ui, sans-serif; display: flex; flex-direction: column;
         align-items: center; justify-content: center; min-height: 100vh; user-select: none; }
  h1 { color: #ffb347; text-shadow: 0 0 14px #ffb347; font-size: 1.3rem; margin-bottom: 6px; }
  canvas { border: 2px solid #ffb347; border-radius: 8px; max-width: 94vw; max-height: 72vh; touch-action: none; }
  #hint { color: #667; margin-top: 8px; font-size: 0.85rem; text-align: center; }
</style>
</head>
<body>
<h1>CASSE-BRIQUES COSMIQUE</h1>
<canvas id="c" width="480" height="420"></canvas>
<div id="hint">Souris / flèches / toucher pour déplacer la raquette — Espace pour (re)lancer</div>
<script>
const c = document.getElementById('c'), x = c.getContext('2d');
const W = 480, H = 420, ROWS = 5, COLS = 8, BW = 52, BH = 16;
const COLORS = ['#ff5c7a', '#ffb347', '#ffe156', '#22d3ee', '#7c5cff'];
let paddle, ball, bricks, score, lives, running, won;
function reset() {
  paddle = { x: W / 2 - 40, w: 80 };
  ball = { x: W / 2, y: H - 60, vx: 0, vy: 0, r: 6 };
  bricks = [];
  for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++)
    bricks.push({ x: col * (BW + 6) + 10, y: r * (BH + 6) + 40, alive: true, color: COLORS[r] });
  score = 0; lives = 3; running = false; won = false;
}
function launch() {
  if (!running && lives > 0 && !won) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    ball.vx = Math.cos(a) * 5; ball.vy = Math.sin(a) * 5; running = true;
  }
  if (lives <= 0 || won) { reset(); }
}
function step() {
  if (running) {
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
    if (ball.y < ball.r) ball.vy *= -1;
    if (ball.y > H + 20) {
      lives--; running = false; ball = { x: paddle.x + paddle.w / 2, y: H - 60, vx: 0, vy: 0, r: 6 };
    }
    if (ball.vy > 0 && ball.y > H - 34 && ball.y < H - 18 && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
      const rel = (ball.x - paddle.x) / paddle.w - 0.5;
      const sp = Math.hypot(ball.vx, ball.vy);
      const a = -Math.PI / 2 + rel * 1.9;
      ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp;
    }
    for (const b of bricks) {
      if (!b.alive) continue;
      if (ball.x > b.x - ball.r && ball.x < b.x + BW + ball.r && ball.y > b.y - ball.r && b.y + BH + ball.r > ball.y) {
        b.alive = false; score += 5; ball.vy *= -1;
        if (bricks.every(k => !k.alive)) { won = true; running = false; }
        break;
      }
    }
    if (!running && ball.vx === 0) ball.x = paddle.x + paddle.w / 2;
  } else { ball.x = paddle.x + paddle.w / 2; }
  draw();
  requestAnimationFrame(step);
}
function draw() {
  x.clearRect(0, 0, W, H);
  x.fillStyle = '#ffe156'; x.font = 'bold 14px system-ui'; x.textAlign = 'left';
  x.fillText('Score ' + score, 10, 22);
  x.textAlign = 'right'; x.fillText('Vies ' + '❤'.repeat(Math.max(0, lives)), W - 10, 22);
  for (const b of bricks) if (b.alive) {
    x.fillStyle = b.color; x.shadowColor = b.color; x.shadowBlur = 10;
    x.fillRect(b.x, b.y, BW, BH);
  }
  x.shadowBlur = 0;
  x.fillStyle = '#22d3ee'; x.shadowColor = '#22d3ee'; x.shadowBlur = 14;
  x.fillRect(paddle.x, H - 26, paddle.w, 10);
  x.beginPath(); x.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  x.fillStyle = '#fff'; x.shadowColor = '#fff'; x.fill(); x.shadowBlur = 0;
  if (lives <= 0 || won) {
    x.fillStyle = 'rgba(5,3,15,0.85)'; x.fillRect(0, 0, W, H);
    x.textAlign = 'center';
    x.fillStyle = won ? '#ffe156' : '#ff5c7a'; x.font = 'bold 32px system-ui';
    x.fillText(won ? 'VICTOIRE ! ✨' : 'GAME OVER', W / 2, H / 2 - 10);
    x.fillStyle = '#fff'; x.font = '16px system-ui';
    x.fillText('Score final : ' + score + ' — Espace pour rejouer', W / 2, H / 2 + 24);
  }
}
function movePaddle(px) {
  const rect = c.getBoundingClientRect();
  paddle.x = Math.max(0, Math.min(W - paddle.w, (px - rect.left) / rect.width * W - paddle.w / 2));
}
addEventListener('mousemove', e => movePaddle(e.clientX));
c.addEventListener('touchstart', e => { movePaddle(e.touches[0].clientX); launch(); }, { passive: true });
c.addEventListener('touchmove', e => movePaddle(e.touches[0].clientX), { passive: true });
addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - 28);
  if (e.key === 'ArrowRight') paddle.x = Math.min(W - paddle.w, paddle.x + 28);
  if (e.key === ' ') { launch(); e.preventDefault(); }
});
addEventListener('click', launch);
reset(); step();
</script>
</body>
</html>`

export const SAMPLE_GAMES = [
  {
    id: 'sample-neon-snake',
    title: 'Neon Snake',
    prompt: 'Un snake néon avec effets lumineux, contrôles clavier et tactiles',
    emoji: '🐍',
    author: 'Vibe Arcade',
    createdAt: 0,
    html: SNAKE_HTML,
  },
  {
    id: 'sample-casse-briques',
    title: 'Casse-Briques Cosmique',
    prompt: 'Un casse-briques spatial coloré avec raquette à la souris',
    emoji: '🧱',
    author: 'Vibe Arcade',
    createdAt: 0,
    html: CASSE_BRIQUES_HTML,
  },
]
