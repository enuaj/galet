/* Galet — suivi calisthenics. Données 100 % locales (localStorage + IndexedDB pour les photos). */
"use strict";

/* ---------- Catalogue d'exercices (sol + chaise) ---------- */
const CATALOG = {
  push: { name: "Pompes", unit: "reps", min: 6, max: 15, step: 1, variants: [
    { n: "Pompes inclinées", cue: "Mains sur l'assise d'une chaise calée contre un mur. Corps gainé, la poitrine descend vers le bord." },
    { n: "Pompes sur les genoux", cue: "Genoux au sol, hanches alignées avec les épaules. Poitrine à un poing du sol." },
    { n: "Pompes", cue: "Corps en planche, coudes à 45°, descente en 2 secondes." },
    { n: "Pompes pieds surélevés", cue: "Pieds sur la chaise, mains au sol. Abdos et fessiers serrés." } ] },
  dips: { name: "Dips", unit: "reps", min: 6, max: 15, step: 1, variants: [
    { n: "Dips sur chaise, jambes fléchies", cue: "Mains au bord de l'assise, pieds proches. Descends jusqu'à 90° aux coudes." },
    { n: "Dips sur chaise, jambes tendues", cue: "Talons au sol loin devant. Épaules basses, dos près de la chaise." },
    { n: "Dips pieds surélevés", cue: "Pieds sur une seconde chaise. Descente lente, poussée franche." } ] },
  superman: { name: "Dos", unit: "reps", min: 8, max: 20, step: 1, variants: [
    { n: "Superman", cue: "À plat ventre, décolle bras et jambes 1 seconde, regard vers le sol." },
    { n: "Superman tenu 3 s", cue: "Même mouvement, tiens 3 secondes en haut à chaque répétition." },
    { n: "Nageur", cue: "Bras et jambes décollés, balaye les bras de l'avant vers les hanches." } ] },
  plank: { name: "Gainage", unit: "sec", min: 20, max: 60, step: 5, variants: [
    { n: "Planche sur les genoux", cue: "Avant-bras au sol, genoux posés, ligne droite genoux-épaules." },
    { n: "Planche", cue: "Avant-bras sous les épaules, bassin ni haut ni bas, respiration calme." },
    { n: "Planche, levée de bras alternée", cue: "En planche, tends un bras devant sans tourner le bassin, alterne." } ] },
  side: { name: "Gainage latéral", unit: "sec", min: 15, max: 45, step: 5, side: true, variants: [
    { n: "Gainage latéral sur genou", cue: "Coude sous l'épaule, genou au sol, hanche haute." },
    { n: "Gainage latéral", cue: "Pieds empilés, corps aligné, hanche haute." } ] },
  squat: { name: "Squats", unit: "reps", min: 10, max: 25, step: 1, variants: [
    { n: "Squat", cue: "Pieds largeur d'épaules, talons au sol, cuisses à l'horizontale." },
    { n: "Squat pause 2 s", cue: "Tiens 2 secondes en bas, remonte en poussant dans les talons." },
    { n: "Squat sauté", cue: "Squat puis saut, réception souple sur l'avant du pied." } ] },
  lunge: { name: "Fentes", unit: "reps", min: 6, max: 15, step: 1, side: true, variants: [
    { n: "Fentes arrière", cue: "Recule une jambe, genou arrière près du sol, buste droit." },
    { n: "Fentes avant", cue: "Grand pas devant, genou avant au-dessus de la cheville." },
    { n: "Fentes bulgares", cue: "Pied arrière sur la chaise, descends à la verticale." } ] },
  glute: { name: "Pont fessier", unit: "reps", min: 10, max: 20, step: 1, variants: [
    { n: "Pont fessier", cue: "Dos au sol, pieds proches des fesses. Monte le bassin, serre 1 seconde." },
    { n: "Pont fessier une jambe", cue: "Une jambe tendue en l'air, pousse dans le talon au sol." } ] },
  climber: { name: "Mountain climbers", unit: "sec", min: 20, max: 45, step: 5, variants: [
    { n: "Mountain climbers lents", cue: "Mains sur la chaise, ramène un genou puis l'autre sous la poitrine." },
    { n: "Mountain climbers", cue: "Mains au sol, bassin stable, rythme régulier." } ] },
  core: { name: "Abdos", unit: "reps", min: 8, max: 20, step: 1, variants: [
    { n: "Crunch inversé", cue: "Dos au sol, genoux à 90°, ramène les genoux vers la poitrine." },
    { n: "Relevé de jambes", cue: "Jambes presque tendues, descends lentement sans cambrer." } ] }
};
const PLAN = {
  A: { name: "Haut du corps + gainage", ex: ["push", "dips", "superman", "plank", "side"] },
  B: { name: "Bas du corps + cardio", ex: ["squat", "lunge", "glute", "climber", "core"] }
};
const DAYNAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const DAYLETTERS = ["D", "L", "M", "M", "J", "V", "S"];
const BADGES = [
  { id: "first", ic: "🌱", n: "1re séance" },
  { id: "perfect", ic: "💯", n: "Séance parfaite" },
  { id: "week", ic: "📅", n: "Semaine complète" },
  { id: "weeks4", ic: "🗓️", n: "4 semaines d'affilée" },
  { id: "s10", ic: "🔟", n: "10 séances" },
  { id: "s25", ic: "🥉", n: "25 séances" },
  { id: "s50", ic: "🥈", n: "50 séances" },
  { id: "s100", ic: "🥇", n: "100 séances" },
  { id: "flame7", ic: "🔥", n: "Flamme 7 j" },
  { id: "flame30", ic: "☄️", n: "Flamme 30 j" },
  { id: "w7", ic: "⚖️", n: "7 pesées" },
  { id: "w30", ic: "📈", n: "30 pesées" },
  { id: "photo", ic: "📸", n: "1re photo" },
  { id: "variant", ic: "🧗", n: "Variante débloquée" },
  { id: "comeback", ic: "🔁", n: "Retour après pause" },
  { id: "lvl5", ic: "⭐", n: "Niveau 5" }
];

/* ---------- Dates ---------- */
const pad = n => String(n).padStart(2, "0");
const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const today = () => dkey(new Date());
const parseD = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseD(k); d.setDate(d.getDate() + n); return dkey(d); };
const diffDays = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
const weekStart = k => { const d = parseD(k); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dkey(d); };
const fmtD = k => parseD(k).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const fmtDL = k => parseD(k).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const fmtDur = s => { const m = Math.floor(s / 60), r = s % 60; return m + ":" + pad(r); };
const fmt1 = v => (Math.round(v * 10) / 10).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Stockage ---------- */
const KEY = "galet.v1";
let S = null;
function blank() {
  return { v: 1, profile: null, exercises: {}, sessions: [], carry: [], weights: [], photos: [],
    xp: 0, freezes: 0, freezeDays: [], badges: [], weeksRewarded: [], current: null,
    settings: { rest: 45 }, lastCheck: null };
}
function load() {
  try { const raw = localStorage.getItem(KEY); S = raw ? Object.assign(blank(), JSON.parse(raw)) : blank(); }
  catch (e) { S = blank(); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Enregistrement impossible : stockage plein ou bloqué"); } }

/* IndexedDB pour les photos */
let dbp = null;
function db() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open("galet", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("photos", { keyPath: "id" });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function idb(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const tx = d.transaction("photos", mode); const st = tx.objectStore("photos");
    const r = fn(st); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error);
  });
}
const photoPut = rec => idb("readwrite", st => st.put(rec));
const photoGet = id => idb("readonly", st => st.get(id));
const photoDel = id => idb("readwrite", st => st.delete(id));
const photoAll = () => idb("readonly", st => st.getAll());

/* ---------- XP / niveaux ---------- */
function levelOf(xp) { let l = 1, need = 100; while (xp >= need) { xp -= need; l++; need += 50; } return { l, cur: xp, need }; }
function addXP(n) { const before = levelOf(S.xp).l; S.xp += n; const after = levelOf(S.xp).l; if (after > before) { toast("Niveau " + after + " atteint !"); if (after >= 5) badge("lvl5"); } }
function badge(id) { if (!S.badges.includes(id)) { S.badges.push(id); const b = BADGES.find(x => x.id === id); if (b) setTimeout(() => toast(b.ic + " Badge : " + b.n), 900); } }

