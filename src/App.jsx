import React, { useMemo, useState } from "react";

// ---------- theme ----------
const INK = "#22252A", PAPER = "#EBEAE6", CARD = "#FFFFFF", REBAR = "#C2372B",
  LINE = "#C9C7C1", MUTED = "#6E7076", HILITE = "#FBF7EF";

// ---------- block presets ----------
const BLOCK_PRESETS = {
  MH150PRO: { label: "MH-150PRO · 150 mm", width: 150, fillPerBlock: 9.4, perPallet: 72, wallKgM2: 350 },
  MH200PRO: { label: "MH-200PRO · 200 mm", width: 200, fillPerBlock: 14.4, perPallet: 60, wallKgM2: 450 },
  EMH300: { label: "EMH-300 · 300 mm", width: 300, fillPerBlock: 13.8, perPallet: 40, wallKgM2: 420 },
};
const BL = 0.6, BH = 0.2, KG = { 8: 0.395, 10: 0.617, 12: 0.888 };
const uid = () => Math.random().toString(36).slice(2, 8);
const fmt = (n, d = 1) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- i18n ----------
const T = {
  en: {
    share: "Copy share link", copied: "Link copied", total: "Total",
    walls: "Wall segments", assumptions: "Assumptions", elevation: "Elevation", schedule: "Material schedule",
    cutlist: "Cut list per course", footing: "Footing mode", addWall: "+ Add wall", example: "Load example",
    length: "Length (m)", courses: "Courses (à 200 mm)", type: "Block type", openings: "Openings (m²)",
    stepped: "Stepped", uniform: "Uniform", steps: "Steps (run m × courses)", addStep: "+ step",
    waste: "Waste (%)", fill: "Fill", blocks: "Blocks (incl. waste)", fillConc: "Fill concrete (to order)",
    hRebar: "Horizontal rebar", vRebar: "Vertical rebar", area: "Wall area",
    grossVol: "Gross wall volume (envelope)", weight: "Filled wall weight", rebarTotal: "Rebar total (H+V)",
    hEvery: "Horiz. bars every … course", hCount: "Bars per row", vcc: "Vertical cc (mm)", dia: "Ø",
    course: "Course", full: "full", cut: "cut", top: "top", print: "Print / PDF", obj: "3D export (OBJ) · Pro",
    ftLen: "Total run (m)", ftW: "Width (mm)", ftH: "Height (mm)", ftBars: "Longitudinal bars",
    ftDowels: "Dowels cc (mm)", ftDowelLen: "Dowel length (mm)", ftConc: "Concrete", ftSteel: "Rebar total",
    ftForm: "Form side area", perM: "per m", disclaimer:
      "Estimates for planning and ordering. Always build to your project's structural drawings. Pour lift limit 6 courses per manufacturer instructions.",
    lifts: "lifts", pallets: "pallets", orderNote: "Order fill as C30/37 · S3 · #8–16 · «harkkovalu»",
    volNote: "Gross volume = wall envelope (blocks + fill + shells). Fill concrete above is the quantity you order. Weight = filled wall.",
    segment: "Segment",
  },
  fi: {
    share: "Kopioi jakolinkki", copied: "Linkki kopioitu", total: "Yhteensä",
    walls: "Seinälohkot", assumptions: "Oletukset", elevation: "Julkisivu", schedule: "Materiaaliluettelo",
    cutlist: "Katkaisuluettelo kerroksittain", footing: "Anturalaskuri", addWall: "+ Lisää seinä", example: "Lataa esimerkki",
    length: "Pituus (m)", courses: "Kerroksia (à 200 mm)", type: "Harkkotyyppi", openings: "Aukot (m²)",
    stepped: "Porrastettu", uniform: "Tasainen", steps: "Portaat (jm × kerrokset)", addStep: "+ porras",
    waste: "Hukka (%)", fill: "Valu", blocks: "Harkot (sis. hukka)", fillConc: "Valubetoni (tilattava)",
    hRebar: "Vaakaraudoitus", vRebar: "Pystyraudoitus", area: "Seinäala",
    grossVol: "Seinän bruttotilavuus", weight: "Valetun seinän paino", rebarTotal: "Raudoitus yhteensä (V+P)",
    hEvery: "Vaakateräs joka … kerros", hCount: "Tankoja/rivi", vcc: "Pystyjako cc (mm)", dia: "Ø",
    course: "Kerros", full: "kokonaista", cut: "katkaisu", top: "yläreuna", print: "Tulosta / PDF", obj: "3D-vienti (OBJ) · Pro",
    ftLen: "Kokonaispituus (m)", ftW: "Leveys (mm)", ftH: "Korkeus (mm)", ftBars: "Pitkittäisteräkset",
    ftDowels: "Tartunnat cc (mm)", ftDowelLen: "Tartunnan pituus (mm)", ftConc: "Betoni", ftSteel: "Raudoitus yht.",
    ftForm: "Muotin sivupinta", perM: "per jm", disclaimer:
      "Arviot suunnittelun ja tilaamisen tueksi. Rakenna aina kohteen rakennesuunnitelmien mukaan. Valukorkeus enintään 6 kerrosta valmistajan työohjeen mukaan.",
    lifts: "valukertaa", pallets: "lavaa", orderNote: "Tilaa valu: C30/37 · S3 · #8–16 · «harkkovalu»",
    volNote: "Bruttotilavuus = seinän viemä tila. Valubetoni yllä on tilattava määrä. Paino = valettu seinä.",
    segment: "Lohko",
  },
  sv: {
    share: "Kopiera delningslänk", copied: "Länk kopierad", total: "Totalt",
    walls: "Väggsektioner", assumptions: "Antaganden", elevation: "Fasad", schedule: "Materialförteckning",
    cutlist: "Kaplista per skift", footing: "Grundsula", addWall: "+ Lägg till vägg", example: "Ladda exempel",
    length: "Längd (m)", courses: "Skift (à 200 mm)", type: "Blocktyp", openings: "Öppningar (m²)",
    stepped: "Trappad", uniform: "Jämn", steps: "Steg (lm × skift)", addStep: "+ steg",
    waste: "Spill (%)", fill: "Fyllning", blocks: "Block (inkl. spill)", fillConc: "Fyllbetong (att beställa)",
    hRebar: "Horisontell armering", vRebar: "Vertikal armering", area: "Väggyta",
    grossVol: "Väggens bruttovolym", weight: "Gjuten väggvikt", rebarTotal: "Armering totalt (H+V)",
    hEvery: "Horisontalstål vart … skift", hCount: "Stänger/rad", vcc: "Vertikal cc (mm)", dia: "Ø",
    course: "Skift", full: "hela", cut: "kap", top: "överkant", print: "Skriv ut / PDF", obj: "3D-export (OBJ) · Pro",
    ftLen: "Total längd (m)", ftW: "Bredd (mm)", ftH: "Höjd (mm)", ftBars: "Längsgående stänger",
    ftDowels: "Dubbar cc (mm)", ftDowelLen: "Dubblängd (mm)", ftConc: "Betong", ftSteel: "Armering tot.",
    ftForm: "Formens sidoyta", perM: "per lm", disclaimer:
      "Uppskattningar för planering och beställning. Bygg alltid enligt projektets konstruktionsritningar. Max gjuthöjd 6 skift enligt tillverkarens anvisning.",
    lifts: "gjutningar", pallets: "pallar", orderNote: "Beställ fyllning: C30/37 · S3 · #8–16 · «blockgjutning»",
    volNote: "Bruttovolym = väggens omslutna volym. Fyllbetongen ovan är beställningsmängden. Vikt = gjuten vägg.",
    segment: "Sektion",
  },
};

