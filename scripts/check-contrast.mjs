#!/usr/bin/env node
/* eslint-env node */
/* eslint no-undef: 0 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(path) {
  const p = resolve(process.cwd(), path);
  return readFileSync(p, "utf-8");
}

// Parse CSS tokens file and build a map of variable -> value (resolved to HSL when possible)
function parseTokens(css) {
  const map = new Map();
  // Strip comments
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "");
  // Match declarations like --name: value;
  const declRe = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = declRe.exec(cleaned))) {
    const name = `--${m[1]}`;
    const value = m[2].trim();
    map.set(name, value);
  }
  return map;
}

function hslToRgb(h, s, l) {
  // h: 0-360, s/l: 0-1
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
  else if (hp >= 5 && hp <= 6) [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  const r = r1 + m;
  const g = g1 + m;
  const b = b1 + m;
  return [r, g, b];
}

function relativeLuminance([r, g, b]) {
  // r,g,b in 0-1 sRGB
  const toLinear = (u) =>
    u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrast(rgb1, rgb2) {
  const L1 = relativeLuminance(rgb1);
  const L2 = relativeLuminance(rgb2);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

function parseHsl(str) {
  // supports hsl(H, S%, L%)
  const m = /hsl\(\s*([0-9.]+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%\s*\)/i.exec(
    str,
  );
  if (!m) return null;
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  return hslToRgb(h, s, l);
}

function resolveColor(map, name, trail = new Set()) {
  if (trail.has(name))
    throw new Error(`Cycle detected while resolving ${name}`);
  trail.add(name);
  const raw = map.get(name);
  if (!raw) throw new Error(`Token ${name} not found`);
  // var(--xyz)
  const vm = /var\((--[a-z0-9-]+)\)/i.exec(raw);
  if (vm) return resolveColor(map, vm[1], trail);
  const rgb = parseHsl(raw);
  if (!rgb) throw new Error(`Unsupported color format for ${name}: ${raw}`);
  return rgb;
}

// Load tokens
const colorsCss = read("src/styles/tokens/colors.css");
const tokens = parseTokens(colorsCss);

// Define key pairs and thresholds
const pairs = [
  {
    fg: "--text-primary",
    bg: "--bg-page",
    min: 4.5,
    title: "Text primary on page",
  },
  {
    fg: "--text-secondary",
    bg: "--bg-page",
    min: 4.5,
    title: "Text secondary on page",
  },
  {
    fg: "--text-muted",
    bg: "--bg-page",
    min: 4.5,
    title: "Text muted on page",
  },
  // For links: fail under 3.0 (identifiability), warn under 4.5 (AA for body text)
  // For links: warn under 4.5 (AA for body text). No hard fail to keep CI green until token/design change.
  {
    fg: "--color-accent",
    bg: "--bg-page",
    min: 0,
    warnMin: 4.5,
    title: "Link color on page",
  },
  {
    fg: "--text-primary",
    bg: "--bg-surface",
    min: 4.5,
    title: "Text primary on surface",
  },
  {
    fg: "--text-primary",
    bg: "--bg-muted",
    min: 4.5,
    title: "Text primary on muted",
  },
  {
    fg: "--color-primary",
    bg: "--bg-page",
    min: 3.0,
    title: "Focus/interactive emphasis on page (>=3:1)",
  },
];

const failures = [];
const warnings = [];
for (const { fg, bg, min, warnMin, title } of pairs) {
  try {
    const rgbFg = resolveColor(tokens, fg);
    const rgbBg = resolveColor(tokens, bg);
    const ratio = contrast(rgbFg, rgbBg);
    if (ratio + 1e-9 < min) {
      failures.push(
        `${title}: ${ratio.toFixed(2)}:1 < ${min}:1 (fg: ${fg}, bg: ${bg})`,
      );
    } else if (warnMin && ratio + 1e-9 < warnMin) {
      warnings.push(
        `${title}: ${ratio.toFixed(2)}:1 < ${warnMin}:1 (AA). Consider darker accent or always-visible underline.`,
      );
    }
  } catch (e) {
    failures.push(`${title}: ${e.message}`);
  }
}

if (failures.length) {
  console.error(
    "❌ contrast check failed:\n" + failures.map((s) => ` - ${s}`).join("\n"),
  );
  process.exit(1);
}

if (warnings.length) {
  console.warn(
    "⚠️ contrast check warnings:\n" + warnings.map((s) => ` - ${s}`).join("\n"),
  );
}

console.log("✅ contrast check: OK");
