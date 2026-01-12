# Generate PWA Icons

To generate PNG icons from the SVG logo, you can use various methods:

## Option 1: Use an online tool

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload `/public/VozenPark_logo.svg`
3. Download and extract icons to `/public/icons/`

## Option 2: Use Sharp (Node.js)

Install Sharp:
```bash
npm install sharp
```

Create `scripts/generate-icons.js`:
```javascript
const sharp = require('sharp');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/VozenPark_logo.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
  
  // Favicon sizes
  await sharp(svgPath).resize(16, 16).png().toFile(path.join(outputDir, 'favicon-16.png'));
  await sharp(svgPath).resize(32, 32).png().toFile(path.join(outputDir, 'favicon-32.png'));
  
  // Apple touch icon
  await sharp(svgPath).resize(180, 180).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
  
  // Maskable icon (with padding for safe area)
  await sharp(svgPath)
    .resize(400, 400) // Logo at 80% of 512
    .extend({
      top: 56,
      bottom: 56,
      left: 56,
      right: 56,
      background: { r: 26, g: 115, b: 232, alpha: 1 } // Primary blue
    })
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'maskable-512.png'));
    
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
```

Run:
```bash
node scripts/generate-icons.js
```

## Option 3: Use ImageMagick

```bash
# Install ImageMagick
brew install imagemagick

# Generate icons
cd public
for size in 16 32 72 96 128 144 152 192 384 512; do
  convert VozenPark_logo.svg -resize ${size}x${size} icons/icon-${size}.png
done

# Apple touch icon
convert VozenPark_logo.svg -resize 180x180 icons/apple-touch-icon.png

# Favicons
convert VozenPark_logo.svg -resize 16x16 icons/favicon-16.png
convert VozenPark_logo.svg -resize 32x32 icons/favicon-32.png
```

## Required Icons

After generation, ensure these files exist in `/public/icons/`:

- `icon-72.png` (72x72)
- `icon-96.png` (96x96)
- `icon-128.png` (128x128)
- `icon-144.png` (144x144)
- `icon-152.png` (152x152)
- `icon-192.png` (192x192)
- `icon-384.png` (384x384)
- `icon-512.png` (512x512)
- `maskable-512.png` (512x512 with safe area padding)
- `apple-touch-icon.png` (180x180)
- `favicon-16.png` (16x16)
- `favicon-32.png` (32x32)
