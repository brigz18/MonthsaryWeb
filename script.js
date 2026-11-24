/* ===================== HOW TO EDIT =====================
   PHOTOS   : put photos in the images folder named photo1.jpg, photo2.jpg ... up to photo40.jpg.
              Missing numbers are skipped automatically, so there are never empty slots.
   CAPTIONS : optional. CAPTIONS[0] is for photo1.jpg, CAPTIONS[1] for photo2.jpg, and so on.
              Example: const CAPTIONS = ["Our first photo", "", "Beach day"];  (empty = no caption)
   REASONS  : add or change lines in the REASONS list.
   ====================================================== */
const CAPTIONS = [];
const REASONS = [
  "Your smile makes my day better.",
  "I love the way you make ordinary moments special.",
  "I appreciate your efforts.",
  "I love spending time with you.",
  "I love being able to call you mine."
];
const MAX_PHOTO = 40;

const $ = s => document.querySelector(s);

/* ---------- floating hearts ---------- */
function heart(x) {
  const s = document.createElement("span");
  s.textContent = ["❤", "💕", "💗", "🌸"][Math.random() * 4 | 0];
  s.style.cssText = `left:${x ?? Math.random() * 100}vw;font-size:${14 + Math.random() * 18}px;animation-duration:${6 + Math.random() * 6}s`;
  $("#hearts").append(s);
  setTimeout(() => s.remove(), 12500);
}
setInterval(() => { if (!document.hidden) heart(); }, 1300);
const burst = n => { for (let i = 0; i < n; i++) setTimeout(() => heart(), i * 90); };

/* ---------- gallery: find the photos that exist, then balance them in columns ---------- */
const PHOTOS = [];
let cols = 0, rt;
const probe = n => new Promise(r => {
  const i = new Image();
  i.onload = () => r({ n, src: `images/photo${n}.jpg`, w: i.naturalWidth, h: i.naturalHeight });
  i.onerror = () => r(null);
  i.src = `images/photo${n}.jpg`;
});
Promise.all(Array.from({ length: MAX_PHOTO }, (_, k) => probe(k + 1))).then(rs => {
  PHOTOS.push(...rs.filter(Boolean));
  buildGallery();
});

function card(p, i) {
  const cap = CAPTIONS[p.n - 1] || "";
  const f = document.createElement("figure");
  f.className = "polaroid" + (cap ? "" : " nocap");
  f.tabIndex = 0;
  f.style.setProperty("--r", ((p.n % 5) - 2) * 1.1 + "deg");
  const im = new Image();
  im.src = p.src; im.width = p.w; im.height = p.h; im.loading = "lazy";
  im.alt = cap || `Our photo ${i + 1}`;
  f.append(im);
  if (cap) { const c = document.createElement("figcaption"); c.textContent = cap; f.append(c); }
  f.onclick = () => openLb(i);
  f.onkeydown = e => { if (e.key === "Enter") openLb(i); };
  return f;
}
function buildGallery() {
  const n = innerWidth < 600 ? 2 : innerWidth < 1000 ? 3 : 4;   // columns for phone / tablet / desktop
  if (n === cols || !PHOTOS.length) return;
  cols = n;
  const board = document.createElement("div");
  board.className = "board";
  const cs = Array.from({ length: n }, () => { const d = document.createElement("div"); d.className = "col"; board.append(d); return { d, h: 0 }; });
  PHOTOS.forEach((p, i) => {                       // each photo goes in the shortest column, so all columns end evenly
    const c = cs.reduce((a, b) => b.h < a.h ? b : a);
    c.d.append(card(p, i));
    c.h += p.h / p.w + .2;
  });
  $("#groups").replaceChildren(board);
}
addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildGallery, 200); });

/* ---------- lightbox ---------- */
const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCnt = $("#lbCnt");
let cur = 0, sx = 0;
function show(i) {
  const T = PHOTOS.length;
  cur = (i + T) % T;
  lbImg.style.opacity = 0;
  setTimeout(() => {
    const p = PHOTOS[cur], cap = CAPTIONS[p.n - 1] || "";
    lbImg.src = p.src;
    lbImg.alt = cap || `Our photo ${cur + 1}`;
    lbCap.textContent = cap;
    lbCnt.textContent = `${cur + 1}/${T}`;
  }, 200);
}
lbImg.onload = lbImg.onerror = () => { lbImg.style.opacity = 1; };
function openLb(i) { lb.classList.add("on"); document.body.style.overflow = "hidden"; show(i); }
function closeLb() { lb.classList.remove("on"); document.body.style.overflow = ""; }
$("#lbX").onclick = closeLb;
$("#lbP").onclick = () => show(cur - 1);
$("#lbN").onclick = () => show(cur + 1);
lb.onclick = e => { if (e.target === lb) closeLb(); };
lb.ontouchstart = e => { sx = e.touches[0].clientX; };
lb.ontouchend = e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); };
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("on")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowRight") show(cur + 1);
  if (e.key === "ArrowLeft") show(cur - 1);
});

