/* Galet — schémas animés des mouvements + lien démo YouTube.
   Chaque variante a deux poses (départ A, arrivée B). Les membres sont résolus par cinématique inverse
   (épaule→main, hanche→pied), le personnage garde des proportions fixes. Repère : sol y=120, profil tourné vers la droite. */
"use strict";

const FIG = { T: 36, NK: 13, UA: 18, FA: 17, TH: 22, SH: 22 };
const G = 120;

/* Accessoires */
const chair = (x, seat, back) => ({ t: "chair", x, seat: seat || 88, back: back || 0 });

/* hip, tr (angle du buste en degrés, 0 = droite, -90 = haut), ha/ft = cibles main/pied, eb/kb = sens du coude/genou,
   ha2/ft2 = membres côté opposé (sinon décalage léger), fd = direction du regard */
const MOVES = {
  "push:0": { props: [chair(104, 88, -1)], A: { hip: [61, 89], tr: -45, ha: [111, 88], ft: [30, 120], eb: -1, kb: 1 }, B: { hip: [67, 96], tr: -33, ha: [111, 88], ft: [30, 120], eb: 1, kb: 1 } },
  "push:1": { A: { hip: [78, 106], tr: -35, ha: [108, 120], ft: [38, 110], eb: -1, kb: 1 }, B: { hip: [80, 112], tr: -18, ha: [108, 120], ft: [38, 110], eb: -1, kb: 1 } },
  "push:2": { A: { hip: [70, 100], tr: -22, ha: [106, 120], ft: [28, 120], eb: -1, kb: 1 }, B: { hip: [72, 109], tr: -10, ha: [106, 120], ft: [28, 120], eb: -1, kb: 1 } },
  "push:3": { props: [chair(10, 88)], A: { hip: [74, 88], tr: 0, ha: [112, 120], ft: [30, 88], eb: -1, kb: 1 }, B: { hip: [73, 97], tr: 12, ha: [112, 120], ft: [30, 88], eb: 1, kb: 1 } },

  "dips:0": { props: [chair(40, 96)], A: { hip: [80, 96], tr: -90, ha: [74, 96], ft: [102, 120], eb: -1, kb: 1 }, B: { hip: [80, 114], tr: -90, ha: [74, 96], ft: [102, 120], eb: -1, kb: 1 } },
  "dips:1": { props: [chair(40, 96)], A: { hip: [80, 96], tr: -90, ha: [74, 96], ft: [121, 120], eb: -1, kb: 1 }, B: { hip: [80, 112], tr: -90, ha: [74, 96], ft: [121, 120], eb: -1, kb: 1 } },
  "dips:2": { props: [chair(40, 96), chair(118, 96)], A: { hip: [80, 96], tr: -90, ha: [74, 96], ft: [126, 96], eb: -1, kb: 1 }, B: { hip: [80, 112], tr: -90, ha: [74, 96], ft: [126, 96], eb: -1, kb: 1 } },

  "superman:0": { A: { hip: [80, 114], tr: 0, ha: [158, 117], ft: [38, 117], eb: 1, kb: -1, fd: 60 }, B: { hip: [80, 113], tr: -8, ha: [154, 98], ft: [40, 101], eb: 1, kb: -1, fd: 20 } },
  "superman:1": { hold: 1.6, A: { hip: [80, 114], tr: 0, ha: [158, 117], ft: [38, 117], eb: 1, kb: -1, fd: 60 }, B: { hip: [80, 113], tr: -8, ha: [154, 98], ft: [40, 101], eb: 1, kb: -1, fd: 20 } },
  "superman:2": { A: { hip: [80, 113], tr: -8, ha: [152, 100], ft: [40, 102], eb: 1, kb: -1, fd: 20 }, B: { hip: [80, 113], tr: -8, ha: [84, 104], ft: [40, 102], eb: 1, kb: -1, fd: 20 } },

  "plank:0": { iso: true, A: { hip: [75, 112], tr: -16, ha: [126, 120], ft: [36, 108], eb: -1, kb: 1 }, B: { hip: [75, 111], tr: -16, ha: [126, 120], ft: [36, 108], eb: -1, kb: 1 } },
  "plank:1": { iso: true, A: { hip: [70, 106], tr: -6, ha: [122, 120], ft: [28, 120], eb: -1, kb: 1 }, B: { hip: [70, 105], tr: -6, ha: [122, 120], ft: [28, 120], eb: -1, kb: 1 } },
  "plank:2": { A: { hip: [70, 106], tr: -6, ha: [122, 120], ha2: [122, 120], ft: [28, 120], eb: -1, eb2: -1, kb: 1 }, B: { hip: [70, 106], tr: -6, ha: [146, 98], ha2: [122, 120], ft: [28, 120], eb: 1, eb2: -1, kb: 1 } },

  "side:0": { iso: true, A: { hip: [74, 110], tr: -14, ha: [120, 120], ha2: [110, 62], ft: [36, 106], eb: -1, eb2: 1, kb: 1, fd: -60 }, B: { hip: [74, 108], tr: -16, ha: [120, 120], ha2: [110, 60], ft: [36, 106], eb: -1, eb2: 1, kb: 1, fd: -60 } },
  "side:1": { iso: true, A: { hip: [70, 106], tr: -6, ha: [118, 120], ha2: [106, 66], ft: [27, 120], eb: -1, eb2: 1, kb: 1, fd: -60 }, B: { hip: [70, 104], tr: -8, ha: [118, 120], ha2: [106, 64], ft: [27, 120], eb: -1, eb2: 1, kb: 1, fd: -60 } },

  "squat:0": { A: { hip: [100, 77], tr: -90, ha: [107, 75], ft: [102, 120], eb: -1, kb: 1 }, B: { hip: [86, 101], tr: -62, ha: [134, 70], ft: [102, 120], eb: 1, kb: 1 } },
  "squat:1": { hold: 1.8, A: { hip: [100, 77], tr: -90, ha: [107, 75], ft: [102, 120], eb: -1, kb: 1 }, B: { hip: [86, 101], tr: -62, ha: [134, 70], ft: [102, 120], eb: 1, kb: 1 } },
  "squat:2": { A: { hip: [86, 101], tr: -62, ha: [120, 100], ft: [102, 120], eb: -1, kb: 1 }, B: { hip: [100, 62], tr: -90, ha: [116, 0], ft: [101, 106], eb: -1, kb: 1 } },

  "lunge:0": { A: { hip: [100, 77], tr: -90, ha: [102, 76], ft: [104, 120], ft2: [98, 120], eb: -1, kb: 1, kb2: 1 }, B: { hip: [96, 98], tr: -90, ha: [98, 97], ft: [118, 120], ft2: [58, 117], eb: -1, kb: 1, kb2: 1 } },
  "lunge:1": { A: { hip: [88, 77], tr: -90, ha: [90, 76], ft: [92, 120], ft2: [86, 120], eb: -1, kb: 1, kb2: 1 }, B: { hip: [104, 98], tr: -90, ha: [106, 97], ft: [126, 120], ft2: [66, 117], eb: -1, kb: 1, kb2: 1 } },
  "lunge:2": { props: [chair(34, 88)], A: { hip: [92, 80], tr: -90, ha: [94, 79], ft: [112, 120], ft2: [52, 88], eb: -1, kb: 1, kb2: 1 }, B: { hip: [92, 100], tr: -86, ha: [96, 99], ft: [112, 120], ft2: [52, 88], eb: -1, kb: 1, kb2: 1 } },

  "glute:0": { A: { hip: [84, 115], tr: 180, ha: [80, 119], ft: [118, 120], eb: 1, kb: 1, fd: -90 }, B: { hip: [90, 94], tr: 152, ha: [82, 119], ft: [118, 120], eb: 1, kb: 1, fd: -90 } },
  "glute:1": { A: { hip: [84, 115], tr: 180, ha: [80, 119], ft: [118, 120], ft2: [126, 100], eb: 1, kb: 1, kb2: 1, fd: -90 }, B: { hip: [90, 94], tr: 152, ha: [82, 119], ft: [118, 120], ft2: [132, 72], eb: 1, kb: 1, kb2: 1, fd: -90 } },

  "climber:0": { props: [chair(104, 88, -1)], A: { hip: [61, 89], tr: -45, ha: [111, 88], ft: [30, 120], ft2: [30, 120], eb: -1, kb: 1, kb2: 1 }, B: { hip: [63, 88], tr: -45, ha: [111, 88], ft: [74, 116], ft2: [30, 120], eb: -1, kb: 1, kb2: 1 } },
  "climber:1": { A: { hip: [70, 100], tr: -22, ha: [106, 120], ft: [28, 120], ft2: [28, 120], eb: -1, kb: 1, kb2: 1 }, B: { hip: [72, 98], tr: -22, ha: [106, 120], ft: [82, 116], ft2: [28, 120], eb: -1, kb: 1, kb2: 1 } },

  "core:0": { A: { hip: [86, 115], tr: 180, ha: [78, 119], ft: [110, 94], eb: 1, kb: 1, fd: -90 }, B: { hip: [86, 111], tr: 186, ha: [78, 119], ft: [96, 80], eb: 1, kb: 1, fd: -90 } },
  "core:1": { A: { hip: [86, 115], tr: 180, ha: [78, 119], ft: [129, 108], eb: 1, kb: 1, fd: -90 }, B: { hip: [86, 115], tr: 180, ha: [78, 119], ft: [92, 71], eb: 1, kb: 1, fd: -90 } }
};

