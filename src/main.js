import "./style.css";

const app = document.querySelector("#app");

const state = {
  step: 0, // 0 intro, 1 valentine, 2 choices, 3 summary
  choices: {
    lunch: null,
    activity: null,
    evening: null,
    custom: ""
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
    <div class="card fade-in hearts-bg">
      <h1>Hi bubaa ❤️</h1>

      <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-top:14px;">
        <img
          src="/us.jpeg"
          alt="Us"
          style="
            width:150px;
            height:150px;
            object-fit:cover;
            border-radius:20px;
            border:1px solid rgba(20,10,30,0.15);
            box-shadow: 0 18px 40px rgba(0,0,0,0.15);
          "
        />

        <div style="flex:1; min-width:220px;">
          <p style="margin-top:0;">
            I wanted to give you something on your birthday, but I wanted it to be done right.
            Now I finally can. As we are meeting on Saturday, Happy Valentine’s Day too (yes, I’m mixing them 😄).
            I’m sorry this is a little delayed but I wanted to make something small and cute with my own hands. I hope you like it :)
          </p>
          <p>
            Valentine’s Day is already ours: you join me after my class, then we do lunch + a little adventure.
            Ready?
          </p>
        </div>
      </div>

      <div class="row" style="margin-top:14px;">
        <button class="primary" id="startBtn">Open your surprise ✨</button>
      </div>
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
  const lunchOpts = [
    "Italian 🍝",
    "Ramen 🍜",
    "Sushi 🍣",
    "Spanish / Mediterranean 🥘"
  ];
  const actOpts = [
    "Ceramics class 🏺",
    "Long walk together 🚶‍♀️🚶‍♂️",
    "Massage / spa 💆",
    "Coffee + dessert ☕🍰",
  ];
  const eveOpts = [
    "Cozy movie at home 🎬",
    "fun at home games 🎲",
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

      <div style="margin-top:18px;">
        <p><strong>Anything else you’d love? 💭</strong></p>
        <input
          id="customInput"
          class="text-input"
          type="text"
          placeholder="Write something here..."
        />
      </div>
      
      <div class="row" style="margin-top:18px;">
        <button class="ghost" id="backBtn">Back</button>
        <button class="primary" id="finishBtn">Finish 💌</button>
      </div>
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

  const input = node.querySelector("#customInput");
  input.value = state.choices.custom || "";

  input.addEventListener("input", (e) => {
    state.choices.custom = e.target.value;
  });


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
  const { lunch, activity, evening, custom } = state.choices;

  const missing = [];
  if (!lunch) missing.push("Lunch");
  if (!activity) missing.push("After lunch");
  if (!evening) missing.push("Evening");

  let summaryText =
    missing.length > 0
      ? `Almost done 😄 Pick: ${missing.join(", ")}`
      : `Our plan:
• Lunch: ${lunch}
• After lunch: ${activity}
• Evening: ${evening}`;

  // ✅ ADD CUSTOM TEXT IF EXISTS
  if (custom && custom.trim() !== "") {
    summaryText += `\n• Extra request: ${custom.trim()}`;
  }

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

      <p class="small">I love you mi amorcito❤️</p>
    </div>
  `);

  node.querySelector("#editBtn").addEventListener("click", () => {
    state.step = 2;
    render();
  });

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

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