/* ---------- envelope, letter, replay ---------- */
const env = $("#env"), openBtn = $("#openBtn"), msg = $("#welcomeMsg"), rest = $("#rest");
openBtn.onclick = () => { env.classList.add("open"); openBtn.hidden = true; msg.hidden = false; burst(16); };
$("#readBtn").onclick = () => { rest.hidden = false; $("#letter").scrollIntoView({ behavior: "smooth" }); burst(8); };

/* ---------- reasons ---------- */
let ri = 0;
const moreBtn = $("#moreBtn"), list = $("#reasonList");
moreBtn.onclick = () => {
  if (ri > REASONS.length) { list.innerHTML = ""; ri = 0; }
  const c = document.createElement("div");
  c.className = "reason";
  c.textContent = ri < REASONS.length ? REASONS[ri] : "…and a thousand more I haven't said yet ❤️";
  list.prepend(c); ri++; burst(5);
  moreBtn.textContent = ri > REASONS.length ? "Read Them Again ❤️" : "One More Reason ❤️";
};

$("#replayBtn").onclick = () => {
  env.classList.remove("open"); openBtn.hidden = false; msg.hidden = true; rest.hidden = true;
  list.innerHTML = ""; ri = 0; moreBtn.textContent = "One More Reason ❤️";
  window.scrollTo({ top: 0, behavior: "smooth" }); burst(20);
};

/* ---------- music (never autoplays) ---------- */
const song = $("#song"), mb = $("#musicBtn");
mb.onclick = () => {
  if (song.paused) {
    song.play().then(() => mb.textContent = "⏸ Music").catch(() => mb.textContent = "Add music/our-song.mp3");
  } else { song.pause(); mb.textContent = "🎵 Music"; }
};

/* ---------- back to top + section fade-in ---------- */
const toTop = $("#top");
toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
addEventListener("scroll", () => toTop.classList.toggle("on", scrollY > 600), { passive: true });
const rv = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .05 });
  rv.forEach(s => io.observe(s));
} else rv.forEach(s => s.classList.add("in"));

/* ===== EDIT ME ===== */
const CODE = "2508";                 // day+month you became official (DDMM). Nov 25 monthsary => Aug 25 = 2508
const START = new Date("2026-08-25");
const COUPON = "🎟️ Read My Poem ❤️";
const FINAL = [
  "If I could keep one moment forever, I'd let time stop right here with you. ❤️",

  "Somewhere between a thousand faces, my heart found its way home to you.",

  "I never knew an ordinary moment could become something I'd remember for a lifetime.",

  "If the world ever asks me where happiness lives, I'll point to every moment spent with you.",

  "You are the quiet kind of miracle I never knew I was waiting for.",

  "I wish you could see yourself through my eyes, even for a second, just to understand how beautiful you are to me.",

  "Time may turn these moments into memories, but it could never make them mean less to me.",

  "In a world that never stops moving, you are the moment I'd gladly stay in.",

  "I don't need a perfect story; I just want a lifetime of imperfect days with you.",

  "If love is found in the little things, then I've fallen for you a thousand times over.",

  "There are sunsets I could watch forever, but none would ever be as beautiful as the way you make me feel.",

  "Even on the days when words fail me, I hope my actions remind you that you are deeply loved.",

  "I want to be there for the chapters you haven't written yet, not just the beautiful pages we've already lived.",

  "Perhaps forever is too big a promise, but choosing you today, and again tomorrow, is a promise I can make.",

  "You turned moments I might have forgotten into memories I never want to lose.",

  "I hope that when you look back at these pictures, you remember not just how we looked, but how much love was there.",

  "If I could send one feeling through time, it would be the warmth I feel whenever I'm beside you.",

  "Among all the things life has yet to show me, I hope loving you remains one of my favorite discoveries.",

  "I don't want to rush through our story. I want to live every page, every pause, and every little detail with you.",

  "You are not just someone in my happiest memories; you are someone I want in all the memories still waiting to happen.",

  "One day, we'll look at these photographs and smile at how young our love was, and how much more it learned to become.",

  "I may not always find the perfect words, but my heart has never been uncertain about how much you mean to me.",

  "If I had to begin this story a thousand times, I would still hope every version of it leads me to you.",

  "May we never become strangers to the little things that made us fall for each other.",

  "And if these photographs could speak, I hope every single one would tell you the same thing: I am grateful that it's you."
]
/* ==================== */
const E = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };
const rain = n => { for (let i = 0; i < n; i++) setTimeout(() => heart(), i * 45); };
const shuf = a => a.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
function toast(m) { document.getElementById("toast")?.remove(); const t = E("div"); t.id = "toast"; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 3200); }

