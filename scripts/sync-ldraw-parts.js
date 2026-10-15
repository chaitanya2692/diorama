import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const LDRAW_ARCHIVE_URL = 'https://library.ldraw.org/library/updates/complete.zip';
const TMP_ZIP = '/tmp/ldraw-complete.zip';
const TMP_DIR = '/tmp/ldraw';
const OUT_ROOT = path.resolve('public/ldraw');

export const WANTED_PARTS = [
  // Bricks
  '3005.dat', '3004.dat', '3622.dat', '3010.dat', '3009.dat', '3008.dat',
  '3003.dat', '3002.dat', '3001.dat',
  // Plates
  '3024.dat', '3023b.dat', '3623.dat', '3710.dat', '3666.dat', '3460.dat',
  '3022.dat', '3021.dat', '3020.dat', '3795.dat', '3034.dat', '3031.dat', '3032.dat',
  // Tiles
  '3070b.dat', '3069b.dat', '63864.dat', '2431.dat', '6636.dat', '4162.dat',
  '3068b.dat', '26603.dat', '87079.dat', '14769.dat', '98138.dat',
  // Jumper plates
  '3794b.dat', '87580.dat',
  // Curved & cheese slopes
  '11477.dat', '15068.dat', '24309.dat', '54200.dat', '85984.dat',
  // Round bricks, plates, dishes
  '3062b.dat', '3941.dat', '6141.dat', '85861.dat', '4032a.dat', '60474.dat', '11833.dat',
  '2654a.dat', '4740.dat', '43898.dat', '3960.dat',
  // Bars
  '30374.dat', '87994.dat',
  // Plant stems & foliage
  '37695.dat', '32607.dat', '2423.dat', '24855.dat',
  // Door & frame
  '60596.dat', '60616b.dat', '60623.dat',
];

function ensureLDrawExtracted() {
  if (!fs.existsSync(path.join(TMP_DIR, 'LDConfig.ldr'))) {
    console.log(`Downloading ${LDRAW_ARCHIVE_URL}...`);
    execFileSync('curl', ['-sL', LDRAW_ARCHIVE_URL, '-o', TMP_ZIP], { stdio: 'inherit' });
    execFileSync('unzip', ['-q', '-o', TMP_ZIP, '-d', '/tmp'], { stdio: 'inherit' });
  }
}

function resolveFile(ref) {
  const norm = ref.trim().replace(/\\/g, '/');
  const candidates = [
    path.join(TMP_DIR, 'parts', norm),
    path.join(TMP_DIR, 'p', norm),
    path.join(TMP_DIR, 'parts', norm.toLowerCase()),
    path.join(TMP_DIR, 'p', norm.toLowerCase()),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

ensureLDrawExtracted();

const visited = new Map();
function walk(ref) {
  const full = resolveFile(ref);
  if (!full) throw new Error(`Missing LDraw file: ${ref}`);
  const rel = path.relative(TMP_DIR, full).replace(/\\/g, '/');
  if (visited.has(rel)) return;
  const content = fs.readFileSync(full, 'utf8');
  visited.set(rel, content);
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('1 ')) {
      const tokens = trimmed.split(/\s+/);
      walk(tokens.slice(14).join(' '));
    }
  }
}

for (const part of WANTED_PARTS) walk(part);

fs.mkdirSync(OUT_ROOT, { recursive: true });
fs.copyFileSync(path.join(TMP_DIR, 'LDConfig.ldr'), path.join(OUT_ROOT, 'LDConfig.ldr'));

const bundleObj = {};
for (const [rel, content] of visited.entries()) {
  const dest = path.join(OUT_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);

  let cacheKey = rel;
  if (rel.startsWith('parts/') && !rel.startsWith('parts/s/')) {
    cacheKey = rel.slice('parts/'.length);
  } else if (rel.startsWith('p/') && !rel.startsWith('p/48/')) {
    cacheKey = rel.slice('p/'.length);
  }
  bundleObj[cacheKey.toLowerCase()] = content;
}

fs.writeFileSync(path.join(OUT_ROOT, 'parts-bundle.json'), JSON.stringify(bundleObj));
console.log(`Synced ${visited.size} official LDraw files into ${OUT_ROOT}`);
