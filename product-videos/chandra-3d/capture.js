// Renders the Chandra 3D film frame by frame in headless Chromium and pipes it to ffmpeg.
// Usage: node capture.js <width> <height> <out.mp4>            full film
//        node capture.js <width> <height> --stills <dir> t1,t2  single frames for review
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const [W, H] = [parseInt(process.argv[2]), parseInt(process.argv[3])];
const stills = process.argv[4] === '--stills';
const FPS = 30;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff' };

(async () => {
  const server = http.createServer((req, res) => {
    const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(d); } });
  }).listen(0);
  const port = server.address().port;
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('page:', m.text()); });
  page.on('pageerror', e => console.error('pageerror:', e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const total = await page.evaluate('window.TOTAL');

  if (stills) {
    const dir = process.argv[5];
    for (const t of process.argv[6].split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(dir, `${W}x${H}_${t.toFixed(2)}.jpg`), type: 'jpeg', quality: 92 });
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', String(FPS), '-i', '-',
      '-vf', 'noise=alls=3:allf=t', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
      '-profile:v', 'high', '-movflags', '+faststart', process.argv[4]], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.renderAt(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 97 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(`${process.argv[4]}: ${n} frames, ${total.toFixed(1)}s`);
  }
  await browser.close();
  server.close();
})();