/* 1. envelope: secret code lock, then a mini show */
const origOpen = openBtn.onclick;
openBtn.onclick = () => {
  const o = E("div", "ov", `<div class="card"><h3 style="margin:0">🔒 A little secret first</h3><p>Hint: the day &amp; month we became official (DDMM) 💕</p><input inputmode="numeric" maxlength="4" placeholder="••••"><button class="btn" type="button">Unlock 💌</button><p class="err"></p></div>`);
  document.body.append(o);
  const inp = o.querySelector("input"), card = o.querySelector(".card");
  o.querySelector("button").onclick = () => {
    if (inp.value === CODE) { o.remove(); origOpen(); sequence(); }
    else { card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); o.querySelector(".err").textContent = "Almost, baby 🥺 think of our very first day…"; }
  };
  inp.focus();
};
function sequence() {
  const d = Math.max(1, Math.floor((Date.now() - START) / 864e5));
  const L = ["Psst… baby 💕", "Three months ago, I got the luckiest ticket of my life.", `${d} days of you.  ${d * 24} hours of being happy.`, "Now… let me tell you something ❤️"];
  const o = E("div", "ov"); document.body.append(o);
  let i = 0;
  (function next() {
    if (i >= L.length) { o.remove(); rain(30); return; }
    o.replaceChildren(E("p", "line", L[i++])); rain(6); setTimeout(next, 2600);
  })();
  o.onclick = () => { i = L.length; };
}

/* 2. photo surprises: double-tap a photo for a love note + hearts; lightbox shows a note when no caption */
document.addEventListener("dblclick", e => {
  const p = e.target.closest(".polaroid"); if (!p) return;
  heart((e.clientX / innerWidth) * 100); burst(10); toast(NOTES[Math.random() * NOTES.length | 0]);
});
const _show = show;
show = i => { _show(i); setTimeout(() => { if (!lbCap.textContent) lbCap.textContent = NOTES[cur % NOTES.length]; }, 260); };

/* 3. games */
const g = E("section"); g.id = "games"; g.className = "in";
g.innerHTML = `<h2>Little Surprises 🎁</h2><p class="sub">Win all 3 games to unlock my final secret 🔐</p><div id="keys">🔑 0 / 3</div>
<div class="g" id="g1"><h3 style="margin:0">💞 Match Our Memories</h3><div class="mg"></div></div>
<div class="g" id="g2"><h3 style="margin:0">🧩 Piece Us Back Together</h3><div class="sp"></div></div>
<div class="g" id="g3"><h3 style="margin:0">🎟️ Scratch Your Gift</h3><div class="sc"><span>${COUPON}</span><canvas width="300" height="150"></canvas></div></div>`;
$("#rest").insertBefore(g, $("#reasons"));
let won = new Set();
function win(k, msg) {
  if (won.has(k)) return; won.add(k); $("#g" + k).classList.add("done");
  $("#keys").textContent = `🔑 ${won.size} / 3`; burst(14); toast(msg);
  if (won.size === 3) setTimeout(vault, 2200);
}
const pool = () => PHOTOS.length ? PHOTOS : [];