/* ---------- Exercices : cibles et progression ---------- */
function initExercises(level) {
  S.exercises = {};
  for (const [id, c] of Object.entries(CATALOG)) {
    const vmax = c.variants.length - 1;
    let v = 0, sets = 2, reps = c.min;
    if (level === 1) { v = Math.min(1, vmax); reps = c.min + 2 * c.step; }
    if (level === 2) { v = Math.min(2, vmax); sets = 3; }
    S.exercises[id] = { v, sets, reps, partial: 0, skip: 0 };
  }
}
function tgtLabel(id, e) {
  const c = CATALOG[id]; e = e || S.exercises[id];
  return e.sets + " × " + e.reps + (c.unit === "sec" ? " s" : "") + (c.side ? " /côté" : "");
}
function totalOf(id, e) { return e.sets * e.reps * (CATALOG[id].side ? 2 : 1); }

/* Règles de progression après chaque exercice */
function progress(id, status) {
  const c = CATALOG[id], e = S.exercises[id]; let note = "";
  if (status === "full") {
    e.partial = 0; e.skip = 0;
    e.reps += c.step;
    if (e.reps > c.max) {
      if (e.sets < 3) { e.sets += 1; e.reps = c.min + 2 * c.step; note = "Une série de plus"; }
      else if (e.v < c.variants.length - 1) { e.v += 1; e.sets = 2; e.reps = c.min; note = "Nouvelle variante : " + c.variants[e.v].n; badge("variant"); }
      else { e.reps = c.max; note = "Maximum du programme atteint"; }
    }
  } else if (status === "partial") {
    e.skip = 0; e.partial += 1;
    if (e.partial >= 2) { e.reps = Math.max(c.unit === "sec" ? 10 : 3, Math.round(e.reps * 0.85 / c.step) * c.step); e.partial = 0; note = "Cible ajustée à la baisse"; }
    else note = "Même cible la prochaine fois";
  } else {
    e.partial = 0; e.skip += 1;
    if (!S.carry.includes(id)) S.carry.push(id);
    if (e.skip >= 2) { e.reps = Math.max(c.unit === "sec" ? 10 : 3, Math.round(e.reps * 0.9 / c.step) * c.step); e.skip = 0; note = "Cible allégée, reprogrammé"; }
    else note = "Reprogrammé à la prochaine séance";
  }
  if (status !== "skip") S.carry = S.carry.filter(x => x !== id);
  return note;
}

function nextType() {
  const last = S.sessions[S.sessions.length - 1];
  return !last ? "A" : (last.type === "A" ? "B" : "A");
}
function buildSession(type) {
  const base = PLAN[type].ex;
  const carried = S.carry.filter(x => !base.includes(x)).slice(0, 2);
  const items = [...carried.map(x => ({ ex: x, carry: true })), ...base.map(x => ({ ex: x, carry: S.carry.includes(x) }))];
  return items.map(it => { const e = S.exercises[it.ex]; return { ex: it.ex, carry: it.carry, v: e.v, sets: e.sets, reps: e.reps, setsDone: 0, status: null, done: 0 }; });
}
/* Reprise après une pause > 10 jours : cibles allégées de 15 % */
function checkComeback() {
  const last = S.sessions[S.sessions.length - 1];
  if (!last) return null;
  const gap = diffDays(last.date, today());
  if (gap > 10 && S.lastDeload !== last.id) {
    for (const [id, e] of Object.entries(S.exercises)) {
      const c = CATALOG[id]; e.reps = Math.max(c.min, Math.round(e.reps * 0.85 / c.step) * c.step);
    }
    S.lastDeload = last.id; save();
    return gap;
  }
  return null;
}

/* ---------- Flamme (activité quotidienne) ---------- */
function activeDays() {
  const s = new Set();
  S.sessions.forEach(x => s.add(x.date)); S.weights.forEach(x => s.add(x.date)); S.freezeDays.forEach(x => s.add(x));
  return s;
}
/* Consomme les gels si des jours ont été manqués depuis la dernière activité */
function applyFreezes() {
  const t = today(); if (S.lastCheck === t) return; S.lastCheck = t;
  const act = activeDays(); if (!act.size) { save(); return; }
  const y = addDays(t, -1); if (act.has(y)) { save(); return; }
  let last = null; for (let i = 2; i < 400; i++) { const k = addDays(t, -i); if (act.has(k)) { last = k; break; } }
  if (!last) { save(); return; }
  const missed = diffDays(last, y);
  if (missed <= S.freezes) {
    for (let i = 1; i <= missed; i++) S.freezeDays.push(addDays(last, i));
    S.freezes -= missed; setTimeout(() => toast("❄️ " + missed + " gel" + (missed > 1 ? "s" : "") + " utilisé" + (missed > 1 ? "s" : "") + " : ta flamme tient"), 600);
  }
  save();
}
function flame() {
  const act = activeDays(); let k = today(); let n = 0;
  if (!act.has(k)) k = addDays(k, -1);
  while (act.has(k)) { n++; k = addDays(k, -1); }
  return n;
}
/* ---------- Régularité hebdomadaire ---------- */
const goal = () => (S.profile ? S.profile.days.length : 4);
function sessionsInWeek(ws) { return S.sessions.filter(s => weekStart(s.date) === ws).length; }
function weekStreak() {
  let ws = weekStart(today()); let n = 0;
  if (sessionsInWeek(ws) >= goal()) n++;
  ws = addDays(ws, -7);
  while (sessionsInWeek(ws) >= goal()) { n++; ws = addDays(ws, -7); }
  return n;
}
function checkWeekReward() {
  const ws = weekStart(today());
  if (sessionsInWeek(ws) >= goal() && !S.weeksRewarded.includes(ws)) {
    S.weeksRewarded.push(ws); badge("week"); addXP(50);
    if (S.freezes < 2) { S.freezes++; setTimeout(() => toast("❄️ Objectif de la semaine atteint : +1 gel de flamme"), 1400); }
    if (weekStreak() >= 4) badge("weeks4");
  }
}

/* ---------- Poids / IMC ---------- */
const sortedW = () => [...S.weights].sort((a, b) => a.date < b.date ? -1 : 1);
const lastW = () => { const w = sortedW(); return w.length ? w[w.length - 1] : null; };
const bmi = kg => S.profile && S.profile.height ? kg / Math.pow(S.profile.height / 100, 2) : null;
function bmiZone(b) {
  if (b < 18.5) return { t: "Insuffisance pondérale", c: "warn" };
  if (b < 25) return { t: "Corpulence normale", c: "good" };
  if (b < 30) return { t: "Surpoids", c: "warn" };
  return { t: "Obésité", c: "bad" };
}
function trend(ws) { /* moyenne glissante sur 7 jours */
  return ws.map(p => { const win = ws.filter(q => q.date <= p.date && diffDays(q.date, p.date) < 7); return { date: p.date, kg: win.reduce((a, q) => a + q.kg, 0) / win.length }; });
}
function wAt(k) { const w = sortedW().filter(x => x.date <= k); return w.length ? w[w.length - 1] : null; }
function saveWeight(kg, date) {
  date = date || today();
  const had = S.weights.some(w => w.date === date);
  S.weights = S.weights.filter(w => w.date !== date); S.weights.push({ date, kg });
  if (!had && date === today()) addXP(5);
  if (S.weights.length >= 7) badge("w7"); if (S.weights.length >= 30) badge("w30");
  const f = flame(); if (f >= 7) badge("flame7"); if (f >= 30) badge("flame30");
  save();
}

