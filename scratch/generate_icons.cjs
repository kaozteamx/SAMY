const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'favicon.svg');
const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  try {
    // Generate 192x192
    await sharp(input)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    
    // Generate 512x512
    await sharp(input)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
      
    // Generate Maskable 512x512 (with padding)
    await sharp(input)
      .resize(384, 384) // Resize smaller to leave room for the mask
      .extend({
        top: 64, bottom: 64, left: 64, right: 64,
        background: { r: 124, g: 58, b: 237, alpha: 1 } // #7C3AED
      })
      .png()
      .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));

    console.log('Icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
