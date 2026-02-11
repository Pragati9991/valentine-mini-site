import "./style.css";

const app = document.querySelector("#app");

const state = {
  step: 0, // 0 intro, 1 valentine, 2 choices, 3 summary
  choices: {
    lunch: null,
    activity: null,
    evening: null,
  },
};

// --- helpers ---
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function render() {
  app.innerHTML = "";
  const view = [Intro, Valentine, Choices, Summary][state.step]();
  app.appendChild(view);
}

// --- screens ---
function Intro() {
  const node = el(`
    <div class="card fade-in">
      <h1>Hi love ❤️</h1>
      <p>
        Happy Valentine’s Day… and happy birthday too (yes, I’m mixing them 😄).
        I’m sorry this is a little delayed — but I wanted to make something small and
        cute with my own hands (and a bit of code).
      </p>
      <p>
        Today is already ours: you join me after my class, then we do lunch + a little adventure.
        Ready?
      </p>
      <div class="row">
        <button class="primary" id="startBtn">Open your surprise ✨</button>
      </div>
      <p class="small">Tip: works best on phone too. (Try to catch the “No” button later 😈)</p>
    </div>
  `);

  node.querySelector("#startBtn").addEventListener("click", () => {
    state.step = 1;
    render();
  });

  return node;
}

function Valentine() {
  const node = el(`
    <div class="card fade-in">
      <h1>Important question 💘</h1>
      <p>Will you be my Valentine?</p>

      <div class="stage" id="stage">
        <button class="primary" id="yesBtn">Yes ❤️</button>
        <button id="noBtn">No 🙃</button>
      </div>

      <p class="small">Hint: “No” is feeling shy today.</p>
    </div>
  `);

  const stage = node.querySelector("#stage");
  const noBtn = node.querySelector("#noBtn");

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function moveNoButton() {
    const rect = stage.getBoundingClientRect();
    const bw = noBtn.offsetWidth;
    const bh = noBtn.offsetHeight;

    const x = Math.random() * (rect.width - bw);
    const y = Math.random() * (rect.height - bh);

    noBtn.style.left = `${clamp(x, 10, rect.width - bw - 10)}px`;
    noBtn.style.top = `${clamp(y, 10, rect.height - bh - 10)}px`;
  }

  // Desktop: run away when cursor gets close
  if (!isTouchDevice) {
    // also run on hover just in case
    noBtn.addEventListener("mouseenter", moveNoButton);

    stage.addEventListener("mousemove", (e) => {
      const nb = noBtn.getBoundingClientRect();
      const dx = e.clientX - (nb.left + nb.width / 2);
      const dy = e.clientY - (nb.top + nb.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < 100) moveNoButton();
    });
  }

  // Mobile: tap makes it jump + cute text changes
  const teasePhrases = ["Hmm? 😏", "Try again 😌", "Nope 😜", "You sure? 💕"];
  function teaseAndMove(e) {
    e.preventDefault();
    moveNoButton();
    noBtn.textContent = teasePhrases[Math.floor(Math.random() * teasePhrases.length)];
  }

  // touchstart helps on mobile before "click" fires
  noBtn.addEventListener("touchstart", teaseAndMove, { passive: false });
  noBtn.addEventListener("click", teaseAndMove);

  node.querySelector("#yesBtn").addEventListener("click", () => {
    state.step = 2;
    render();
  });

  // start with a move so it's not exactly where CSS placed it
  setTimeout(moveNoButton, 200);

  return node;
}

function Choices() {
  const lunchOpts = ["Italian 🍝", "Japanese 🍜", "Sushi 🍣", "Surprise me 😌"];
  const actOpts = [
    "Ceramics class 🏺",
    "Long walk together 🚶‍♀️🚶‍♂️",
    "Massage / spa 💆",
    "Coffee + dessert ☕🍰",
  ];
  const eveOpts = [
    "Cozy movie at home 🎬",
    "Cocktails out 🍸",
    "Board game night 🎲",
    "Early cuddle + sleep 😴",
  ];

  const node = el(`
    <div class="card fade-in">
      <h1>Design our day ✨</h1>
      <p>Pick what you feel like — I’ll make it happen.</p>

      <hr />

      <div>
        <p><strong>Lunch:</strong></p>
        <div class="pills" id="lunch"></div>
      </div>

      <div style="margin-top:14px;">
        <p><strong>After lunch:</strong></p>
        <div class="pills" id="activity"></div>
      </div>

      <div style="margin-top:14px;">
        <p><strong>Evening:</strong></p>
        <div class="pills" id="evening"></div>
      </div>

      <div class="row" style="margin-top:18px;">
        <button class="ghost" id="backBtn">Back</button>
        <button class="primary" id="finishBtn">Finish 💌</button>
      </div>

      <p class="small">You can change choices anytime before finishing.</p>
    </div>
  `);

  function mountPills(containerId, key, options) {
    const wrap = node.querySelector(containerId);
    wrap.innerHTML = "";
    options.forEach((opt) => {
      const pill = el(`<div class="pill">${opt}</div>`);
      if (state.choices[key] === opt) pill.classList.add("active");
      pill.addEventListener("click", () => {
        state.choices[key] = opt;
        render();
      });
      wrap.appendChild(pill);
    });
  }

  mountPills("#lunch", "lunch", lunchOpts);
  mountPills("#activity", "activity", actOpts);
  mountPills("#evening", "evening", eveOpts);

  node.querySelector("#backBtn").addEventListener("click", () => {
    state.step = 1;
    render();
  });

  node.querySelector("#finishBtn").addEventListener("click", () => {
    state.step = 3;
    render();
  });

  return node;
}

function Summary() {
  const { lunch, activity, evening } = state.choices;

  const missing = [];
  if (!lunch) missing.push("Lunch");
  if (!activity) missing.push("After lunch");
  if (!evening) missing.push("Evening");

  const summaryText =
    missing.length > 0
      ? `Almost done 😄 Pick: ${missing.join(", ")}`
      : `Our plan:
• Lunch: ${lunch}
• After lunch: ${activity}
• Evening: ${evening}`;

  const waText = `Valentine plan ❤️\n${summaryText}\n\nI choose YES 😌`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const node = el(`
    <div class="card fade-in">
      <h1>It’s a date 💞</h1>
      <p>${missing.length ? "We’re super close!" : "Perfect. I’m excited."}</p>

      <pre style="white-space:pre-wrap; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.12);">${summaryText}</pre>

      <div class="row">
        <button class="ghost" id="editBtn">Edit</button>
        <button class="primary" id="copyBtn">Copy plan</button>
        <button class="primary" id="waBtn">Send on WhatsApp</button>
      </div>

      <p class="small">PS: I love you. Thank you for always being my person. ❤️</p>
    </div>
  `);

  node.querySelector("#editBtn").addEventListener("click", () => {
    state.step = 2;
    render();
  });

  async function copyText(text) {
    // 1) Modern clipboard (works on https or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // 2) Fallback for older/blocked cases
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }

  node.querySelector("#copyBtn").addEventListener("click", async () => {
    const btn = node.querySelector("#copyBtn");
    try {
      const ok = await copyText(summaryText);
      if (!ok) throw new Error("copy failed");
      btn.textContent = "Copied ✅";
      setTimeout(() => (btn.textContent = "Copy plan"), 1200);
    } catch {
      alert("Copy didn’t work here — try WhatsApp button or screenshot ❤️");
    }
  });

  node.querySelector("#waBtn").addEventListener("click", () => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });

  return node;
}

render();