/* match */
const mg = $("#g1 .mg"); let first = null, lock = false, pairs = 0;
function setupMatch() {
  const ps = shuf(pool()).slice(0, 6); if (ps.length < 2) return;
  const deck = shuf(ps.concat(ps));
  mg.replaceChildren(...deck.map(p => { const c = E("div", "mc"); c.dataset.s = p.src; c.onclick = () => flip(c); return c; }));
  pairs = ps.length;
}
function flip(c) {
  if (lock || c.classList.contains("up") || c.classList.contains("ok")) return;
  c.classList.add("up"); c.style.backgroundImage = `url(${c.dataset.s})`;
  if (!first) { first = c; return; }
  if (first.dataset.s === c.dataset.s) { first.classList.add("ok"); c.classList.add("ok"); first = null; if (--pairs === 0) win(1, "You remember everything about us 🥹❤️"); }
  else { lock = true; const a = first; first = null; setTimeout(() => { [a, c].forEach(x => { x.classList.remove("up"); x.style.backgroundImage = ""; }); lock = false; }, 800); }
}

/* sliding puzzle */
const sp = $("#g2 .sp");
function setupSlide() {
  const p = pool()[Math.random() * pool().length | 0]; if (!p) return;
  const W = Math.min(300, innerWidth * .75), H = W * p.h / p.w; sp.style.width = W + "px"; sp.style.height = H + "px";
  let pos = [0, 1, 2, 3, 4, 5, 6, 7, 8]; let e = 8;                 // pos[tile] = cell; tile 8 is the empty one
  const adj = c => [c - 3, c + 3, c % 3 ? c - 1 : -1, c % 3 < 2 ? c + 1 : -1].filter(x => x >= 0 && x < 9);
  for (let k = 0; k < 90; k++) { const c = adj(pos[8])[Math.random() * adj(pos[8]).length | 0]; const t = pos.indexOf(c);[pos[t], pos[8]] = [pos[8], pos[t]]; }
  const tiles = [];
  for (let t = 0; t < 8; t++) { const d = E("div"); d.style.backgroundImage = `url(${p.src})`; d.style.backgroundPosition = `${(t % 3) * 50}% ${Math.floor(t / 3) * 50}%`; d.onclick = () => move(t); sp.append(d); tiles.push(d); }
  const place = () => tiles.forEach((d, t) => { d.style.left = (pos[t] % 3) * 33.333 + "%"; d.style.top = Math.floor(pos[t] / 3) * 33.333 + "%"; });
  function move(t) {
    if (!adj(pos[8]).includes(pos[t])) return;
    [pos[t], pos[8]] = [pos[8], pos[t]]; place();
    if (pos.every((c, i) => c === i)) { const f = E("div"); f.style.cssText = `position:absolute;inset:0;background:url(${p.src}) center/100% 100%;animation:pop .6s`; sp.append(f); win(2, "We fit together perfectly 🧩❤️"); }
  }
  place();
}

/* scratch card */
const cv = $("#g3 canvas"), cx = cv.getContext("2d"); let sdown = false;
cx.fillStyle = "#e9a0b5"; cx.fillRect(0, 0, 300, 150); cx.fillStyle = "#fff"; cx.font = "20px Georgia"; cx.textAlign = "center"; cx.fillText("Scratch 💖", 150, 80);
function scratch(ev) {
  const r = cv.getBoundingClientRect(); cx.globalCompositeOperation = "destination-out"; cx.beginPath();
  cx.arc((ev.clientX - r.left) * 300 / r.width, (ev.clientY - r.top) * 150 / r.height, 18, 0, 7); cx.fill();
}
cv.onpointerdown = e => { sdown = true; scratch(e); };
cv.onpointermove = e => { if (sdown) scratch(e); };
addEventListener("pointerup", () => {
  if (!sdown) return; sdown = false;
  const d = cx.getImageData(0, 0, 300, 150).data; let c = 0; for (let i = 3; i < d.length; i += 16) if (!d[i]) c++;
  if (c / (d.length / 16) > .4) { cv.remove(); win(3, "Redeem it anytime, baby 🎟️❤️"); }
});

/* build games when photos are ready */
const wait = setInterval(() => { if (PHOTOS.length) { clearInterval(wait); setupMatch(); setupSlide(); } }, 300);

/* 4. final vault */
function vault() {
  const o = E("div", "ov vault"); document.body.append(o);
  const ph = shuf(pool()); let i = 0, j = 0;
  const step = () => {
    if (!o.isConnected) return;
    const im = E("img"); if (ph.length) im.src = ph[i++ % ph.length].src;
    const l = E("p", "line", FINAL[Math.min(j++, FINAL.length - 1)]);
    const b = E("button", "btn", "Close ❤️"); b.onclick = () => o.remove();
    o.replaceChildren(...(ph.length ? [im] : []), l, ...(j >= FINAL.length ? [b] : []));
    rain(20); setTimeout(step, 4200);
  };
  step();
}