/* ---------- Mascotte : Galet ---------- */
function mascot(mood) {
  const eyes = mood === "sleep"
    ? '<path d="M34 46q5 4 10 0M56 46q5 4 10 0" stroke="#3B342A" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : '<circle cx="39" cy="45" r="5" fill="#3B342A"/><circle cx="61" cy="45" r="5" fill="#3B342A"/><circle cx="40.5" cy="43.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="43.5" r="1.6" fill="#fff"/>';
  const mouth = {
    happy: '<path d="M40 58q10 10 20 0" stroke="#3B342A" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
    wow: '<ellipse cx="50" cy="61" rx="5" ry="6" fill="#3B342A"/>',
    calm: '<path d="M42 60q8 4 16 0" stroke="#3B342A" stroke-width="3" fill="none" stroke-linecap="round"/>',
    sleep: '<path d="M44 61h12" stroke="#3B342A" stroke-width="3" stroke-linecap="round"/>',
    sad: '<path d="M41 64q9 -7 18 0" stroke="#3B342A" stroke-width="3" fill="none" stroke-linecap="round"/>'
  }[mood] || "";
  const extra = mood === "wow" ? '<path d="M16 22l5 6M84 22l-5 6M50 6v7" stroke="#F76707" stroke-width="3.5" stroke-linecap="round"/>' :
    mood === "sleep" ? '<text x="74" y="22" font-size="14" font-weight="800" fill="#8A8377">z</text><text x="84" y="12" font-size="10" font-weight="800" fill="#8A8377">z</text>' : "";
  return '<svg class="mascot" viewBox="0 0 100 100" aria-hidden="true">' + extra +
    '<ellipse cx="50" cy="90" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>' +
    '<path d="M50 18c24 0 38 16 38 38 0 20-15 32-38 32S12 76 12 56c0-22 14-38 38-38z" fill="#CDBFAA" stroke="#9C8D77" stroke-width="3"/>' +
    '<path d="M30 30q8-6 18-6" stroke="#E6DCCB" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="31" cy="56" r="5" fill="#F4A68C" opacity=".55"/><circle cx="69" cy="56" r="5" fill="#F4A68C" opacity=".55"/>' +
    eyes + mouth + '</svg>';
}
const pick = a => a[Math.floor(Math.random() * a.length)];
function homeMessage(ctx) {
  const name = S.profile && S.profile.name ? S.profile.name : "";
  if (ctx.comeback) return { m: "wow", t: "Content de te revoir" + (name ? ", " + name : "") + ". J'ai allégé les cibles de 15 % pour reprendre en douceur." };
  if (ctx.doneToday) return { m: "happy", t: pick(["Séance faite. On récupère et on revient.", "Une brique de plus au mur. Beau travail.", "C'est dans la boîte. La régularité fait le reste."]) };
  if (ctx.plannedToday) return { m: "wow", t: pick(["Séance prévue aujourd'hui : " + ctx.minutes + " minutes et c'est réglé.", "Aujourd'hui on bouge. Je t'attends.", "Petite séance, grande régularité. On y va ?"]) };
  if (!ctx.weighedToday) return { m: "calm", t: "Jour de repos. Une pesée suffit pour garder ta flamme." };
  return { m: "sleep", t: pick(["Repos mérité. Les muscles se construisent aussi aujourd'hui.", "Rien à faire aujourd'hui, à part récupérer.", "Jour off. À demain."]) };
}

/* ---------- Petits outils d'interface ---------- */
let toastT = null;
function toast(t) {
  const old = document.querySelector(".toast"); if (old) old.remove();
  const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d);
  clearTimeout(toastT); toastT = setTimeout(() => d.remove(), 2600);
}
function openModal(html) { document.getElementById("modal").innerHTML = '<div class="overlay" data-a="modal-bg"><div class="sheet">' + html + "</div></div>"; }
function closeModal() { document.getElementById("modal").innerHTML = ""; }
let actx = null;
function beep(freq, dur) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = freq || 880; o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0.15, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + (dur || 0.25));
    o.start(); o.stop(actx.currentTime + (dur || 0.25));
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate(200); } catch (e) {}
}
function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("confetti"), cx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#E8590C", "#2B8A3E", "#1971C2", "#F2B84B", "#CDBFAA"];
  const P = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 12, vy: Math.random() * -12 - 2, r: Math.random() * 6 + 4, c: pick(cols), a: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.a += .2; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else cx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ---------- Graphiques SVG (sans dépendance) ---------- */
