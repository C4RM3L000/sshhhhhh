const landing = document.getElementById("landing");
    const openSurprise = document.getElementById("openSurprise");
    const site = document.getElementById("site");
    const cakeZone = document.getElementById("cakeZone");
    const cakePieces = [...document.querySelectorAll(".cake-piece")];
    const flame = document.getElementById("flame");
    const counterPanel = document.getElementById("counterPanel");
    const birthdayLetter = document.getElementById("birthdayLetter");
    const confettiLayer = document.getElementById("confettiLayer");
    const effectLayer = document.getElementById("effectLayer");
    const backgroundMagic = document.getElementById("backgroundMagic");
    const bgMusic = document.getElementById("bgMusic");
    const musicControl = document.getElementById("musicControl");
    const birthday = new Date(2006, 6, 5, 0, 0, 0); // July is month index 6.
    let musicStarted = false;
    let counterTimer = null;
    /* ==============================
       BACKGROUND STARS + PARTICLES
    ============================== */
    function createBackgroundMagic() {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 90; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${1.8 + Math.random() * 2.5}s`;
        fragment.appendChild(star);
      }
      for (let i = 0; i < 34; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
        particle.style.animationDuration = `${9 + Math.random() * 12}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        fragment.appendChild(particle);
      }
      backgroundMagic.appendChild(fragment);
    }
    createBackgroundMagic();
    /* ==============================
       LANDING BUTTON FLOW
    ============================== */
    openSurprise.addEventListener("click", async () => {
      landing.classList.add("hidden");
      site.classList.add("visible");
      document.body.classList.remove("no-scroll");
      musicControl.classList.add("show");
      await startMusic();
      startCakeAnimation();
    });
    async function startMusic() {
      try {
        bgMusic.volume = 0.45;
        await bgMusic.play();
        musicStarted = true;
        musicControl.textContent = "🔊 Pause Music";
      } catch (error) {
        musicStarted = false;
        musicControl.textContent = "🔇 Play Music";
      }
    }
    musicControl.addEventListener("click", async () => {
      if (bgMusic.paused) {
        try {
          await bgMusic.play();
          musicStarted = true;
          musicControl.textContent = "🔊 Pause Music";
        } catch (error) {
          musicControl.textContent = "🔇 Play Music";
        }
      } else {
        bgMusic.pause();
        musicStarted = false;
        musicControl.textContent = "🔇 Play Music";
      }
    });
    /* ==============================
       CAKE BUILDING SEQUENCE
    ============================== */
    function startCakeAnimation() {
      cakePieces.forEach((piece) => {
        const delay = Number(piece.dataset.delay || 0);
        setTimeout(() => {
          piece.classList.add("drop");
        }, delay);
      });
      const candleDelay = 6100;
      const dropDuration = 1050;
      setTimeout(() => {
        flame.classList.add("lit");
        setTimeout(() => {
          startCelebration();
          revealBirthdayInfo();
        }, 500);
      }, candleDelay + dropDuration + 1000);
    }
    /* ==============================
       CELEBRATION EFFECTS
    ============================== */
    function startCelebration() {
      cakeZone.classList.add("celebrate");
      createPoppers();
      launchConfetti();
      createFloatingHearts(32);
      createSparklesAroundCake();
      setTimeout(() => {
        cakeZone.classList.remove("celebrate");
      }, 1400);
    }
    function createPoppers() {
      const left = document.createElement("div");
      const right = document.createElement("div");
      left.className = "popper left burst";
      right.className = "popper right burst";
      left.style.setProperty("--angle", "28deg");
      right.style.setProperty("--angle", "-28deg");
      effectLayer.append(left, right);
      setTimeout(() => {
        left.remove();
        right.remove();
      }, 1200);
    }
    /*
      Confetti uses requestAnimationFrame for smooth motion.
      Each particle has its own velocity, gravity, spin, and fade.
    */
    function launchConfetti() {
      const colors = ["#ff8fb3", "#ffd1dc", "#f8c85a", "#ffffff", "#a7e7ff", "#b68cff", "#ff6f91"];
      const pieces = [];
      const count = window.innerWidth < 600 ? 120 : 190;
      for (let i = 0; i < count; i++) {
        const confetti = document.createElement("span");
        confetti.className = "confetti";
        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? window.innerWidth * 0.08 : window.innerWidth * 0.92;
        const startY = window.innerHeight * 0.58;
        const angle = fromLeft
          ? -Math.PI / 2.8 + Math.random() * Math.PI / 2.2
          : -Math.PI / 1.4 - Math.random() * Math.PI / 2.2;
        const speed = 6 + Math.random() * 9;
        const piece = {
          el: confetti,
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          gravity: 0.13 + Math.random() * 0.06,
          rotation: Math.random() * 360,
          rotationSpeed: -10 + Math.random() * 20,
          life: 0,
          maxLife: 130 + Math.random() * 70
        };
        confetti.style.left = `${piece.x}px`;
        confetti.style.top = `${piece.y}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${piece.rotation}deg)`;
        confettiLayer.appendChild(confetti);
        pieces.push(piece);
      }
      function animate() {
        for (let i = pieces.length - 1; i >= 0; i--) {
          const p = pieces[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.992;
          p.rotation += p.rotationSpeed;
          const opacity = Math.max(0, 1 - p.life / p.maxLife);
          p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
          p.el.style.opacity = opacity;
          if (p.life > p.maxLife || p.y > window.innerHeight + 80) {
            p.el.remove();
            pieces.splice(i, 1);
          }
        }
        if (pieces.length > 0) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
    }
    function createFloatingHearts(amount) {
      for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = ["♡", "♥", "🫶", "🤍"][Math.floor(Math.random() * 4)];
        heart.style.left = `${8 + Math.random() * 84}%`;
        heart.style.bottom = `${-20 - Math.random() * 120}px`;
        heart.style.fontSize = `${18 + Math.random() * 28}px`;
        heart.style.color = ["#ff8fb3", "#ffffff", "#f8c85a", "#ffd1dc"][Math.floor(Math.random() * 4)];
        heart.style.filter = "drop-shadow(0 0 10px rgba(255, 255, 255, 0.85))";
        heart.style.animation = `heartFloat ${4 + Math.random() * 3}s ease-in forwards`;
        heart.style.animationDelay = `${Math.random() * 1.5}s`;
        effectLayer.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
      }
    }
    function createSparklesAroundCake() {
      const cakeRect = cakeZone.getBoundingClientRect();
      for (let i = 0; i < 42; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.textContent = "✦";
        const x = cakeRect.left + Math.random() * cakeRect.width;
        const y = cakeRect.top + Math.random() * cakeRect.height * 0.82;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.fontSize = `${12 + Math.random() * 20}px`;
        sparkle.style.color = ["#ffffff", "#ffe7a3", "#ffd1dc"][Math.floor(Math.random() * 3)];
        sparkle.style.textShadow = "0 0 14px rgba(255, 255, 255, 0.9)";
        sparkle.style.animation = `sparklePop ${1.2 + Math.random() * 1.4}s ease-in-out forwards`;
        sparkle.style.animationDelay = `${Math.random() * 0.8}s`;
        effectLayer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3200);
      }
    }
    /* ==============================
       BIRTHDAY COUNTER
    ============================== */
    function revealBirthdayInfo() {
      counterPanel.classList.add("show");
      birthdayLetter.classList.add("show");
      updateAgeCounter();
      if (!counterTimer) {
        counterTimer = setInterval(updateAgeCounter, 1000);
      }
    }
    function updateAgeCounter() {
      const now = new Date();
      const age = getPreciseAge(birthday, now);
      const nextBirthday = getNextBirthday(now);
      document.getElementById("years").textContent = age.years;
      document.getElementById("months").textContent = age.months;
      document.getElementById("days").textContent = age.days;
      document.getElementById("hours").textContent = String(age.hours).padStart(2, "0");
      document.getElementById("minutes").textContent = String(age.minutes).padStart(2, "0");
      document.getElementById("seconds").textContent = String(age.seconds).padStart(2, "0");
      const countdown = getCountdown(now, nextBirthday);
      document.getElementById("nextBirthday").textContent =
        `Next birthday in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds.`;
    }
    /*
      Calculates precise age by walking from the birthday forward.
      This avoids rough month/day approximations.
    */
    function getPreciseAge(start, end) {
      let years = end.getFullYear() - start.getFullYear();
      let anchor = new Date(
        start.getFullYear() + years,
        start.getMonth(),
        start.getDate(),
        start.getHours(),
        start.getMinutes(),
        start.getSeconds()
      );
      if (anchor > end) {
        years--;
        anchor = new Date(
          start.getFullYear() + years,
          start.getMonth(),
          start.getDate(),
          start.getHours(),
          start.getMinutes(),
          start.getSeconds()
        );
      }
      let months = 0;
      while (true) {
        const next = new Date(anchor);
        next.setMonth(next.getMonth() + 1);
        if (next <= end) {
          anchor = next;
          months++;
        } else {
          break;
        }
      }
      const diffMs = end - anchor;
      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor((diffMs % 86400000) / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      return { years, months, days, hours, minutes, seconds };
    }
    function getNextBirthday(now) {
      let next = new Date(now.getFullYear(), 6, 5, 0, 0, 0);
      if (next <= now) {
        next = new Date(now.getFullYear() + 1, 6, 5, 0, 0, 0);
      }
      return next;
    }
    function getCountdown(from, to) {
      const diff = Math.max(0, to - from);
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      };
    }
    /* ==============================
       ENDING PRETZEL FLOATERS
    ============================== */
    function createPretzels() {
      const ending = document.querySelector(".ending");
      setInterval(() => {
        const pretzel = document.createElement("span");
        pretzel.className = "pretzel";
        pretzel.textContent = "🥨";
        pretzel.style.left = `${Math.random() * 100}%`;
        pretzel.style.bottom = "-40px";
        pretzel.style.fontSize = `${22 + Math.random() * 30}px`;
        pretzel.style.animation = `pretzelFloat ${6 + Math.random() * 5}s linear forwards`;
        pretzel.style.opacity = "0";
        ending.appendChild(pretzel);
        setTimeout(() => pretzel.remove(), 11000);
      }, 700);
    }
    createPretzels();
    /* ==============================
       OPTIONAL: SMALL AMBIENT HEARTS
       These appear occasionally after the page is opened.
    ============================== */
    setInterval(() => {
      if (!site.classList.contains("visible")) return;
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = "♡";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = "-30px";
      heart.style.fontSize = `${14 + Math.random() * 18}px`;
      heart.style.color = "rgba(255, 255, 255, 0.85)";
      heart.style.animation = `heartFloat ${6 + Math.random() * 4}s ease-in forwards`;
      effectLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 10000);
    }, 1300);