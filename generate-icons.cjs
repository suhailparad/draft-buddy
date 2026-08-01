const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PRIMARY = "#0F766E";

const createIcon = async (size) => {
  const padding = Math.max(8, Math.round(size * 0.04));
  const bgCorner = Math.round(size * 0.24);

  const innerSize = size - padding * 2;
  const sx = (v) => Math.round((v / 48) * innerSize + padding);

  const whiteBubble = `
    M ${sx(19.5)} ${sx(42)}
    C ${sx(17.8431)} ${sx(42)} ${sx(16.5)} ${sx(40.6569)} ${sx(16.5)} ${sx(39)}
    V ${sx(38)}
    H ${sx(13.5)}
    C ${sx(10.1863)} ${sx(38)} ${sx(7.5)} ${sx(35.3137)} ${sx(7.5)} ${sx(32)}
    V ${sx(13)}
    C ${sx(7.5)} ${sx(9.68629)} ${sx(10.1863)} ${sx(7)} ${sx(13.5)} ${sx(7)}
    H ${sx(34.5)}
    C ${sx(37.8137)} ${sx(7)} ${sx(40.5)} ${sx(9.68629)} ${sx(40.5)} ${sx(13)}
    V ${sx(32)}
    C ${sx(40.5)} ${sx(35.3137)} ${sx(37.8137)} ${sx(38)} ${sx(34.5)} ${sx(38)}
    H ${sx(24.75)}
    L ${sx(22.125)} ${sx(41.25)}
    C ${sx(21.2452)} ${sx(42.3685)} ${sx(19.9199)} ${sx(43.0048)} ${sx(18.5)} ${sx(43)}
    H ${sx(19.5)} Z
  `.replace(/\s+/g, " ").trim();

  const lineW = Math.max(2, Math.round((2.4 / 48) * innerSize));
  const dotR = Math.max(2, Math.round((1.5 / 48) * innerSize));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${bgCorner}" ry="${bgCorner}" fill="${PRIMARY}"/>
  <path d="${whiteBubble}" fill="white"/>
  <line x1="${sx(16.5)}" y1="${sx(18)}" x2="${sx(31.5)}" y2="${sx(18)}" stroke="${PRIMARY}" stroke-width="${lineW}" stroke-linecap="round"/>
  <line x1="${sx(16.5)}" y1="${sx(24.5)}" x2="${sx(27)}" y2="${sx(24.5)}" stroke="${PRIMARY}" stroke-width="${lineW}" stroke-linecap="round"/>
  <circle cx="${sx(13.5)}" cy="${sx(31)}" r="${dotR}" fill="${PRIMARY}"/>
</svg>`;

  const buffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toBuffer();

  const filePath = path.join(__dirname, "public", `pwa-${size}x${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Created ${filePath} (${size}x${size})`);

  const svgPath = path.join(__dirname, "public", `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Saved SVG reference: ${svgPath}`);
  return svg;
};

let masterSvg = null;

(async () => {
  const s192 = await createIcon(192);
  const s512 = await createIcon(512);
  masterSvg = s512;

  const faviconSize = 64;
  const favicon = 64;
  const favPadding = Math.max(4, Math.round(favicon * 0.08));
  const favCorner = Math.round(favicon * 0.28);
  const fInner = favicon - favPadding * 2;
  const fx = (v) => Math.round((v / 48) * fInner + favPadding);
  const fLineW = Math.max(2, Math.round((2.4 / 48) * fInner));
  const fDotR = Math.max(1, Math.round((1.5 / 48) * fInner));
  const fBubble = `M${fx(19.5)} ${fx(42)}C${fx(17.8431)} ${fx(42)} ${fx(16.5)} ${fx(40.6569)} ${fx(16.5)} ${fx(39)}V${fx(38)}H${fx(13.5)}C${fx(10.1863)} ${fx(38)} ${fx(7.5)} ${fx(35.3137)} ${fx(7.5)} ${fx(32)}V${fx(13)}C${fx(7.5)} ${fx(9.68629)} ${fx(10.1863)} ${fx(7)} ${fx(13.5)} ${fx(7)}H${fx(34.5)}C${fx(37.8137)} ${fx(7)} ${fx(40.5)} ${fx(9.68629)} ${fx(40.5)} ${fx(13)}V${fx(32)}C${fx(40.5)} ${fx(35.3137)} ${fx(37.8137)} ${fx(38)} ${fx(34.5)} ${fx(38)}H${fx(24.75)}L${fx(22.125)} ${fx(41.25)}C${fx(21.2452)} ${fx(42.3685)} ${fx(19.9199)} ${fx(43.0048)} ${fx(18.5)} ${fx(43)}H${fx(19.5)}Z`;

  const favSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${favicon}" height="${favicon}" viewBox="0 0 ${favicon} ${favicon}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${favicon}" height="${favicon}" rx="${favCorner}" ry="${favCorner}" fill="${PRIMARY}"/>
  <path d="${fBubble}" fill="white"/>
  <line x1="${fx(16.5)}" y1="${fx(18)}" x2="${fx(31.5)}" y2="${fx(18)}" stroke="${PRIMARY}" stroke-width="${fLineW}" stroke-linecap="round"/>
  <line x1="${fx(16.5)}" y1="${fx(24.5)}" x2="${fx(27)}" y2="${fx(24.5)}" stroke="${PRIMARY}" stroke-width="${fLineW}" stroke-linecap="round"/>
  <circle cx="${fx(13.5)}" cy="${fx(31)}" r="${fDotR}" fill="${PRIMARY}"/>
</svg>`;

  const favPng = await sharp({
    create: { width: favicon, height: favicon, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: Buffer.from(favSvg) }])
    .png()
    .toBuffer();

  const favPath = path.join(__dirname, "public", "favicon.png");
  fs.writeFileSync(favPath, favPng);
  console.log(`✓ Created favicon (${favicon}x${favicon})`);

  fs.writeFileSync(path.join(__dirname, "public", "app-icon.svg"), masterSvg);
  console.log("✓ Saved app-icon.svg (512x512 master reference)");
})();