const CH = {};
function niceTicks(lo, hi, n) {
  const span = hi - lo || 1; const raw = span / n; const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(s => s * mag).find(s => span / s <= n) || mag * 10;
  const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) t.push(Math.round(v * 100) / 100); return t;
}
/* series: [{pts:[{t:dateKey,v,tip}], color, w, dots, dash}] ; bands: [{from,to,label}] */
function lineChart(id, o) {
  const W = 340, H = o.h || 190, L = 34, R = 8, T = 12, B = 22;
  const all = o.series.flatMap(s => s.pts); if (!all.length) return '<p class="muted small">Pas encore de données.</p>';
  let t0 = Math.min(...all.map(p => parseD(p.t).getTime())), t1 = Math.max(...all.map(p => parseD(p.t).getTime()));
  if (o.from) t0 = Math.min(t0, parseD(o.from).getTime());
  if (t0 === t1) { t0 -= 86400000 * 3; t1 += 86400000 * 3; }
  let v0 = Math.min(...all.map(p => p.v)), v1 = Math.max(...all.map(p => p.v));
  if (o.yMin != null) v0 = Math.min(v0, o.yMin); if (o.yMax != null) v1 = Math.max(v1, o.yMax);
  const padv = (v1 - v0) * 0.12 || 1; v0 -= padv; v1 += padv;
  const X = t => L + (parseD(t).getTime() - t0) / (t1 - t0) * (W - L - R);
  const Y = v => T + (1 - (v - v0) / (v1 - v0)) * (H - T - B);
  let g = "";
  (o.bands || []).forEach((b, i) => {
    const y1 = Y(Math.min(b.to, v1)), y2 = Y(Math.max(b.from, v0)); if (y2 <= y1) return;
    g += `<rect x="${L}" y="${y1}" width="${W - L - R}" height="${y2 - y1}" fill="var(--ink)" opacity="${i % 2 ? .035 : .07}"/>`;
    g += `<text x="${W - R - 4}" y="${y1 + 12}" text-anchor="end" font-size="10" fill="var(--ink-3)">${b.label}</text>`;
  });
  niceTicks(v0, v1, 4).forEach(v => { g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="var(--ink-3)">${(o.yFmt || (x => x))(v)}</text>`; });
  const d0 = dkey(new Date(t0)), d1 = dkey(new Date(t1));
  g += `<text x="${L}" y="${H - 5}" font-size="10" fill="var(--ink-3)">${fmtD(d0)}</text><text x="${W - R}" y="${H - 5}" text-anchor="end" font-size="10" fill="var(--ink-3)">${fmtD(d1)}</text>`;
  o.series.forEach(s => {
    if (s.pts.length > 1 && s.w !== 0) g += `<path d="${s.pts.map((p, i) => (i ? "L" : "M") + X(p.t).toFixed(1) + " " + Y(p.v).toFixed(1)).join("")}" fill="none" stroke="${s.color}" stroke-width="${s.w || 2}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="4 4"' : ""}/>`;
    if (s.dots) s.pts.forEach(p => { g += `<circle cx="${X(p.t)}" cy="${Y(p.v)}" r="${s.pts.length > 40 ? 2.5 : 4}" fill="${s.color}" stroke="var(--surface)" stroke-width="2" opacity="${s.op || 1}"/>`; });
  });
  g += `<line class="cross" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="var(--ink-3)" stroke-width="1" opacity="0"/><circle class="hl" r="6" fill="none" stroke="var(--ink)" stroke-width="2" opacity="0"/>`;
  const main = o.series[o.tipSeries || 0].pts;
  CH[id] = { pts: main.map(p => ({ x: X(p.t), y: Y(p.v), tip: p.tip })), W };
  return `<div class="chart" id="${id}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "")}">${g}</svg><div class="tip"></div></div>`;
}
function barChart(id, bars, o) {
  o = o || {}; const W = 340, H = o.h || 150, L = 26, R = 4, T = 10, B = 20;
  const mx = Math.max(o.min || 1, ...bars.map(b => b.v)); const bw = (W - L - R) / bars.length;
  const Y = v => T + (1 - v / mx) * (H - T - B); let g = "";
  niceTicks(0, mx, 3).forEach(v => { g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L - 5}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="var(--ink-3)">${v}</text>`; });
  if (o.goal) g += `<line x1="${L}" x2="${W - R}" y1="${Y(o.goal)}" y2="${Y(o.goal)}" stroke="var(--accent)" stroke-dasharray="4 4" stroke-width="1.5"/>`;
  bars.forEach((b, i) => {
    const x = L + i * bw + 2, w = bw - 4, y = Y(b.v), h = H - B - y;
    if (h > 0) g += `<path d="M${x} ${H - B}V${y + Math.min(4, h)}q0 -4 4 -4h${w - 8}q4 0 4 4V${H - B}z" fill="${b.hi ? "var(--accent)" : "var(--data)"}"/>`;
    if (b.lab) g += `<text x="${x + w / 2}" y="${H - 6}" text-anchor="middle" font-size="9.5" fill="var(--ink-3)">${b.lab}</text>`;
  });
  CH[id] = { pts: bars.map((b, i) => ({ x: L + i * bw + bw / 2, y: Y(b.v), tip: b.tip })), W, bar: true };
  return `<div class="chart" id="${id}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "")}">${g}</svg><div class="tip"></div></div>`;
}
function bindCharts() {
  document.querySelectorAll(".chart").forEach(el => {
    const c = CH[el.id]; if (!c || !c.pts.length) return;
    const svg = el.querySelector("svg"), tip = el.querySelector(".tip"), cross = el.querySelector(".cross"), hl = el.querySelector(".hl");
    const show = ev => {
      const r = svg.getBoundingClientRect(); const sx = (ev.clientX - r.left) / r.width * c.W;
      let best = c.pts[0]; c.pts.forEach(p => { if (Math.abs(p.x - sx) < Math.abs(best.x - sx)) best = p; });
      tip.innerHTML = best.tip; tip.classList.add("on");
      const px = best.x / c.W * r.width; tip.style.left = Math.max(50, Math.min(r.width - 50, px)) + "px"; tip.style.top = Math.max(-30, best.y / c.W * r.width - 44) + "px";
      if (cross) { cross.setAttribute("x1", best.x); cross.setAttribute("x2", best.x); cross.setAttribute("opacity", ".6"); }
      if (hl && !c.bar) { hl.setAttribute("cx", best.x); hl.setAttribute("cy", best.y); hl.setAttribute("opacity", "1"); }
    };
    const hide = () => { tip.classList.remove("on"); cross && cross.setAttribute("opacity", "0"); hl && hl.setAttribute("opacity", "0"); };
    el.addEventListener("pointerdown", show); el.addEventListener("pointermove", show); el.addEventListener("pointerleave", hide);
  });
}

/* ---------- Navigation ---------- */
let VIEW = "home", UI = { range: "3M", exSel: "push", photoSel: [], onb: { level: 0, days: [1, 2, 4, 6] }, comeback: null };
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  session: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></svg>',
  progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M6 15l4-5 3 3 5-7"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9l3 3M12 9h3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>'
};
function renderTabs() {
  const t = document.getElementById("tabs");
  if (!S.profile) { t.style.display = "none"; return; } t.style.display = "";
  const items = [["home", "Accueil"], ["session", S.current ? "En cours" : "Séance"], ["progress", "Progrès"], ["body", "Corps"], ["settings", "Réglages"]];
  t.innerHTML = items.map(([k, l]) => `<button data-a="tab" data-v="${k}" class="${VIEW === k ? "on" : ""}">${ICONS[k]}${l}</button>`).join("");
}
function render() {
  const app = document.getElementById("app");
  if (!S.profile) VIEW = "onboarding";
  app.innerHTML = ({ onboarding: vOnboarding, home: vHome, session: vSession, progress: vProgress, body: vBody, settings: vSettings })[VIEW]();
  renderTabs(); bindCharts();
  if (VIEW === "body") loadPhotos();
}
function go(v) { VIEW = v; render(); window.scrollTo(0, 0); }

/* ---------- Onboarding ---------- */
function keepOnb() { ["o-name", "o-h", "o-w"].forEach(id => { const el = document.getElementById(id); if (el) UI.onb[id] = el.value; }); }
function vOnboarding() {
  const o = UI.onb; const val = id => esc(o[id] || "");
  const lv = [["Débutant", "Moins de 5 pompes d'affilée, peu d'activité récente"], ["Intermédiaire", "5 à 15 pompes, activité occasionnelle"], ["Confirmé", "Plus de 15 pompes, sport régulier"]];
  return `<div class="hero" style="margin:18px 0">${mascot("wow")}<div class="bubble">Salut, je suis Galet. Je t'aide à tenir le rythme, séance après séance.</div></div>
  <div class="card"><h3>Ton profil</h3>
  <label class="f">Prénom (facultatif)</label><input id="o-name" autocomplete="given-name" value="${val("o-name")}">
  <div class="grid2"><div><label class="f">Taille (cm)</label><input id="o-h" type="number" inputmode="numeric" placeholder="178" value="${val("o-h")}"></div>
  <div><label class="f">Poids du jour (kg)</label><input id="o-w" type="text" inputmode="decimal" step="0.1" placeholder="80,0" value="${val("o-w")}"></div></div></div>
  <div class="card"><h3>Ton niveau</h3><p class="muted small">Il fixe les cibles de départ. Elles s'ajustent ensuite à chaque séance.</p>
  ${lv.map((l, i) => `<button class="choice ${o.level === i ? "on" : ""}" data-a="onb-level" data-v="${i}"><b>${l[0]}</b><br><span class="small muted">${l[1]}</span></button>`).join("")}</div>
  <div class="card"><h3>Tes jours d'entraînement</h3><p class="muted small">4 séances de 15–20 min recommandées. Alternance haut du corps / bas du corps.</p>
  <div class="toggle7">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button data-a="onb-day" data-v="${d}" class="${o.days.includes(d) ? "on" : ""}">${DAYLETTERS[d]}</button>`).join("")}</div></div>
  <button class="btn primary" data-a="onb-go">C'est parti</button>
  <p class="tiny muted center" style="margin-top:12px">Tes données restent sur ce téléphone. Aucun compte, aucun partage.</p>`;
}

/* ---------- Accueil ---------- */
function vHome() {
  const t = today(), wd = new Date().getDay();
  const doneToday = S.sessions.some(s => s.date === t), weighedToday = S.weights.some(w => w.date === t);
  const plannedToday = S.profile.days.includes(wd);
  const type = S.current ? S.current.type : nextType();
  const minutes = "15–20";
  const msg = homeMessage({ doneToday, plannedToday, weighedToday, minutes, comeback: UI.comeback });
  const lv = levelOf(S.xp), fl = flame(), ws = weekStart(t), wk = sessionsInWeek(ws);
  const act = activeDays(); const sessD = new Set(S.sessions.map(s => s.date)); const wD = new Set(S.weights.map(w => w.date)); const fD = new Set(S.freezeDays);
  const week = Array.from({ length: 7 }, (_, i) => { const k = addDays(ws, i); const d = parseD(k).getDay();
    const cls = sessD.has(k) ? "done" : wD.has(k) ? "weigh" : fD.has(k) ? "frz" : S.profile.days.includes(d) ? "plan" : "";
    return `<div class="d ${cls} ${k === t ? "today" : ""}">${DAYNAMES[d]}<b>${sessD.has(k) ? "✓" : fD.has(k) ? "❄" : parseD(k).getDate()}</b></div>`; }).join("");
  const lw = lastW(); const lastPhoto = S.photos.length ? S.photos[S.photos.length - 1].date : null;
  const photoDue = !lastPhoto || diffDays(lastPhoto, t) >= 14;
  let todayCard;
  if (S.current) todayCard = `<div class="card"><div class="row between"><h3>Séance en cours</h3><span class="pill accent">${S.current.idx}/${S.current.items.length}</span></div><button class="btn primary" data-a="tab" data-v="session">Reprendre</button></div>`;
  else if (doneToday) todayCard = `<div class="card"><div class="row between"><h3>Séance du jour</h3><span class="pill good">Faite ✓</span></div><p class="small muted">Prochaine : séance ${type} · ${PLAN[type].name}</p></div>`;
  else todayCard = `<div class="card"><div class="row between"><h3>${plannedToday ? "Au programme aujourd'hui" : "Jour de repos"}</h3><span class="pill">${minutes} min</span></div>
    <p class="small muted">Séance ${type} · ${PLAN[type].name}${S.carry.length ? " · " + S.carry.length + " exercice" + (S.carry.length > 1 ? "s" : "") + " à rattraper" : ""}</p>
    <button class="btn ${plannedToday ? "primary" : "ghost"}" data-a="tab" data-v="session">${plannedToday ? "Voir la séance" : "Faire une séance bonus"}</button></div>`;
  return `<div class="row between" style="margin-top:6px"><h1>${S.profile.name ? "Salut " + esc(S.profile.name) : "Aujourd'hui"}</h1><div class="flame" title="Flamme : jours d'affilée avec une séance ou une pesée">🔥 ${fl}</div></div>
  <div class="hero" style="margin-bottom:14px">${mascot(msg.m)}<div class="bubble">${msg.t}</div></div>
  ${todayCard}
  ${!weighedToday ? `<div class="card"><div class="row between"><h3>Pesée du jour</h3><span class="pill accent">+5 XP</span></div>
    <div class="row"><input id="h-w" type="text" inputmode="decimal" step="0.1" value="${lw ? fmt1(lw.kg) : ""}" placeholder="kg"><button class="btn primary small" style="padding:13px 18px" data-a="weigh-home">OK</button></div>
    <p class="tiny muted" style="margin-top:6px">Lis la valeur sur ta balance ou dans l'app Withings.</p></div>` : ""}
  ${photoDue ? `<div class="card"><div class="row between"><h3>Photo de suivi</h3><span class="pill accent">+15 XP</span></div><p class="small muted">${lastPhoto ? "Dernière photo il y a " + diffDays(lastPhoto, t) + " jours." : "Une première photo servira de point de départ."} Même endroit, même lumière, même pose.</p><button class="btn ghost" data-a="photo-pick">Prendre la photo</button></div>` : ""}
  <div class="card"><div class="row between"><h3>Cette semaine</h3><span class="small ${wk >= goal() ? "" : "muted"}"><b>${wk}</b> / ${goal()} séances</span></div>
    <div class="days" style="margin:8px 0 12px">${week}</div>
    <div class="bar"><i style="width:${Math.min(100, wk / goal() * 100)}%"></i></div>
    <div class="row between small muted" style="margin-top:8px"><span>Semaines régulières d'affilée : <b style="color:var(--ink)">${weekStreak()}</b></span><span>❄️ ${S.freezes}/2</span></div></div>
  <div class="card"><div class="row between"><h3>Niveau ${lv.l}</h3><span class="small muted">${lv.cur} / ${lv.need} XP</span></div><div class="bar"><i style="width:${lv.cur / lv.need * 100}%;background:var(--good)"></i></div></div>
  <h2>Badges</h2><div class="card"><div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b.id) ? "on" : ""}"><div class="b">${b.ic}</div>${b.n}</div>`).join("")}</div></div>
  <input type="file" id="photo-in" accept="image/*" hidden>`;
}

/* ---------- Séance ---------- */
function vSession() {
  if (S.current && S.current.finished) return vSummary();
  if (S.current) return vRunner();
  const type = UI.forceType || nextType(); const items = buildSession(type);
  const vol = items.reduce((a, it) => a + it.sets, 0);
  return `<h1>Séance ${type}</h1><p class="muted" style="margin-top:-8px">${PLAN[type].name} · ${items.length} exercices · ${vol} séries · ≈ 15–20 min</p>
  <div class="seg" style="margin:8px 0 14px"><button data-a="stype" data-v="A" class="${type === "A" ? "on" : ""}">A · Haut</button><button data-a="stype" data-v="B" class="${type === "B" ? "on" : ""}">B · Bas</button></div>
  <div class="card exlist">${items.map((it, i) => { const c = CATALOG[it.ex]; return `<div class="it"><div class="num">${i + 1}</div><div><b>${c.variants[it.v].n}</b>${it.carry ? ' <span class="pill warn">rattrapage</span>' : ""}<div class="tiny muted">${c.name}</div></div><div class="tgt">${tgtLabel(it.ex, it)}</div></div>`; }).join("")}</div>
  <p class="small muted">Échauffement conseillé : 2 min de montées de genoux, rotations d'épaules et de hanches. Repos entre séries : ${S.settings.rest} s.</p>
  <button class="btn primary" data-a="start" data-v="${type}">Démarrer la séance</button>`;
}
function vRunner() {
  const cur = S.current, it = cur.items[cur.idx], c = CATALOG[it.ex], vr = c.variants[it.v];
  const isSec = c.unit === "sec";
  return `<div class="row between" style="margin-top:6px"><span class="small muted">Exercice ${cur.idx + 1} / ${cur.items.length}</span><button class="btn small ghost" data-a="abort">Quitter</button></div>
  <div class="bar" style="margin:8px 0 16px"><i style="width:${cur.idx / cur.items.length * 100}%"></i></div>
  <div class="card center">
    ${it.carry ? '<span class="pill warn">rattrapage</span>' : ""}
    <h1 style="margin:8px 0 2px">${vr.n}</h1><p class="muted small">${vr.cue}</p>
    <div class="big">${it.sets} × ${it.reps}${isSec ? '<span style="font-size:28px"> s</span>' : ""}</div>
    ${c.side ? '<p class="small muted" style="margin-top:-8px">de chaque côté</p>' : ""}
    <div class="dots">${Array.from({ length: it.sets }, (_, i) => `<i class="${i < it.setsDone ? "on" : ""}"></i>`).join("")}</div>
    ${it.setsDone < it.sets ? (isSec
      ? `<button class="btn primary" data-a="hold">Lancer la série ${it.setsDone + 1} · ${it.reps} s${c.side ? " ×2" : ""}</button>`
      : `<button class="btn primary" data-a="setdone">Série ${it.setsDone + 1} terminée ✓</button>`)
      : `<button class="btn primary" data-a="ask">Valider l'exercice</button>`}
    <button class="btn ghost" style="margin-top:8px" data-a="ask">Terminer l'exercice maintenant</button>
  </div>
  <div class="card exlist">${cur.items.map((x, i) => { const cc = CATALOG[x.ex]; const st = x.status === "full" ? '<span class="pill good">✓</span>' : x.status === "partial" ? '<span class="pill warn">partiel</span>' : x.status === "skip" ? '<span class="pill bad">non fait</span>' : ""; return `<div class="it" style="${i === cur.idx ? "font-weight:700" : i < cur.idx ? "opacity:.6" : ""}"><div class="num">${i + 1}</div><div>${cc.variants[x.v].n}</div><div class="tgt">${st || tgtLabel(x.ex, x)}</div></div>`; }).join("")}</div>`;
}
let TIMER = null;
function startTimer(sec, title, sub, done) {
  clearInterval(TIMER); const end = Date.now() + sec * 1000;
  openModal(`<p class="center muted" style="margin:0">${title}</p><div class="timer" id="tm">${fmtDur(sec)}</div><p class="center small muted">${sub || ""}</p><div class="grid2"><button class="btn ghost" data-a="tm-add">+15 s</button><button class="btn" data-a="tm-skip">Passer</button></div>`);
  TIMER = { end, done };
  const tick = () => { if (!TIMER) return; const left = Math.max(0, Math.round((TIMER.end - Date.now()) / 1000)); const el = document.getElementById("tm"); if (el) el.textContent = fmtDur(left);
    if (left <= 3 && left > 0 && TIMER.lastBeep !== left) { TIMER.lastBeep = left; beep(660, .12); }
    if (left <= 0) finishTimer(true); };
  TIMER.iv = setInterval(tick, 250); tick();
}
function finishTimer(natural) { if (!TIMER) return; clearInterval(TIMER.iv); const d = TIMER.done; TIMER = null; closeModal(); if (natural) beep(990, .35); d && d(); }
function afterSet() {
  const it = S.current.items[S.current.idx]; it.setsDone++; save(); render();
  if (it.setsDone < it.sets) startTimer(S.settings.rest, "Repos", "Prochaine série : " + (it.setsDone + 1) + " / " + it.sets, render);
  else askResult();
}
function askResult() {
  const it = S.current.items[S.current.idx], c = CATALOG[it.ex];
  openModal(`<div class="hero" style="margin-bottom:12px">${mascot("calm")}<div class="bubble">As-tu complété <b>${c.variants[it.v].n}</b> (${tgtLabel(it.ex, it)}) ?</div></div>
  <button class="btn good" data-a="res" data-v="full">Totalement</button>
  <button class="btn" style="margin-top:8px;background:var(--warn-soft);color:var(--warn)" data-a="res-partial">Partiellement</button>
  <button class="btn ghost" style="margin-top:8px" data-a="res" data-v="skip">Pas fait</button>`);
}
function askPartial() {
  const it = S.current.items[S.current.idx], c = CATALOG[it.ex]; const tot = totalOf(it.ex, it);
  UI.partial = Math.max(1, Math.round(tot * 0.6 / (c.unit === "sec" ? 5 : 1)) * (c.unit === "sec" ? 5 : 1));
  openModal(`<h3 class="center">Combien as-tu fait au total ?</h3><p class="center small muted">Cible : ${tot} ${c.unit === "sec" ? "secondes" : "répétitions"}${c.side ? " (deux côtés)" : ""}</p>
  <div class="stepper"><button data-a="pt" data-v="-1">−</button><div class="v" id="pv">${UI.partial}</div><button data-a="pt" data-v="1">+</button></div>
  <button class="btn primary" data-a="res" data-v="partial">Valider</button>`);
}
function applyResult(status) {
  const cur = S.current, it = cur.items[cur.idx], c = CATALOG[it.ex]; const tot = totalOf(it.ex, it);
  it.status = status; it.done = status === "full" ? tot : status === "partial" ? Math.min(UI.partial, tot) : 0;
  it.note = progress(it.ex, status); it.next = tgtLabel(it.ex);
  if (status === "full") addXP(10); else if (status === "partial") addXP(5);
  closeModal();
  if (status === "full") toast(pick(["Bien joué !", "Propre.", "Validé ✓", "Encore un !", "Solide."]));
  else if (status === "partial") toast("C'est noté. Chaque répétition compte.");
  else toast("Pas grave, je le replace à la prochaine séance.");
  cur.idx++;
  if (cur.idx >= cur.items.length) finishSession(); else { save(); render(); window.scrollTo(0, 0); }
}
function finishSession() {
  const cur = S.current; const dur = Math.round((Date.now() - cur.startedAt) / 1000);
  const anyDone = cur.items.some(i => i.status !== "skip");
  const perfect = cur.items.every(i => i.status === "full");
  let xp = 0;
  if (anyDone) {
    const firstEver = S.sessions.length === 0;
    const prevLast = S.sessions[S.sessions.length - 1];
    const sess = { id: Date.now().toString(36), date: today(), type: cur.type, dur, items: cur.items.map(i => ({ ex: i.ex, v: i.v, sets: i.sets, reps: i.reps, status: i.status, done: i.done })) };
    S.sessions.push(sess); xp = 20 + (perfect ? 15 : 0); addXP(xp);
    if (firstEver) badge("first"); if (perfect) badge("perfect");
    const n = S.sessions.length; if (n >= 10) badge("s10"); if (n >= 25) badge("s25"); if (n >= 50) badge("s50"); if (n >= 100) badge("s100");
    if (prevLast && diffDays(prevLast.date, sess.date) > 10) badge("comeback");
    const f = flame(); if (f >= 7) badge("flame7"); if (f >= 30) badge("flame30");
    checkWeekReward(); UI.comeback = null;
  }
  cur.finished = true; cur.dur = dur; cur.xp = xp + cur.items.reduce((a, i) => a + (i.status === "full" ? 10 : i.status === "partial" ? 5 : 0), 0);
  save(); render(); window.scrollTo(0, 0); if (anyDone) { confetti(); beep(1200, .3); }
}
function vSummary() {
  const cur = S.current; const done = cur.items.filter(i => i.status !== "skip");
  const reps = cur.items.filter(i => CATALOG[i.ex].unit === "reps").reduce((a, i) => a + i.done, 0);
  const secs = cur.items.filter(i => CATALOG[i.ex].unit === "sec").reduce((a, i) => a + i.done, 0);
  const prev = S.sessions.filter(s => s.type === cur.type).slice(-2, -1)[0];
  const prevReps = prev ? prev.items.filter(i => CATALOG[i.ex].unit === "reps").reduce((a, i) => a + i.done, 0) : null;
  const delta = prevReps != null && done.length ? reps - prevReps : null;
  const mood = !done.length ? "sad" : "wow";
  const txt = !done.length ? "Rien de validé cette fois. Les exercices sont reprogrammés, on s'y remet à la prochaine." :
    cur.items.every(i => i.status === "full") ? "Séance parfaite. Les cibles montent d'un cran." : "Séance enregistrée. La régularité compte plus que la perfection.";
  return `<div class="hero" style="margin:14px 0">${mascot(mood)}<div class="bubble">${txt}</div></div>
  <div class="card sess"><h3>Séance ${cur.type} · ${PLAN[cur.type].name}</h3><p class="tiny muted">${fmtDL(today())}</p>
  <div class="grid3" style="margin-top:10px"><div class="stat"><div class="v">${fmtDur(cur.dur)}</div><div class="l">durée</div></div><div class="stat"><div class="v">${reps}</div><div class="l">répétitions</div></div><div class="stat"><div class="v">+${cur.xp}</div><div class="l">XP</div></div></div>
  ${secs ? `<p class="small muted" style="margin-top:8px">${secs} s de gainage et de cardio</p>` : ""}
  ${delta != null ? `<p class="small" style="margin-top:6px"><b style="color:${delta >= 0 ? "var(--good)" : "var(--ink-2)"}">${delta >= 0 ? "+" : ""}${delta} répétitions</b> <span class="muted">vs la dernière séance ${cur.type}</span></p>` : ""}</div>
  <h2>Prochaine fois</h2><div class="card exlist">${cur.items.map(i => { const c = CATALOG[i.ex]; const st = i.status === "full" ? '<span class="pill good">✓</span>' : i.status === "partial" ? '<span class="pill warn">' + i.done + "</span>" : '<span class="pill bad">✕</span>'; return `<div class="it">${st}<div><b>${c.variants[S.exercises[i.ex].v].n}</b><div class="tiny muted">${i.note || ""}</div></div><div class="tgt">${i.next}</div></div>`; }).join("")}</div>
  <button class="btn primary" data-a="close-summary">Terminer</button>`;
}

/* ---------- Progrès ---------- */
function vProgress() {
  const t = today(), n = S.sessions.length;
  const last28 = S.sessions.filter(s => diffDays(s.date, t) < 28).length;
  const reg = Math.round(Math.min(1, last28 / (goal() * 4)) * 100);
  const ws0 = weekStart(t);
  const weeks = Array.from({ length: 12 }, (_, i) => addDays(ws0, -7 * (11 - i)));
  const bars = weeks.map(w => { const v = sessionsInWeek(w); return { v, lab: fmtD(w).replace(/\.$/, "").split(" ")[0], hi: v >= goal(), tip: `Semaine du ${fmtD(w)} : <b>${v}</b> séance${v > 1 ? "s" : ""}` }; });
  // Calendrier de régularité
  const sessD = new Set(S.sessions.map(s => s.date)), wD = new Set(S.weights.map(w => w.date)), fD = new Set(S.freezeDays);
  let heat = "";
  for (let d = 0; d < 7; d++) {
    heat += `<span>${["L", "M", "M", "J", "V", "S", "D"][d]}</span>`;
    weeks.forEach(w => { const k = addDays(w, d); const cls = k > t ? "fut" : sessD.has(k) ? "s" : wD.has(k) ? "w" : fD.has(k) ? "f" : ""; heat += `<i class="${cls}" title="${fmtD(k)}"></i>`; });
  }
  // Progression par exercice
  const ex = UI.exSel, c = CATALOG[ex];
  const pts = S.sessions.flatMap(s => s.items.filter(i => i.ex === ex && i.status !== "skip").map(i => ({ t: s.date, v: i.done, tip: `${fmtD(s.date)} · <b>${i.done}${c.unit === "sec" ? " s" : ""}</b> · ${c.variants[i.v].n}` })));
  const hist = [...S.sessions].reverse().slice(0, 30);
  return `<h1>Progrès</h1>
  <div class="grid3"><div class="stat"><div class="v">${n}</div><div class="l">séances</div></div><div class="stat"><div class="v">${reg} %</div><div class="l">régularité 4 sem.</div></div><div class="stat"><div class="v">${weekStreak()}</div><div class="l">sem. d'affilée</div></div></div>
  <h2>Séances par semaine</h2><div class="card">${barChart("ch-weeks", bars, { goal: goal(), min: goal(), label: "Séances par semaine sur 12 semaines" })}
  <div class="legend"><span><i style="background:var(--accent)"></i>objectif atteint</span><span><i style="background:var(--data)"></i>en dessous</span><span><i class="ln" style="background:var(--accent);opacity:.7"></i>objectif (${goal()}/sem.)</span></div></div>
  <h2>Calendrier</h2><div class="card"><div class="heat">${heat}</div>
  <div class="legend"><span><i style="background:var(--accent)"></i>séance</span><span><i style="background:var(--accent-soft)"></i>pesée seule</span><span><i style="background:var(--data-2)"></i>gel</span></div></div>
  <h2>Par exercice</h2><div class="card"><div class="row wrap" style="gap:6px;margin-bottom:10px">${Object.keys(CATALOG).map(k => `<button class="pill ${k === ex ? "accent" : ""}" style="border:0;padding:6px 10px" data-a="exsel" data-v="${k}">${CATALOG[k].name}</button>`).join("")}</div>
  <p class="small">Cible actuelle : <b>${c.variants[S.exercises[ex].v].n} · ${tgtLabel(ex)}</b></p>
  ${pts.length ? lineChart("ch-ex", { series: [{ pts, color: "var(--accent)", dots: true }], label: "Volume réalisé par séance", yMin: 0, yFmt: v => v }) : '<p class="muted small">Pas encore de séance avec cet exercice.</p>'}
  <p class="tiny muted" style="margin-top:4px">Volume réalisé par séance (${c.unit === "sec" ? "secondes" : "répétitions"}${c.side ? ", deux côtés" : ""}).</p></div>
  <h2>Historique</h2>${hist.length ? hist.map(s => {
    const reps = s.items.filter(i => CATALOG[i.ex].unit === "reps").reduce((a, i) => a + i.done, 0);
    const ok = s.items.filter(i => i.status === "full").length;
    return `<div class="card sess"><div class="row between"><h3>Séance ${s.type} · ${PLAN[s.type].name}</h3></div><p class="tiny muted">${fmtDL(s.date)}</p>
    <div class="st"><div><b>${fmtDur(s.dur)}</b><span>durée</span></div><div><b>${reps}</b><span>répétitions</span></div><div><b>${ok}/${s.items.length}</b><span>complétés</span></div></div>
    <div class="row wrap" style="gap:4px">${s.items.map(i => `<span class="pill ${i.status === "full" ? "good" : i.status === "partial" ? "warn" : "bad"}">${CATALOG[i.ex].name}</span>`).join("")}</div></div>`; }).join("") : '<p class="muted">Ta première séance apparaîtra ici.</p>'}`;
}

/* ---------- Corps : poids, IMC, photos ---------- */
function vBody() {
  const ws = sortedW(), lw = lastW(), t = today();
  const days = { "1M": 30, "3M": 91, "6M": 182, "1A": 365, "Tout": 99999 }[UI.range];
  const from = addDays(t, -days); const vis = ws.filter(w => w.date >= from); const tr = trend(ws).filter(w => w.date >= from);
  const b = lw ? bmi(lw.kg) : null; const z = b ? bmiZone(b) : null;
  const trAll = trend(ws); const trNow = trAll.length ? trAll[trAll.length - 1].kg : null;
  const ref = k => { const p = trAll.filter(x => x.date <= addDays(t, -k)); return p.length ? p[p.length - 1].kg : null; };
  const d7 = trNow != null && ref(7) != null ? trNow - ref(7) : null, d30 = trNow != null && ref(30) != null ? trNow - ref(30) : null;
  const sgn = v => v == null ? "–" : (v > 0 ? "+" : "") + fmt1(v) + " kg";
  const h = S.profile.height;
  const wChart = lineChart("ch-w", { series: [
      { pts: vis.map(w => ({ t: w.date, v: w.kg })), color: "var(--data-2)", dots: true, w: 0, op: .9 },
      { pts: tr.map(w => ({ t: w.date, v: w.kg, tip: `${fmt1(w.kg)} kg (tendance) · ${fmtD(w.date)}${ws.find(x => x.date === w.date) ? " · pesée " + fmt1(ws.find(x => x.date === w.date).kg) : ""}` })), color: "var(--data)", w: 2.5 }],
    tipSeries: 1, yFmt: v => Math.round(v), label: "Courbe de poids" });
  const bChart = h ? lineChart("ch-b", { series: [{ pts: tr.map(w => ({ t: w.date, v: bmi(w.kg), tip: `IMC ${fmt1(bmi(w.kg))} · ${fmtD(w.date)}` })), color: "var(--data)", w: 2.5, dots: tr.length < 20 }],
    bands: [{ from: 0, to: 18.5, label: "insuffisance" }, { from: 18.5, to: 25, label: "normal" }, { from: 25, to: 30, label: "surpoids" }, { from: 30, to: 60, label: "obésité" }],
    yFmt: v => Math.round(v), h: 160, label: "Courbe d'IMC" }) : "";
  return `<h1>Corps</h1>
  <div class="card"><div class="row"><input id="b-w" type="text" inputmode="decimal" step="0.1" value="${lw ? fmt1(lw.kg) : ""}" placeholder="kg" style="flex:2"><input id="b-d" type="date" value="${t}" max="${t}" style="flex:2"><button class="btn primary small" style="padding:13px 16px" data-a="weigh-body">Ajouter</button></div></div>
  <div class="grid2"><div class="stat"><div class="v">${lw ? fmt1(lw.kg) : "–"}<span style="font-size:14px"> kg</span></div><div class="l">${lw ? "pesée du " + fmtD(lw.date) : "aucune pesée"}</div></div>
  <div class="stat"><div class="v">${b ? fmt1(b) : "–"}</div><div class="l">IMC ${z ? `<span class="pill ${z.c}">${z.t}</span>` : ""}</div></div>
  <div class="stat"><div class="v" style="font-size:18px">${sgn(d7)}</div><div class="l">tendance 7 jours</div></div><div class="stat"><div class="v" style="font-size:18px">${sgn(d30)}</div><div class="l">tendance 30 jours</div></div></div>
  <div class="seg" style="margin:16px 0 4px">${["1M", "3M", "6M", "1A", "Tout"].map(r => `<button data-a="range" data-v="${r}" class="${UI.range === r ? "on" : ""}">${r}</button>`).join("")}</div>
  <h2>Poids</h2><div class="card">${wChart}<div class="legend"><span><i style="background:var(--data-2);border-radius:50%"></i>pesée</span><span><i class="ln" style="background:var(--data)"></i>tendance (moyenne 7 jours)</span></div></div>
  <h2>IMC</h2><div class="card">${h ? bChart + '<p class="tiny muted" style="margin-top:6px">IMC = poids / taille². Repères OMS : 18,5 · 25 · 30. Calculé sur la tendance.</p>' : '<p class="small muted">Renseigne ta taille dans Réglages.</p>'}</div>
  ${ws.length ? `<h2>Dernières pesées</h2><div class="card exlist">${[...ws].reverse().slice(0, 8).map(w => `<div class="it"><div>${fmtDL(w.date)}</div><div class="tgt">${fmt1(w.kg)} kg</div><button class="btn small ghost" data-a="wdel" data-v="${w.date}" aria-label="Supprimer">✕</button></div>`).join("")}</div>` : ""}
  <h2>Photos</h2><div class="card"><p class="small muted">Une photo toutes les 2 semaines suffit. Sélectionne deux photos pour les comparer.</p>
  <button class="btn ghost" data-a="photo-pick" style="margin-bottom:12px">Ajouter une photo</button>
  <div id="cmp"></div><div class="photos" id="photos">${[...S.photos].reverse().map(p => `<div class="ph ${UI.photoSel.includes(p.id) ? "sel" : ""}" data-a="psel" data-v="${p.id}"><img data-pid="${p.id}" alt=""><span>${fmtD(p.date)}</span></div>`).join("")}</div>
  ${UI.photoSel.length === 1 ? `<button class="btn small ghost" style="margin-top:10px" data-a="pdel">Supprimer la photo sélectionnée</button>` : ""}</div>
  <input type="file" id="photo-in" accept="image/*" hidden>`;
}
const URLS = {};
async function loadPhotos() {
  try {
    for (const img of document.querySelectorAll("img[data-pid]")) {
      const id = img.dataset.pid;
      if (!URLS[id]) { const r = await photoGet(id); if (r) URLS[id] = URL.createObjectURL(r.blob); }
      if (URLS[id]) img.src = URLS[id];
    }
    const cmp = document.getElementById("cmp");
    if (cmp && UI.photoSel.length === 2) {
      const ps = UI.photoSel.map(id => S.photos.find(p => p.id === id)).sort((a, b) => a.date < b.date ? -1 : 1);
      cmp.innerHTML = `<div class="cmp" style="margin-bottom:12px">${ps.map(p => { const w = wAt(p.date); return `<div><img src="${URLS[p.id] || ""}" alt=""><p class="small center" style="margin-top:4px"><b>${fmtD(p.date)}</b>${w ? " · " + fmt1(w.kg) + " kg" : ""}</p></div>`; }).join("")}</div>
      <p class="small center muted">${diffDays(ps[0].date, ps[1].date)} jours d'écart</p>`;
    }
  } catch (e) { }
}
async function addPhoto(file) {
  try {
    const url = URL.createObjectURL(file); const img = new Image(); img.src = url; await img.decode();
    const k = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement("canvas"); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
    const blob = await new Promise(r => cv.toBlob(r, "image/jpeg", 0.82));
    const id = "p" + Date.now().toString(36); await photoPut({ id, date: today(), blob });
    S.photos.push({ id, date: today() }); addXP(15); badge("photo"); save();
    toast("Photo enregistrée"); render();
  } catch (e) { toast("Impossible d'enregistrer la photo"); }
}

