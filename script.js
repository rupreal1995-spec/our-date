document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ================= //
  // DOM REFERENCES    //
  // ================= //
  const loader = document.getElementById("loader");
  const pages = [...document.querySelectorAll(".page")];
  const continueBtn = document.getElementById("continueBtn");
  const yesBtn = document.getElementById("yesBtn");
  const calendarBtn = document.getElementById("calendarBtn");
  const datePicker = document.getElementById("datePicker");
  const typewriter = document.getElementById("typewriter");
  const countdown = document.getElementById("countdown");
  const heartsContainer = document.getElementById("hearts");
  const sparklesContainer = document.getElementById("sparkles");
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");
  const confettiCanvas = document.getElementById("confettiCanvas");
  
  // Ensure the canvas exists before calling getContext
  const ctx = confettiCanvas ? confettiCanvas.getContext("2d") : null;

  // ================= //
  // GLOBAL STATE      //
  // ================= //
  let selectedDate = null;
  let countdownTimer = null;
  let musicEnabled = false;
  let currentPage = 1;
  let confettiParticles = [];

  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function showPage(id) {
    pages.forEach(page => page.classList.remove("active"));
    const targetPage = document.getElementById(id);
    if (targetPage) targetPage.classList.add("active");
  }

  function hideLoader() {
    if (!loader) return;
    loader.style.transition = "opacity .8s ease";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 1800);
  });

  const QUESTION = "Will you go on a date with me when you'll be in India?";

  function typeWriter(text, index = 0) {
    if (!typewriter) return;
    if (index === 0) typewriter.textContent = "";
    if (index < text.length) {
      typewriter.textContent += text[index];
      setTimeout(() => typeWriter(text, index + 1), 45);
    }
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      currentPage = 2;
      showPage("page2");
      typeWriter(QUESTION);
    });
  }

  // ================= //
  // MUSIC CONTROLLER  //
  // ================= //
  function toggleMusic() {
    if (music.paused) {
        music.volume = 0;
        music.play();
        musicEnabled = true;
        musicBtn.textContent = "♫"; // Change icon to show it's playing

        let fade = setInterval(() => {
            if (music.volume < 0.95) {
                music.volume += 0.05;
            } else {
                clearInterval(fade);
            }
        }, 100);
    } else {
        // Fade out before pausing
        let fade = setInterval(() => {
            if (music.volume > 0.1) {
                music.volume -= 0.1;
            } else {
                clearInterval(fade);
                music.pause();
                musicEnabled = false;
                musicBtn.textContent = "♫"; // Keep the icon, or change to "▶" if you prefer
            }
        }, 100);
    }
}

  // ================= //
  // HEART PARTICLES   //
  // ================= //
  function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement("div");
    heart.innerHTML = "❤";
    heart.className = "floating-heart";
    // Fixed Math.random syntax
    heart.style.left = (Math.random() * 100) + "vw";
    heart.style.fontSize = (12 + Math.random() * 20) + "px";
    heart.style.animationDuration = (6 + Math.random() * 6) + "s";
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 12000);
  }
  setInterval(createHeart, 500);

  // ================= //
  // SPARKLES          //
  // ================= //
  function createSparkle() {
    if (!sparklesContainer) return;
    const s = document.createElement("div");
    s.innerHTML = "✨"; // Added a sparkle emoji for better visual effect
    s.className = "sparkle";
    s.style.left = (Math.random() * 100) + "vw";
    s.style.top = (Math.random() * 100) + "vh";
    sparklesContainer.appendChild(s);

    setTimeout(() => {
      s.remove();
    }, 1800);
  }
  setInterval(createSparkle, 350);

  // ================= //
  // PAGE 2 -> PAGE 3  //
  // ================= //
  if (yesBtn) {
    yesBtn.addEventListener("click", () => {
      currentPage = 3;
      showPage("page3");
    });
  }

  // ================= //
  // GOOGLE CALENDAR   //
  // ================= //
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      if (!datePicker || !datePicker.value) {
        alert("Please choose a date first ❤️");
        return;
      }

      selectedDate = new Date(datePicker.value);
      
      // Fixed Regex and ISO string extraction for calendar URLs
      const start = selectedDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDate = new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000); // Set end time 2 hours later
      const end = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      
      const url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent("Date with Love ❤️")
        + "&dates=" + start + "/" + end
        + "&details=" + encodeURIComponent("Can't wait to see you ❤️");
        
      window.open(url, "_blank");
      
      currentPage = 4;
      showPage("page4");
      startCountdown();
      launchConfetti();
    });
  }

  // ================= //
  // COUNTDOWN         //
  // ================= //
  function startCountdown() {
    if (!countdown) return;
    if (countdownTimer) clearInterval(countdownTimer);
    
    countdownTimer = setInterval(() => {
      const now = new Date();
      const diff = selectedDate - now;
      
      if (diff <= 0) {
        countdown.innerHTML = "Today is Our Day ❤️";
        clearInterval(countdownTimer);
        return;
      }
      
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      countdown.innerHTML = days + " Days " + hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
    }, 1000);
  }

  // ================= //
  // CONFETTI TRIGGER  //
  // ================= //
  function launchConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 220; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        gravity: 0.15,
        size: 3 + Math.random() * 4,
        // Fixed template literal syntax for colors
        color: `hsl(${Math.random() * 360}, 100%, 60%)` 
      });
    }
    animateConfetti();
  }

  // ==================== //
  // CONFETTI ANIMATION   //
  // ==================== //
  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiParticles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      
      if (p.y > window.innerHeight + 20) {
        confettiParticles.splice(index, 1);
      }
    });
    
    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }

  // ================= //
  // HEARTBEAT ANIM.   //
  // ================= //
  setInterval(() => {
    document.querySelectorAll(".gold-btn").forEach(btn => {
      btn.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
        { duration: 700, easing: "ease-in-out" }
      );
    });
  }, 3000);

  // ================= //
  // AUTO MUSIC        //
  // ================= //
  window.addEventListener("click", () => {
    if (!musicEnabled && music) {
      music.play().catch(() => {});
      musicEnabled = true;
    }
  }, { once: true });

});