// ---------- geometry helpers ----------
// A wall is either uniform (length × courses) or stepped: sub-runs share a common TOP,
// each run has its own course count downward (footing steps à 200 mm).
function courseRows(seg) {
  // returns array from TOP row (index 0) downward: { length }
  if (seg.mode !== "stepped") {
    return Array.from({ length: seg.courses }, () => ({ length: seg.length }));
  }
  const maxC = Math.max(...seg.steps.map((s) => s.courses), 1);
  const rows = [];
  for (let i = 0; i < maxC; i++) {
    // row i counted from the top: a run contributes if it has ≥ i+1 courses
    const len = seg.steps.reduce((a, s) => a + (i < s.courses ? s.len : 0), 0);
    rows.push({ length: len });
  }
  return rows;
}
const segLength = (seg) => (seg.mode === "stepped" ? seg.steps.reduce((a, s) => a + s.len, 0) : seg.length);
const segArea = (seg) => courseRows(seg).reduce((a, r) => a + r.length * BH, 0) - (Number(seg.openingsM2) || 0);

// cut list per course with running-bond stagger (odd rows start with a 300 half)
const rowOffset = (idxFromTop, maxC) => ((maxC - idxFromTop) % 2 === 0 ? 0.3 : 0); // bottom course starts full

// spans (x-ranges in m) occupied by course row `ri` (0 = top). Common top: a run
// with c courses occupies the TOP c rows; only deeper runs reach the bottom rows.
function rowSpans(seg, ri) {
  if (seg.mode !== "stepped") return [[0, seg.length]];
  let x = 0; const spans = [];
  for (const s of seg.steps) {
    if (ri < s.courses) spans.push([x, x + s.len]);
    x += s.len;
  }
  return spans.reduce((a, sp) => {
    const last = a[a.length - 1];
    if (last && Math.abs(last[1] - sp[0]) < 1e-6) last[1] = sp[1];
    else a.push([...sp]);
    return a;
  }, []);
}

function cutList(seg) {
  const rowsAll = courseRows(seg);
  const maxC = rowsAll.length;
  return rowsAll.map((row, i) => {
    const offset = rowOffset(i, maxC);
    let full = 0; const cuts = [];
    for (const [sa, sb] of rowSpans(seg, i)) {
      const spanL = sb - sa;
      const bodyLen = Math.max(0, spanL - offset);
      const f = Math.floor(bodyLen / BL + 1e-9);
      const rem = bodyLen - f * BL;
      full += f;
      if (offset > 0 && spanL > offset) cuts.push(300);
      if (rem > 0.02) cuts.push(Math.round(rem * 1000));
    }
    const consumed = full + Math.ceil(cuts.reduce((a, c) => a + c, 0) / 600);
    return { i, L: row.length, full, cuts, consumed };
  });
}