/* ---------- Réglages ---------- */
function vSettings() {
  const p = S.profile;
  return `<h1>Réglages</h1>
  <div class="card"><h3>Profil</h3><div class="grid2"><div><label class="f">Prénom</label><input id="s-name" value="${esc(p.name || "")}"></div><div><label class="f">Taille (cm)</label><input id="s-h" type="number" inputmode="numeric" value="${p.height || ""}"></div></div>
  <label class="f">Jours d'entraînement (objectif : ${p.days.length} séances / semaine)</label>
  <div class="toggle7">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button data-a="s-day" data-v="${d}" class="${p.days.includes(d) ? "on" : ""}">${DAYLETTERS[d]}</button>`).join("")}</div>
  <label class="f">Repos entre séries</label><div class="seg">${[30, 45, 60, 90].map(r => `<button data-a="s-rest" data-v="${r}" class="${S.settings.rest === r ? "on" : ""}">${r} s</button>`).join("")}</div>
  <button class="btn primary" style="margin-top:14px" data-a="s-save">Enregistrer</button></div>
  <h2>Cibles des exercices</h2><div class="card exlist"><p class="small muted">Elles évoluent seules après chaque séance. Ajuste si une cible ne te correspond pas.</p>
  ${Object.entries(CATALOG).map(([id, c]) => { const e = S.exercises[id]; return `<div class="it" style="flex-wrap:wrap"><div style="flex:1;min-width:150px"><b>${c.variants[e.v].n}</b><div class="tiny muted">${tgtLabel(id)}</div></div>
    <div class="adj"><button data-a="adj" data-v="${id}|v|-1" aria-label="Variante plus facile">◀</button><button data-a="adj" data-v="${id}|v|1" aria-label="Variante plus dure">▶</button><span style="width:6px"></span><button data-a="adj" data-v="${id}|r|-1">−</button><button data-a="adj" data-v="${id}|r|1">+</button></div></div>`; }).join("")}</div>
  <h2>Sauvegarde</h2><div class="card"><p class="small muted">Les données vivent uniquement sur ce téléphone. Exporte régulièrement un fichier de sauvegarde (Fichiers, iCloud Drive).</p>
  <div class="grid2"><button class="btn ghost" data-a="export" data-v="0">Exporter</button><button class="btn ghost" data-a="export" data-v="1">Exporter + photos</button></div>
  <button class="btn ghost" style="margin-top:8px" data-a="import">Importer une sauvegarde</button><input type="file" id="imp-in" accept="application/json,.json" hidden>
  <div class="hr"></div><button class="btn ghost" style="color:var(--bad)" data-a="reset">Tout effacer</button></div>
  <p class="tiny muted center">Galet · données locales · ${S.sessions.length} séances · ${S.weights.length} pesées · ${S.photos.length} photos</p>`;
}
const blobToData = b => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });
async function doExport(withPhotos) {
  const out = { app: "galet", exported: new Date().toISOString(), state: Object.assign({}, S, { current: null }) };
  if (withPhotos) { out.photos = []; for (const p of await photoAll()) out.photos.push({ id: p.id, date: p.date, data: await blobToData(p.blob) }); }
  const name = "galet-sauvegarde-" + today() + ".json";
  const file = new File([JSON.stringify(out)], name, { type: "application/json" });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return; } } catch (e) { if (e.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
async function doImport(file) {
  try {
    const d = JSON.parse(await file.text()); if (d.app !== "galet" || !d.state) throw 0;
    if (!confirm("Remplacer les données actuelles par cette sauvegarde ?")) return;
    S = Object.assign(blank(), d.state);
    if (d.photos) for (const p of d.photos) { const blob = await (await fetch(p.data)).blob(); await photoPut({ id: p.id, date: p.date, blob }); }
    save(); toast("Sauvegarde importée"); go("home");
  } catch (e) { toast("Fichier de sauvegarde invalide"); }
}

/* ---------- Événements ---------- */
document.addEventListener("click", async ev => {
  const el = ev.target.closest("[data-a]"); if (!el) return;
  const a = el.dataset.a, v = el.dataset.v;
  if (a === "modal-bg") { if (ev.target === el && !TIMER) closeModal(); return; }
  switch (a) {
    case "tab": UI.forceType = null; go(v); break;
    case "onb-level": keepOnb(); UI.onb.level = +v; render(); break;
    case "onb-day": { keepOnb(); const d = +v, s = UI.onb.days; UI.onb.days = s.includes(d) ? s.filter(x => x !== d) : [...s, d]; render(); break; }
    case "onb-go": {
      const h = parseFloat(document.getElementById("o-h").value), w = parseFloat(String(document.getElementById("o-w").value).replace(",", "."));
      if (!(h > 100 && h < 230)) return toast("Indique ta taille en centimètres");
      if (!UI.onb.days.length) return toast("Choisis au moins un jour");
      S.profile = { name: document.getElementById("o-name").value.trim(), height: h, days: UI.onb.days.sort(), level: UI.onb.level, start: today() };
      initExercises(UI.onb.level); if (w > 30 && w < 300) saveWeight(w); save();
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
      go("home"); break;
    }
    case "weigh-home": case "weigh-body": {
      const w = parseFloat(String(document.getElementById(a === "weigh-home" ? "h-w" : "b-w").value).replace(",", "."));
      if (!(w > 30 && w < 300)) return toast("Poids invalide");
      const d = a === "weigh-body" ? document.getElementById("b-d").value || today() : today();
      saveWeight(w, d > today() ? today() : d); toast(d === today() ? "Pesée enregistrée 🔥" : "Pesée ajoutée"); render(); break;
    }
    case "wdel": if (confirm("Supprimer la pesée du " + fmtD(v) + " ?")) { S.weights = S.weights.filter(w => w.date !== v); save(); render(); } break;
    case "range": UI.range = v; render(); break;
    case "exsel": UI.exSel = v; render(); break;
    case "stype": UI.forceType = v; render(); break;
    case "start": {
      beep(1, .01); // débloque l'audio sur iOS
      S.current = { type: v, startedAt: Date.now(), idx: 0, items: buildSession(v) }; UI.forceType = null; save(); render(); window.scrollTo(0, 0); break;
    }
    case "setdone": afterSet(); break;
    case "hold": {
      const it = S.current.items[S.current.idx], c = CATALOG[it.ex];
      if (c.side) startTimer(it.reps, "Côté gauche", "Série " + (it.setsDone + 1) + " / " + it.sets, () => setTimeout(() => startTimer(it.reps, "Côté droit", "Série " + (it.setsDone + 1) + " / " + it.sets, afterSet), 400));
      else startTimer(it.reps, "Tiens bon", "Série " + (it.setsDone + 1) + " / " + it.sets, afterSet);
      break;
    }
    case "tm-add": if (TIMER) TIMER.end += 15000; break;
    case "tm-skip": finishTimer(false); break;
    case "ask": askResult(); break;
    case "res-partial": askPartial(); break;
    case "pt": { const it = S.current.items[S.current.idx], c = CATALOG[it.ex]; const st = c.unit === "sec" ? 5 : 1; UI.partial = Math.max(0, Math.min(totalOf(it.ex, it), UI.partial + st * +v)); document.getElementById("pv").textContent = UI.partial; break; }
    case "res": applyResult(v); break;
    case "abort": if (confirm("Quitter la séance ? Les exercices non faits seront reprogrammés.")) { S.current.items.slice(S.current.idx).forEach(it => { it.status = "skip"; it.done = 0; it.note = progress(it.ex, "skip"); it.next = tgtLabel(it.ex); }); S.current.idx = S.current.items.length; finishSession(); } break;
    case "close-summary": S.current = null; save(); go("home"); break;
    case "photo-pick": document.getElementById("photo-in").click(); break;
    case "psel": { const s = UI.photoSel; UI.photoSel = s.includes(v) ? s.filter(x => x !== v) : [...s, v].slice(-2); render(); break; }
    case "pdel": if (confirm("Supprimer cette photo ?")) { const id = UI.photoSel[0]; await photoDel(id); S.photos = S.photos.filter(p => p.id !== id); UI.photoSel = []; save(); render(); } break;
    case "s-day": { const d = +v, s = S.profile.days; const n = s.includes(d) ? s.filter(x => x !== d) : [...s, d]; if (n.length) { S.profile.days = n.sort(); save(); render(); } break; }
    case "s-rest": S.settings.rest = +v; save(); render(); break;
    case "s-save": { const h = parseFloat(document.getElementById("s-h").value); if (h > 100 && h < 230) S.profile.height = h; S.profile.name = document.getElementById("s-name").value.trim(); save(); toast("Enregistré"); render(); break; }
    case "adj": {
      const [id, k, d] = v.split("|"); const c = CATALOG[id], e = S.exercises[id];
      if (k === "v") { e.v = Math.max(0, Math.min(c.variants.length - 1, e.v + +d)); e.reps = c.min; }
      else e.reps = Math.max(c.unit === "sec" ? 10 : 3, Math.min(c.max, e.reps + c.step * +d));
      save(); render(); break;
    }
    case "export": doExport(v === "1"); break;
    case "import": document.getElementById("imp-in").click(); break;
    case "reset": if (confirm("Effacer toutes les données (séances, pesées, photos) ?")) { const ps = await photoAll().catch(() => []); for (const p of ps) await photoDel(p.id); S = blank(); save(); go("onboarding"); } break;
  }
});
document.addEventListener("change", ev => {
  if (ev.target.id === "photo-in" && ev.target.files[0]) addPhoto(ev.target.files[0]);
  if (ev.target.id === "imp-in" && ev.target.files[0]) doImport(ev.target.files[0]);
});

/* ---------- Démarrage ---------- */
load();
if (S.profile) { applyFreezes(); UI.comeback = checkComeback(); }
render();
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.profile && S.lastCheck !== today()) { applyFreezes(); render(); } });