/* Requêtes YouTube (recherche : aucune vidéo précise n'est imposée) */
const YT = {
  "push:0": "pompes inclinées sur chaise technique débutant", "push:1": "pompes sur les genoux technique débutant",
  "push:2": "pompes technique correcte débutant", "push:3": "pompes déclinées pieds surélevés technique",
  "dips:0": "dips sur chaise jambes fléchies technique", "dips:1": "dips sur chaise jambes tendues technique", "dips:2": "dips pieds surélevés deux chaises",
  "superman:0": "exercice superman dos au sol technique", "superman:1": "superman gainage dos tenue isométrique", "superman:2": "exercice nageur swimmer au sol dos",
  "plank:0": "planche sur les genoux gainage débutant", "plank:1": "gainage planche technique correcte", "plank:2": "planche levée de bras alternée gainage",
  "side:0": "gainage latéral sur genou débutant", "side:1": "gainage latéral technique correcte",
  "squat:0": "squat poids du corps technique débutant", "squat:1": "pause squat poids du corps", "squat:2": "squat sauté technique réception",
  "lunge:0": "fente arrière technique débutant", "lunge:1": "fente avant technique", "lunge:2": "fente bulgare chaise technique",
  "glute:0": "pont fessier technique", "glute:1": "pont fessier une jambe technique",
  "climber:0": "mountain climbers inclinés sur chaise débutant", "climber:1": "mountain climbers technique",
  "core:0": "crunch inversé technique", "core:1": "relevé de jambes au sol technique"
};
const ytUrl = key => "https://www.youtube.com/results?search_query=" + encodeURIComponent(YT[key] || "exercice poids du corps technique");