function calcWall(seg, opts) {
  const preset = BLOCK_PRESETS[seg.type];
  const area = Math.max(0, segArea(seg));
  const waste = 1 + opts.wastePct / 100;
  const rows = courseRows(seg);
  const cl = cutList(seg);
  // Simple site method: blocks per course = ceil(length / 0.6), summed over courses
  const blocksRaw = rows.reduce((a, r) => a + Math.ceil(r.length / BL - 1e-9), 0);
  const blocks = Math.ceil(blocksRaw * waste);
  // Fill concrete: litres per block × total blocks (incl. waste), converted to m³
  const fillPerBlock = opts.menekki[seg.type] ?? preset.fillPerBlock;
  const fillM3 = (blocks * fillPerBlock) / 1000;
  // horizontal rebar: every Nth course, hCount bars per reinforced row
  const hRows = rows.filter((_, i) => (rows.length - i) % seg.hEvery === 0); // count from bottom
  const hLen = hRows.reduce((a, r) => a + r.length, 0) * seg.hCount * 1.1;
  // vertical: per run (stepped) or single run
  const runs = seg.mode === "stepped" ? seg.steps : [{ len: seg.length, courses: seg.courses }];
  let vBars = 0, vLen = 0;
  for (const r of runs) {
    const n = Math.floor(r.len / (seg.vcc / 1000)) + 1;
    vBars += n; vLen += n * (r.courses * BH + 0.6);
  }
  const maxC = rows.length;
  return {
    area, blocks, fillM3,
    hLen, hKg: hLen * (KG[seg.hDia] || KG[8]),
    vBars, vLen, vKg: vLen * (KG[seg.vDia] || KG[10]),
    grossVol: area * (preset.width / 1000),
    weightKg: area * preset.wallKgM2,
    pallets: blocks / preset.perPallet,
    lifts: Math.ceil(maxC / 6), maxC, cl,
  };
}

