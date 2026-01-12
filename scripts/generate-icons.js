#!/usr/bin/env node
/**
 * Generate PNG icons from SVG logo for PWA manifest
 * Run with: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Installing sharp for image processing...');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

const inputSvg = path.join(__dirname, '../public/VozenPark_logo.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from SVG...\n');

  // Read SVG
  const svgBuffer = fs.readFileSync(inputSvg);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    
    try {
      // Create a square canvas with padding for the icon
      // The logo is wide (480x221), so we need to center it in a square
      const padding = Math.floor(size * 0.1); // 10% padding
      const iconSize = size - (padding * 2);
      
      await sharp(svgBuffer)
        .resize(iconSize, iconSize, { 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${outputPath} (${size}x${size})`);
    } catch (err) {
      console.error(`✗ Failed to generate ${size}x${size}: ${err.message}`);
    }
  }

  // Generate maskable icon (with safe zone padding)
  // Maskable icons should have 10% safe zone on each side
  const maskableSize = 512;
  const maskablePath = path.join(outputDir, 'maskable-512.png');
  
  try {
    const safeZone = Math.floor(maskableSize * 0.2); // 20% total padding (10% each side)
    const iconArea = maskableSize - safeZone;
    
    await sharp(svgBuffer)
      .resize(iconArea, iconArea, { 
        fit: 'contain',
        background: { r: 26, g: 115, b: 232, alpha: 1 } // Brand blue background
      })
      .extend({
        top: Math.floor(safeZone / 2),
        bottom: Math.ceil(safeZone / 2),
        left: Math.floor(safeZone / 2),
        right: Math.ceil(safeZone / 2),
        background: { r: 26, g: 115, b: 232, alpha: 1 }
      })
      .png()
      .toFile(maskablePath);
    
    console.log(`✓ Generated ${maskablePath} (maskable, ${maskableSize}x${maskableSize})`);
  } catch (err) {
    console.error(`✗ Failed to generate maskable icon: ${err.message}`);
  }

  // Generate shortcut icons
  const shortcutIcons = ['shortcut-add', 'shortcut-dashboard', 'shortcut-demo'];
  for (const name of shortcutIcons) {
    const shortcutPath = path.join(outputDir, `${name}.png`);
    try {
      await sharp(svgBuffer)
        .resize(76, 76, { 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .extend({
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(shortcutPath);
      
      console.log(`✓ Generated ${shortcutPath} (96x96 shortcut)`);
    } catch (err) {
      console.error(`✗ Failed to generate shortcut icon: ${err.message}`);
    }
  }

  // Generate favicon.ico alternative (32x32 PNG)
  const favicon32Path = path.join(outputDir, 'favicon-32.png');
  try {
    await sharp(svgBuffer)
      .resize(28, 28, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: 2,
        bottom: 2,
        left: 2,
        right: 2,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(favicon32Path);
    
    console.log(`✓ Generated ${favicon32Path} (32x32 favicon)`);
  } catch (err) {
    console.error(`✗ Failed to generate favicon: ${err.message}`);
  }

  // Generate apple-touch-icon (180x180)
  const appleTouchPath = path.join(outputDir, 'apple-touch-icon.png');
  try {
    const padding = 18;
    await sharp(svgBuffer)
      .resize(144, 144, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for iOS
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(appleTouchPath);
    
    console.log(`✓ Generated ${appleTouchPath} (180x180 apple-touch-icon)`);
  } catch (err) {
    console.error(`✗ Failed to generate apple-touch-icon: ${err.message}`);
  }

  console.log('\n✓ All icons generated successfully!');
  console.log('\nMake sure to add these to your HTML head:');
  console.log('  <link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32">');
  console.log('  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">');
}

generateIcons().catch(console.error);