/* ---------- Géométrie ---------- */
const rad = d => d * Math.PI / 180;
const dirv = d => [Math.cos(rad(d)), Math.sin(rad(d))];
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
function ik(root, target, a, b, s) {
  const dx = target[0] - root[0], dy = target[1] - root[1];
  let d = Math.hypot(dx, dy); const base = Math.atan2(dy, dx) * 180 / Math.PI;
  if (d > a + b - 3) return [add(root, dirv(base), a), add(root, dirv(base), a + b)];
  d = Math.max(Math.abs(a - b) + 0.5, d);
  const off = Math.acos((a * a + d * d - b * b) / (2 * a * d)) * 180 / Math.PI;
  const mid = add(root, dirv(base - s * off), a);
  const end = add(root, dirv(base), d);
  return [mid, end];
}
function solve(p) {
  const hip = p.hip, sh = add(hip, dirv(p.tr), FIG.T), head = add(sh, dirv(p.tr), FIG.NK);
  const arm = ik(sh, p.ha, FIG.UA, FIG.FA, p.eb || -1), leg = ik(hip, p.ft, FIG.TH, FIG.SH, p.kb || 1);
  const arm2 = p.ha2 ? ik(sh, p.ha2, FIG.UA, FIG.FA, p.eb2 || p.eb || -1) : null;
  const leg2 = p.ft2 ? ik(hip, p.ft2, FIG.TH, FIG.SH, p.kb2 || p.kb || 1) : null;
  return { hip, sh, head, arm, leg, arm2, leg2, fd: p.fd == null ? 0 : p.fd, tr: p.tr };
}
const lerp = (a, b, t) => a + (b - a) * t;
function mix(A, B, t) {
  const o = {};
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    const a = A[k], b = B[k] == null ? a : B[k], aa = a == null ? b : a;
    if (Array.isArray(aa)) o[k] = [lerp(aa[0], b[0], t), lerp(aa[1], b[1], t)];
    else if (typeof aa === "number") o[k] = lerp(aa, b, t);
    else o[k] = t < .5 ? aa : b;
  }
  return o;
}

