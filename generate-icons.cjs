// Generates simple Keyro extension icons as PNGs
// Uses Node.js built-in modules only
const { createWriteStream } = require('fs');
const { deflateSync } = require('zlib');
const path = require('path');

function createPNG(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const r = size * 0.42; // outer radius for rounded square
  const cornerR = size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Rounded rectangle check
      const inRect = isInRoundedRect(x, y, cx - r, cy - r, r * 2, r * 2, cornerR);
      
      if (inRect) {
        // Check if in key shape (white)
        const inKey = isInKeyShape(x, y, cx, cy, size);
        if (inKey) {
          pixels[idx] = 255; pixels[idx+1] = 255; pixels[idx+2] = 255; pixels[idx+3] = 255;
        } else {
          // Blue background #2F6DF6
          pixels[idx] = 47; pixels[idx+1] = 109; pixels[idx+2] = 246; pixels[idx+3] = 255;
        }
      } else {
        // Transparent
        pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0; pixels[idx+3] = 0;
      }
    }
  }
  return encodePNG(size, size, pixels);
}

function isInRoundedRect(px, py, rx, ry, rw, rh, cr) {
  if (px < rx || px > rx + rw || py < ry || py > ry + rh) return false;
  // Check corners
  const corners = [
    [rx + cr, ry + cr],
    [rx + rw - cr, ry + cr],
    [rx + cr, ry + rh - cr],
    [rx + rw - cr, ry + rh - cr],
  ];
  for (const [ccx, ccy] of corners) {
    if ((px < rx + cr || px > rx + rw - cr) && (py < ry + cr || py > ry + rh - cr)) {
      const dx = px - ccx, dy = py - ccy;
      if (Math.sqrt(dx*dx + dy*dy) > cr) return false;
    }
  }
  return true;
}

function isInKeyShape(px, py, cx, cy, size) {
  const s = size / 24; // scale factor
  // Key head (circle)
  const headCx = cx, headCy = cy - 2.5 * s;
  const headR = 3.5 * s;
  const dx = px - headCx, dy = py - headCy;
  const distHead = Math.sqrt(dx*dx + dy*dy);
  
  // Outer circle of key head
  if (distHead <= headR && distHead >= headR - 1.2 * s) return true;
  
  // Keyhole dot in center
  const dotR = 1.2 * s;
  if (distHead <= dotR) return true;
  
  // Key shaft
  const shaftW = 1.2 * s;
  const shaftTop = cy + 0.5 * s;
  const shaftBottom = cy + 6 * s;
  if (px >= cx - shaftW/2 && px <= cx + shaftW/2 && py >= shaftTop && py <= shaftBottom) return true;
  
  // Key teeth
  const tooth1Y = cy + 3.5 * s;
  const tooth2Y = cy + 5 * s;
  const toothLen = 2 * s;
  const toothH = 1 * s;
  if (py >= tooth1Y && py <= tooth1Y + toothH && px >= cx + shaftW/2 && px <= cx + shaftW/2 + toothLen) return true;
  if (py >= tooth2Y && py <= tooth2Y + toothH && px >= cx + shaftW/2 && px <= cx + shaftW/2 + toothLen * 0.7) return true;

  return false;
}

function encodePNG(w, h, pixels) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  
  // Raw image data with filter bytes
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // no filter
    pixels.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4);
  }
  
  const compressed = deflateSync(raw);
  
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type);
  const crcData = Buffer.concat([typeB, data]);
  const crc = crc32(crcData);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc >>> 0);
  return Buffer.concat([len, typeB, data, crcB]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return ~crc;
}

const sizes = [16, 32, 48, 128];
const outDir = path.join(__dirname, 'src', 'assets', 'icons');

for (const size of sizes) {
  const png = createPNG(size);
  const filePath = path.join(outDir, `icon-${size}.png`);
  require('fs').writeFileSync(filePath, png);
  console.log(`Created ${filePath} (${png.length} bytes)`);
}