// ---------- OBJ export ----------
function exportOBJ(segments) {
  let v = 0; const out = ["# BlockCalc OBJ export — blocks as cuboids"];
  let ox = 0;
  for (const seg of segments) {
    const w = BLOCK_PRESETS[seg.type].width / 1000;
    const rows = courseRows(seg);
    const maxC = rows.length;
    rows.forEach((row, ri) => {
      const y0 = (maxC - 1 - ri) * BH; // row 0 = top
      const offset = rowOffset(ri, maxC);
      for (const [sa, sb] of rowSpans(seg, ri)) {
      let x = sa - offset;
      while (x < sb - 1e-6) {
        const bw = Math.min(BL, sb - x);
        const x0 = ox + Math.max(x, sa), x1 = ox + Math.min(x + BL, sb);
        if (x1 - x0 > 0.01) {
          const y1 = y0 + BH;
          const verts = [
            [x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0],
            [x0, y0, w], [x1, y0, w], [x1, y1, w], [x0, y1, w],
          ];
          verts.forEach((p) => out.push(`v ${p[0].toFixed(3)} ${p[1].toFixed(3)} ${p[2].toFixed(3)}`));
          const f = (a, b, c, d) => out.push(`f ${v + a} ${v + b} ${v + c} ${v + d}`);
          f(1, 2, 3, 4); f(5, 8, 7, 6); f(1, 5, 6, 2); f(2, 6, 7, 3); f(3, 7, 8, 4); f(4, 8, 5, 1);
          v += 8;
        }
        x += BL;
      }
      }
    });
    ox += segLength(seg) + 1;
  }
  const blob = new Blob([out.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "blockcalc-walls.obj";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- UI atoms ----------
function DimHeader({ children }) {
  return (
    <div className="flex items-center gap-3 select-none" style={{ color: INK }}>
      <svg width="26" height="10" viewBox="0 0 26 10">
        <line x1="0" y1="5" x2="26" y2="5" stroke={INK} strokeWidth="1" />
        <line x1="2" y1="1" x2="2" y2="9" stroke={INK} strokeWidth="1" />
        <path d="M2 5 L10 2 L10 8 Z" fill={INK} />
      </svg>
      <span className="uppercase tracking-widest text-xs font-bold">{children}</span>
      <div className="flex-1 h-px" style={{ background: LINE }} />
    </div>
  );
}
function Stat({ label, value, unit, accent }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <span className="text-xs uppercase tracking-wider" style={{ color: MUTED }}>{label}</span>
      <span className="font-mono text-xl font-semibold" style={{ color: accent ? REBAR : INK }}>
        {value} <span className="text-sm font-normal" style={{ color: MUTED }}>{unit}</span>
      </span>
    </div>
  );
}

// ---------- elevation preview (uniform + stepped) ----------
function WallPreview({ seg, t }) {
  const rows = courseRows(seg);
  const maxC = rows.length;
  const totalL = segLength(seg);
  const W = 580, PAD = 36;
  const pxm = (W - PAD * 2) / Math.max(totalL, 1);
  const cH = Math.min(24, Math.max(10, 180 / maxC));
  const H = maxC * cH + 86;
  const x0 = PAD, yTop = 30;

  const els = [];
  rows.forEach((row, ri) => {
    const y = yTop + ri * cH;
    // stepped: rows are top-aligned; runs shorter than this row are absent.
    // Draw the row's spans: walk runs left→right, include run if courses ≥ maxC-ri… wait rows already encode length,
    // but for stepped we must place spans at correct x. Build spans:
    const spans = rowSpans(seg, ri);

    for (const [sa, sb] of spans) {
      const offset = rowOffset(ri, maxC);
      let x = sa - offset;
      while (x < sb - 1e-6) {
        const bx = Math.max(x, sa), be = Math.min(x + BL, sb);
        if (be - bx > 0.01)
          els.push(
            <rect key={`${ri}-${bx.toFixed(2)}`} x={x0 + bx * pxm} y={y}
              width={(be - bx) * pxm} height={cH}
              fill={ri % 2 ? "#F2EFE6" : "#EDEAE0"} stroke={LINE} strokeWidth="1" />
          );
        x += BL;
      }
      // horizontal rebar rows (count from bottom)
      if ((maxC - ri) % seg.hEvery === 0)
        els.push(
          <line key={`hr${ri}-${sa}`} x1={x0 + sa * pxm + 3} y1={y + cH / 2}
            x2={x0 + sb * pxm - 3} y2={y + cH / 2}
            stroke={REBAR} strokeWidth="1.5" strokeDasharray="7 3" />
        );
    }
  });

  // footing steps under stepped wall
  if (seg.mode === "stepped") {
    let x = 0;
    for (const s of seg.steps) {
      const y = yTop + s.courses * cH;
      els.push(
        <rect key={"ft" + x} x={x0 + x * pxm - 6} y={y} width={s.len * pxm + 12} height={12}
          fill="#D8D5CD" stroke={LINE} />
      );
      x += s.len;
    }
  } else {
    els.push(<rect key="ft" x={x0 - 10} y={yTop + maxC * cH} width={totalL * pxm + 20} height={12} fill="#D8D5CD" stroke={LINE} />);
  }

  // vertical rebar ticks
  const runs = seg.mode === "stepped" ? seg.steps : [{ len: seg.length, courses: seg.courses }];
  let rx = 0;
  for (const r of runs) {
    for (let m = 0; m <= r.len + 1e-6; m += seg.vcc / 1000) {
      const x = x0 + (rx + Math.min(m, r.len)) * pxm;
      const yb = yTop + r.courses * cH + 8;
      els.push(<line key={`v${rx}-${m}`} x1={x} y1={yb} x2={x} y2={yTop - 4}
        stroke={REBAR} strokeWidth="1.4" opacity="0.85" />);
    }
    rx += r.len;
  }

  // pour lift line at 6 courses above the DEEPEST footing
  if (maxC > 6) {
    const y = yTop + (maxC - 6) * cH;
    els.push(
      <g key="lift">
        <line x1={x0 - 16} y1={y} x2={x0 + totalL * pxm + 16} y2={y} stroke={INK} strokeWidth="1.2" strokeDasharray="10 5" />
        <text x={x0 + totalL * pxm + 14} y={y - 4} fontSize="9" fill={INK} fontFamily="monospace" textAnchor="end">
          POUR LIFT (6)
        </text>
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Elevation of ${seg.name}`}>
      {els}
      <g fontFamily="monospace" fontSize="10" fill={REBAR}>
        <line x1={x0} y1={H - 12} x2={x0 + totalL * pxm} y2={H - 12} stroke={REBAR} strokeWidth="0.8" />
        <text x={x0 + (totalL * pxm) / 2} y={H - 16} textAnchor="middle">{Math.round(totalL * 1000)}</text>
      </g>
      <text x={x0} y={14} fontSize="10" fill={MUTED} fontFamily="monospace">
        {seg.name.toUpperCase()} · {BLOCK_PRESETS[seg.type].label} · {maxC} {t.course.toUpperCase()}S · {seg.mode === "stepped" ? t.stepped.toUpperCase() : t.uniform.toUpperCase()}
      </text>
    </svg>
  );
}

// ---------- footing calculator ----------
function FootingCalc({ t, wastePct }) {
  const [f, setF] = useState({ len: 32.5, w: 600, h: 250, nBars: 3, dia: 10, dowelCc: 600, dowelLen: 750 });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: +e.target.value || 0 }));
  const waste = 1 + wastePct / 100;
  const conc = (f.w / 1000) * (f.h / 1000) * f.len;
  const barLen = f.len * f.nBars * 1.1;
  const dowels = Math.floor(f.len / (f.dowelCc / 1000)) + 1;
  const dowelLenTot = (dowels * f.dowelLen) / 1000;
  const steel = barLen * (KG[f.dia] || KG[10]) + dowelLenTot * KG[10];
  const inputCls = "w-full rounded px-2 py-1.5 font-mono text-sm border focus:outline-none";
  const inputStyle = { borderColor: LINE, color: INK, background: "#FBFAF8" };
  const fields = [
    ["len", t.ftLen, 0.1], ["w", t.ftW, 10], ["h", t.ftH, 10],
    ["nBars", t.ftBars, 1], ["dowelCc", t.ftDowels, 50], ["dowelLen", t.ftDowelLen, 10],
  ];
  return (
    <div className="rounded-lg border p-4 grid gap-4" style={{ background: CARD, borderColor: LINE }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fields.map(([k, label, step]) => (
          <label key={k} className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>
            {label}
            <input type="number" step={step} className={inputCls} style={inputStyle} value={f[k]} onChange={set(k)} />
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 border-t pt-1" style={{ borderColor: LINE }}>
        <Stat label={t.ftConc} value={fmt(conc * waste, 2)} unit="m³" accent />
        <Stat label={`${t.ftConc} ${t.perM}`} value={fmt((f.w / 1000) * (f.h / 1000) * 1000, 0)} unit="l/m" />
        <Stat label={t.ftSteel} value={fmt(steel, 0)} unit={`kg · ${dowels} ⌀10 dowels`} />
        <Stat label={t.ftForm} value={fmt(2 * f.len * (f.h / 1000), 1)} unit="m²" />
      </div>
    </div>
  );
}

// ---------- main ----------
const STORE_KEY = "blockcalc-state-v1";
function migrate(state) {
  if (!state || typeof state !== "object") return state;
  const rename = { VB150: "MH150PRO", MH200: "MH200PRO" };
  if (Array.isArray(state.segments)) {
    state.segments = state.segments.map(s => (s && rename[s.type]) ? { ...s, type: rename[s.type] } : s);
  }
  // Menekki changed from l/m² to l/block; if legacy values look like l/m² (>30) or keys stale, reset.
  if (state.menekki) {
    const looksLegacy = Object.keys(state.menekki).some(k => rename[k] || (state.menekki[k] ?? 0) > 30);
    if (looksLegacy) state.menekki = { MH150PRO: 9.4, MH200PRO: 14.4, EMH300: 13.8 };
  }
  return state;
}

function loadInitial() {
  try {
    const h = window.location.hash;
    if (h.startsWith("#s=")) {
      const json = decodeURIComponent(escape(atob(h.slice(3))));
      return migrate(JSON.parse(json));
    }
  } catch {}
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch {}
  return null;
}

export default function BlockCalc() {
  const saved = useMemo(loadInitial, []);
  const [lang, setLang] = useState(saved?.lang || "en");
  const t = T[lang];
  const [wastePct, setWastePct] = useState(saved?.wastePct ?? 7);
  const [menekki, setMenekki] = useState(saved?.menekki || { MH150PRO: 9.4, MH200PRO: 14.4, EMH300: 13.8 });
  const [tab, setTab] = useState("walls");
  const [segments, setSegments] = useState(saved?.segments || [
    {
      id: uid(), name: "Wall A", type: "MH150PRO", openingsM2: 0,
      mode: "stepped", length: 10, courses: 6,
      steps: [{ len: 3.5, courses: 5 }, { len: 3.5, courses: 6 }, { len: 3, courses: 7 }],
      hEvery: 2, hCount: 2, hDia: 8, vcc: 600, vDia: 10,
    },
  ]);
  const [copied, setCopied] = useState(false);

  // autosave (guarded — fails silently where storage is unavailable)
  React.useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ lang, wastePct, menekki, segments })); } catch {}
  }, [lang, wastePct, menekki, segments]);

  const shareLink = () => {
    try {
      const json = JSON.stringify({ lang, wastePct, menekki, segments });
      const hash = "#s=" + btoa(unescape(encodeURIComponent(json)));
      const url = window.location.origin + window.location.pathname + hash;
      navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", hash);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const [selected, setSelected] = useState(segments[0].id);
  const opts = { wastePct, menekki };

  const results = useMemo(() => segments.map((s) => ({ seg: s, r: calcWall(s, opts) })), [segments, wastePct, menekki]);
  const totals = useMemo(() => {
    const t0 = { area: 0, blocks: 0, fillM3: 0, hKg: 0, vKg: 0, hLen: 0, vLen: 0, vBars: 0, grossVol: 0, weightKg: 0 };
    const byType = {};
    for (const { seg, r } of results) {
      for (const k of ["area", "blocks", "fillM3", "hKg", "vKg", "hLen", "vLen", "vBars", "grossVol", "weightKg"]) t0[k] += r[k];
      byType[seg.type] = (byType[seg.type] || 0) + r.blocks;
    }
    return { ...t0, byType };
  }, [results]);

  const update = (id, patch) => setSegments((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const sel = segments.find((s) => s.id === selected) || segments[0];
  const selR = results.find((x) => x.seg.id === selected)?.r;

  const addSegment = () => {
    const s = {
      id: uid(), name: `Wall ${String.fromCharCode(65 + segments.length)}`, type: "MH150PRO",
      openingsM2: 0, mode: "uniform", length: 4, courses: 6, steps: [{ len: 4, courses: 6 }],
      hEvery: 2, hCount: 2, hDia: 8, vcc: 600, vDia: 10,
    };
    setSegments((ss) => [...ss, s]); setSelected(s.id);
  };
  const removeSegment = (id) => {
    setSegments((ss) => ss.filter((s) => s.id !== id));
    if (selected === id && segments.length > 1) setSelected(segments[0].id);
  };
  const loadExample = () => {
    const ex = [
      {
        id: uid(), name: "Tupa S+N walls", type: "MH150PRO", openingsM2: 0.6, mode: "stepped",
        length: 12, courses: 7,
        steps: [{ len: 4, courses: 6 }, { len: 4.2, courses: 7 }, { len: 3.8, courses: 8 }],
        hEvery: 2, hCount: 2, hDia: 8, vcc: 600, vDia: 10,
      },
      {
        id: uid(), name: "Tech room", type: "EMH300", openingsM2: 0.2, mode: "uniform",
        length: 12.7, courses: 9, steps: [{ len: 12.7, courses: 9 }],
        hEvery: 2, hCount: 2, hDia: 8, vcc: 600, vDia: 10,
      },
    ];
    setSegments(ex); setSelected(ex[0].id);
  };

  const inputCls = "w-full rounded px-2 py-1.5 font-mono text-sm border focus:outline-none focus:ring-2";
  const inputStyle = { borderColor: LINE, color: INK, background: "#FBFAF8" };
  const smallSel = "rounded px-1.5 py-1 font-mono text-xs border";

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK, fontFamily: "'Archivo','Helvetica Neue',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=IBM+Plex+Mono:wght@400;600&display=swap');
        .font-mono{font-family:'IBM Plex Mono',monospace!important}
        input:focus,select:focus{--tw-ring-color:${REBAR}33}
        @media print{.no-print{display:none!important}body{background:#fff!important}.print-block{box-shadow:none!important;border-color:#999!important}}
        @media (prefers-reduced-motion: reduce){*{transition:none!important}}`}</style>

      <header className="border-b-2 no-print" style={{ borderColor: INK, background: CARD }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: MUTED }}>Panelr tools · masonry</div>
            <h1 className="text-2xl font-extrabold tracking-tight">BLOCK<span style={{ color: REBAR }}>CALC</span> <span className="text-sm font-normal" style={{ color: MUTED }}>v2</span></h1>
          </div>
          <div className="flex items-center gap-2">
            {["en", "fi", "sv"].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={smallSel + " uppercase"}
                style={{ borderColor: lang === l ? REBAR : LINE, color: lang === l ? REBAR : MUTED, background: CARD }}>
                {l}
              </button>
            ))}
            <button onClick={shareLink} className={smallSel}
              style={{ borderColor: copied ? "#2D7D62" : LINE, color: copied ? "#2D7D62" : INK, background: CARD }}>
              {copied ? "✓ " + t.copied : t.share}</button>
            <button onClick={() => window.print()} className={smallSel} style={{ borderColor: LINE, background: CARD }}>{t.print}</button>
            <button onClick={() => exportOBJ(segments)} className={smallSel}
              style={{ borderColor: REBAR, color: REBAR, background: CARD }}>{t.obj}</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 pb-3 flex gap-2">
          {[["walls", t.walls], ["footing", t.footing]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className="rounded-t px-3 py-1.5 text-sm font-semibold border-b-2"
              style={{ borderColor: tab === k ? REBAR : "transparent", color: tab === k ? INK : MUTED }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {tab === "footing" ? (
          <div className="grid gap-5 max-w-3xl">
            <DimHeader>{t.footing}</DimHeader>
            <FootingCalc t={t} wastePct={wastePct} />
            <p className="text-xs" style={{ color: MUTED }}>{t.disclaimer}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* inputs */}
            <section className="lg:col-span-2 flex flex-col gap-5 no-print">
              <DimHeader>{t.walls}</DimHeader>
              {segments.map((seg) => (
                <div key={seg.id} className="rounded-lg border p-3 flex flex-col gap-2 cursor-pointer"
                  style={{ background: CARD, borderColor: selected === seg.id ? REBAR : LINE, boxShadow: selected === seg.id ? `0 0 0 1px ${REBAR}` : "none" }}
                  onClick={() => setSelected(seg.id)}>
                  <div className="flex items-center gap-2">
                    <input aria-label="name" className={inputCls} style={{ ...inputStyle, fontWeight: 600 }}
                      value={seg.name} onChange={(e) => update(seg.id, { name: e.target.value })} />
                    <div className="flex rounded border overflow-hidden shrink-0" style={{ borderColor: LINE }}>
                      {["uniform", "stepped"].map((m) => (
                        <button key={m} onClick={(e) => { e.stopPropagation(); update(seg.id, { mode: m }); }}
                          className="px-2 py-1 text-xs font-semibold"
                          style={{ background: seg.mode === m ? INK : CARD, color: seg.mode === m ? "#fff" : MUTED }}>
                          {m === "uniform" ? t.uniform : t.stepped}
                        </button>
                      ))}
                    </div>
                    <button aria-label="remove" onClick={(e) => { e.stopPropagation(); removeSegment(seg.id); }}
                      className="shrink-0 rounded px-2 py-1 text-sm border hover:opacity-70" style={{ borderColor: LINE, color: MUTED }}>✕</button>
                  </div>

                  {seg.mode === "uniform" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.length}
                        <input type="number" min="0.6" step="0.1" className={inputCls} style={inputStyle}
                          value={seg.length} onChange={(e) => update(seg.id, { length: +e.target.value || 0 })} />
                      </label>
                      <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.courses}
                        <input type="number" min="1" max="15" className={inputCls} style={inputStyle}
                          value={seg.courses} onChange={(e) => update(seg.id, { courses: Math.max(1, Math.round(+e.target.value || 1)) })} />
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs" style={{ color: MUTED }}>{t.steps}</span>
                      {seg.steps.map((st, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="number" min="0.6" step="0.1" className={inputCls} style={inputStyle} value={st.len}
                            onChange={(e) => {
                              const steps = seg.steps.map((s, j) => (j === i ? { ...s, len: +e.target.value || 0 } : s));
                              update(seg.id, { steps });
                            }} />
                          <span className="font-mono text-xs" style={{ color: MUTED }}>m ×</span>
                          <input type="number" min="1" max="15" className={inputCls} style={inputStyle} value={st.courses}
                            onChange={(e) => {
                              const steps = seg.steps.map((s, j) => (j === i ? { ...s, courses: Math.max(1, Math.round(+e.target.value || 1)) } : s));
                              update(seg.id, { steps });
                            }} />
                          <button onClick={(e) => { e.stopPropagation(); update(seg.id, { steps: seg.steps.filter((_, j) => j !== i) }); }}
                            className="rounded px-1.5 border text-xs" style={{ borderColor: LINE, color: MUTED }}>✕</button>
                        </div>
                      ))}
                      <button onClick={(e) => { e.stopPropagation(); update(seg.id, { steps: [...seg.steps, { len: 2, courses: (seg.steps[seg.steps.length - 1]?.courses || 5) + 1 }] }); }}
                        className="rounded border border-dashed py-1 text-xs" style={{ borderColor: MUTED, color: MUTED }}>{t.addStep}</button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.type}
                      <select className={inputCls} style={inputStyle} value={seg.type} onChange={(e) => update(seg.id, { type: e.target.value })}>
                        {Object.entries(BLOCK_PRESETS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </label>
                    <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.openings}
                      <input type="number" min="0" step="0.1" className={inputCls} style={inputStyle}
                        value={seg.openingsM2} onChange={(e) => update(seg.id, { openingsM2: +e.target.value || 0 })} />
                    </label>
                  </div>

                  {/* rebar config */}
                  <div className="grid grid-cols-3 gap-2 border-t pt-2" style={{ borderColor: LINE }}>
                    <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.hEvery}
                      <select className={inputCls} style={inputStyle} value={seg.hEvery}
                        onChange={(e) => update(seg.id, { hEvery: +e.target.value })}>
                        {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </label>
                    <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.hCount} / {t.dia}
                      <div className="flex gap-1">
                        <select className={inputCls} style={inputStyle} value={seg.hCount}
                          onChange={(e) => update(seg.id, { hCount: +e.target.value })}>
                          {[1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <select className={inputCls} style={inputStyle} value={seg.hDia}
                          onChange={(e) => update(seg.id, { hDia: +e.target.value })}>
                          {[8, 10, 12].map((n) => <option key={n} value={n}>T{n}</option>)}
                        </select>
                      </div>
                    </label>
                    <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.vcc} / {t.dia}
                      <div className="flex gap-1">
                        <input type="number" min="200" step="100" className={inputCls} style={inputStyle} value={seg.vcc}
                          onChange={(e) => update(seg.id, { vcc: +e.target.value || 600 })} />
                        <select className={inputCls} style={inputStyle} value={seg.vDia}
                          onChange={(e) => update(seg.id, { vDia: +e.target.value })}>
                          {[8, 10, 12].map((n) => <option key={n} value={n}>T{n}</option>)}
                        </select>
                      </div>
                    </label>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <button onClick={addSegment} className="flex-1 rounded-lg border-2 border-dashed py-2 text-sm font-semibold hover:opacity-70"
                  style={{ borderColor: MUTED, color: INK }}>{t.addWall}</button>
                <button onClick={loadExample} className="rounded-lg border py-2 px-3 text-sm hover:opacity-70"
                  style={{ borderColor: LINE, color: MUTED, background: CARD }}>{t.example}</button>
              </div>

              <DimHeader>{t.assumptions}</DimHeader>
              <div className="rounded-lg border p-3 grid grid-cols-2 gap-3" style={{ background: CARD, borderColor: LINE }}>
                <label className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.waste}
                  <input type="number" min="0" max="25" className={inputCls} style={inputStyle}
                    value={wastePct} onChange={(e) => setWastePct(+e.target.value || 0)} />
                </label>
                {Object.keys(BLOCK_PRESETS).map((k) => (
                  <label key={k} className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>{t.fill} {k} (l/block)
                    <input type="number" min="0" className={inputCls} style={inputStyle} value={menekki[k]}
                      onChange={(e) => setMenekki((m) => ({ ...m, [k]: +e.target.value || 0 }))} />
                  </label>
                ))}
              </div>
            </section>

            {/* results */}
            <section className="lg:col-span-3 flex flex-col gap-5">
              <DimHeader>{t.elevation} · {sel?.name}</DimHeader>
              <div className="rounded-lg border p-3 print-block" style={{ background: CARD, borderColor: LINE }}>
                {sel && <WallPreview seg={sel} t={t} />}
              </div>

              <DimHeader>{t.schedule}</DimHeader>
              <div className="rounded-lg border overflow-hidden print-block" style={{ background: CARD, borderColor: LINE }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 px-4">
                  <Stat label={t.blocks} value={totals.blocks.toLocaleString()} unit="pcs" accent />
                  <Stat label={t.fillConc} value={fmt(totals.fillM3, 2)} unit="m³" accent />
                  <Stat label={t.hRebar} value={fmt(totals.hLen, 0)} unit={`m · ${fmt(totals.hKg, 0)} kg`} />
                  <Stat label={t.vRebar} value={fmt(totals.vLen, 0)} unit={`m · ${fmt(totals.vKg, 0)} kg`} />
                  <Stat label={t.area} value={fmt(totals.area)} unit="m²" />
                  <Stat label={t.grossVol} value={fmt(totals.grossVol, 2)} unit="m³" />
                  <Stat label={t.weight} value={fmt(totals.weightKg / 1000, 1)} unit="t" />
                  <Stat label={t.rebarTotal} value={fmt(totals.hLen + totals.vLen, 0)} unit="m" />
                </div>
                <div className="border-t px-4 py-3 font-mono text-xs flex flex-wrap gap-x-6 gap-y-1" style={{ borderColor: LINE, color: MUTED }}>
                  {Object.entries(totals.byType).map(([k, n]) => (
                    <span key={k}>{k}: <b style={{ color: INK }}>{n}</b> ≈ {fmt(n / BLOCK_PRESETS[k].perPallet, 1)} {t.pallets}</span>
                  ))}
                  <span>{t.orderNote}</span>
                </div>
                <div className="border-t px-4 py-2 text-xs" style={{ borderColor: LINE, color: MUTED }}>{t.volNote}</div>
              </div>

              {/* per-segment table */}
              <div className="rounded-lg border overflow-x-auto print-block" style={{ background: CARD, borderColor: LINE }}>
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-left" style={{ color: MUTED }}>
                      {[t.segment, "m²", "pcs", "m³", "m H", "m V", t.lifts].map((h) => (
                        <th key={h} className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(({ seg, r }) => (
                      <tr key={seg.id} className="cursor-pointer hover:opacity-70" onClick={() => setSelected(seg.id)}
                        style={{ background: selected === seg.id ? HILITE : "transparent" }}>
                        <td className="px-3 py-2 border-b font-semibold" style={{ borderColor: LINE, fontFamily: "'Archivo'" }}>{seg.name}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{fmt(r.area)}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{r.blocks}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{fmt(r.fillM3, 2)}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{fmt(r.hLen, 0)}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{fmt(r.vLen, 0)}</td>
                        <td className="px-3 py-2 border-b" style={{ borderColor: LINE, color: r.lifts > 1 ? REBAR : MUTED }}>{r.lifts}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: `2px solid ${INK}` }}>
                      <td className="px-3 py-2 font-bold" style={{ fontFamily: "'Archivo'" }}>{t.total}</td>
                      <td className="px-3 py-2 font-semibold">{fmt(totals.area)}</td>
                      <td className="px-3 py-2 font-semibold" style={{ color: REBAR }}>{totals.blocks}</td>
                      <td className="px-3 py-2 font-semibold" style={{ color: REBAR }}>{fmt(totals.fillM3, 2)}</td>
                      <td className="px-3 py-2 font-semibold">{fmt(totals.hLen, 0)}</td>
                      <td className="px-3 py-2 font-semibold">{fmt(totals.vLen, 0)}</td>
                      <td className="px-3 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* cut list */}
              <DimHeader>{t.cutlist} · {sel?.name}</DimHeader>
              <div className="rounded-lg border overflow-x-auto print-block" style={{ background: CARD, borderColor: LINE }}>
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-left" style={{ color: MUTED }}>
                      {[t.course, "m", t.full, t.cut + " (mm)"].map((h) => (
                        <th key={h} className="px-3 py-2 border-b" style={{ borderColor: LINE }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selR?.cl.map((row) => (
                      <tr key={row.i}>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: LINE }}>
                          {row.i === 0 ? `1 (${t.top})` : row.i + 1}
                        </td>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: LINE }}>{fmt(row.L, 2)}</td>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: LINE }}>{row.full}</td>
                        <td className="px-3 py-1.5 border-b" style={{ borderColor: LINE, color: row.cuts.length ? REBAR : MUTED }}>
                          {row.cuts.length ? row.cuts.join(" + ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs leading-5 pb-6" style={{ color: MUTED }}>{t.disclaimer}</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