/* ---------- Rendu SVG ---------- */
function propSVG(pr) {
  if (pr.t !== "chair") return "";
  const x = pr.x, s = pr.seat, w = 34, c = "var(--ink-3)";
  let g = `<rect x="${x}" y="${s}" width="${w}" height="4" rx="2" fill="${c}"/>` +
    `<line x1="${x + 3}" y1="${s + 4}" x2="${x + 3}" y2="${G}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` +
    `<line x1="${x + w - 3}" y1="${s + 4}" x2="${x + w - 3}" y2="${G}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  const bx = pr.back === -1 ? x + w - 2 : x + 2;
  g += `<line x1="${bx}" y1="${s}" x2="${bx}" y2="${s - 34}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  return g;
}
function limb(pts, col, w) {
  return `<polyline points="${pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function figureSVG(j) {
  const ink = "var(--ink)", far = "var(--ink-3)";
  const offs = [2.5, -2];
  const sh2 = [j.sh[0] + offs[0], j.sh[1] + offs[1]], hip2 = [j.hip[0] + offs[0], j.hip[1] + offs[1]];
  const armF = j.arm2 ? [j.sh, ...j.arm2] : [sh2, [j.arm[0][0] + offs[0], j.arm[0][1] + offs[1]], [j.arm[1][0] + offs[0], j.arm[1][1] + offs[1]]];
  const legF = j.leg2 ? [j.hip, ...j.leg2] : [hip2, [j.leg[0][0] + offs[0], j.leg[0][1] + offs[1]], [j.leg[1][0] + offs[0], j.leg[1][1] + offs[1]]];
  let g = limb(legF, far, 5) + limb(armF, far, 4.5);
  g += limb([j.head, j.sh, j.hip], ink, 6);
  g += limb([j.hip, ...j.leg], ink, 5.5) + limb([j.sh, ...j.arm], ink, 5);
  /* tête = galet */
  const [hx, hy] = j.head, e = dirv(j.fd), u = dirv(j.tr), n = [-u[1], u[0]];
  const ex = hx + e[0] * 2.5, ey = hy + e[1] * 2.5;
  g += `<ellipse cx="${hx}" cy="${hy}" rx="10" ry="9" transform="rotate(${(j.tr + 90).toFixed(1)} ${hx} ${hy})" fill="#CDBFAA" stroke="#9C8D77" stroke-width="2"/>`;
  g += `<circle cx="${(ex + n[0] * 3.2).toFixed(1)}" cy="${(ey + n[1] * 3.2).toFixed(1)}" r="1.9" fill="#3B342A"/><circle cx="${(ex - n[0] * 3.2).toFixed(1)}" cy="${(ey - n[1] * 3.2).toFixed(1)}" r="1.9" fill="#3B342A"/>`;
  return g;
}
function moveFrame(key, t) {
  const m = MOVES[key]; if (!m) return "";
  const p = mix(m.A, m.B, t);
  return `<line x1="0" y1="${G + 2}" x2="200" y2="${G + 2}" stroke="var(--line)" stroke-width="3" stroke-linecap="round"/>` +
    (m.props || []).map(propSVG).join("") + figureSVG(solve(p));
}

/* Boucle : départ (pause) → arrivée (pause) → retour */
let MV = null;
function playMove(el, key, label) {
  stopMove();
  const m = MOVES[key]; if (!m) return;
  const hold = (m.hold || 0.6) * 1000, mv = (m.iso ? 1.4 : 1.1) * 1000, cyc = 2 * hold + 2 * mv;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t0 = performance.now();
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const tick = now => {
    let c = (now - t0) % cyc, t, ph;
    if (c < hold) { t = 0; ph = 0; } else if (c < hold + mv) { t = ease((c - hold) / mv); ph = 1; }
    else if (c < 2 * hold + mv) { t = 1; ph = 2; } else { t = 1 - ease((c - 2 * hold - mv) / mv); ph = 3; }
    if (reduce) t = (Math.floor((now - t0) / 1500) % 2);
    el.innerHTML = moveFrame(key, t);
    if (label) label.textContent = m.iso ? "Tiens la position, respire" : (t < .5 ? "Départ" : "Arrivée");
    MV = requestAnimationFrame(tick);
  };
  MV = requestAnimationFrame(tick);
}
function stopMove() { if (MV) cancelAnimationFrame(MV); MV = null; }
