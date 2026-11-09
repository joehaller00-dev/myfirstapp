// Renders one campaign product film frame by frame in headless Chromium and pipes it to ffmpeg.
// Usage: node capture.js <handle> <width> <height> <out.mp4>
//        node capture.js <handle> <width> <height> --stills <out.jpg>   (review strip of 8 frames)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const handle = process.argv[2];
const [W, H] = [parseInt(process.argv[3]), parseInt(process.argv[4])];
const stills = process.argv[5] === '--stills';
const out = stills ? process.argv[6] : process.argv[5];
const FPS = 30;
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff' };

(async () => {
  const server = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' }); res.end(d); } });
  }).listen(0);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error(`[${handle}] pageerror:`, e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/campaign/film.html?p=${encodeURIComponent(handle)}`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const total = await page.evaluate('window.TOTAL');

  if (stills) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stills-'));
    const n = 8, files = [];
    for (let i = 0; i < n; i++) {
      const t = total * (i + 0.62) / n;
      await page.evaluate(t => window.renderAt(t), t);
      const f = path.join(dir, `${i}.jpg`); files.push(f);
      await page.screenshot({ path: f, type: 'jpeg', quality: 88 });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(dir, '%d.jpg'), '-vf', `scale=${Math.round(270 * W / H)}:270,tile=${n}x1`, '-frames:v', '1', out]);
    fs.rmSync(dir, { recursive: true });
  } else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', String(FPS), '-i', '-',
      '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.renderAt(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 96 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(`${out}: ${n} frames, ${total.toFixed(1)}s`);
  }
  await browser.close();
  server.close();
})();
