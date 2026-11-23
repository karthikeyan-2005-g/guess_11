import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw pixel data: width * 4 + 1 filter byte per row
  const rowLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // No filter

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Dark navy background (#090d16) with orange/cyan border
      const isBorder = x < 8 || x >= width - 8 || y < 8 || y >= height - 8;
      if (isBorder) {
        rawData[pxOffset] = 249; // R (orange)
        rawData[pxOffset + 1] = 115; // G
        rawData[pxOffset + 2] = 22; // B
        rawData[pxOffset + 3] = 255; // A
      } else {
        // Interior #090d16
        rawData[pxOffset] = 9;
        rawData[pxOffset + 1] = 13;
        rawData[pxOffset + 2] = 22;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type), data]));
  chunk.writeInt32BE(crc, 8 + len);

  return chunk;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crc32Table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

const crc32Table = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
  }
  crc32Table[i] = c;
}

const p192 = createPng(192, 192);
fs.writeFileSync('frontend/public/icon-192.png', p192);
console.log('✅ Generated frontend/public/icon-192.png');

const p512 = createPng(512, 512);
fs.writeFileSync('frontend/public/icon-512.png', p512);
console.log('✅ Generated frontend/public/icon-512.png');
