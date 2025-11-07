// Ambil canvas dan context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Ambil tombol & suara
const restartBtn = document.getElementById("restartBtn");
const bgMusic = document.getElementById("bgMusic");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Ukuran kotak dan variabel dasar
const box = 20;
let snake = [];
let direction = "RIGHT";
let food;
let score = 0;
let gameLoop;

// Tunggu interaksi pertama (klik tombol)
window.onload = () => {
  restartBtn.addEventListener("click", () => {
    // 🔊 Aktifkan izin audio (wajib karena browser blokir autoplay)
    bgMusic.play().then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }).catch(() => {});
    
    eatSound.play().catch(() => {});
    eatSound.pause();
    eatSound.currentTime = 0;

    gameOverSound.play().catch(() => {});
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    // Setelah izin diberikan → mulai game
    startGame();
  });
};

// Fungsi mulai game
function startGame() {
  bgMusic.currentTime = 0;
  bgMusic.volume = 0.5;
  bgMusic.play(); // 🎵 mulai musik latar

  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").textContent = "Skor: 0";
  food = randomFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, 150);
}

// Fungsi arah
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Gambar game
function draw() {
  // Latar belakang
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gambar ular
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Gambar makanan
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Posisi kepala baru
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Jika ular makan makanan
  if (headX === food.x && headY === food.y) {
    eatSound.currentTime = 0;
    eatSound.volume = 0.8;
    eatSound.play();
    score++;
    document.getElementById("score").textContent = "Skor: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  // Cek tabrakan (game over)
  if (
    headX < 0 ||
    headX >= canvas.width ||
    headY < 0 ||
    headY >= canvas.height ||
    tabrakan(newHead, snake)
  ) {
    clearInterval(gameLoop);
    bgMusic.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.volume = 0.9;
    gameOverSound.play();
    setTimeout(() => alert("💀 Game Over! Skor kamu: " + score), 300);
    return;
  }

  snake.unshift(newHead);
}
// Cek tabrakan
function tabrakan(head, arr) {
  return arr.some((segment) => head.x === segment.x && head.y === segment.y);
}

// Posisi makanan acak
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}
