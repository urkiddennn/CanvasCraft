import fs from 'fs';
import path from 'path';

const stickers = {
  // Badges & Commerce
  'badge-sale.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF416C"/>
        <stop offset="100%" stop-color="#FF4B2B"/>
      </linearGradient>
    </defs>
    <path d="M100 10 L126 36 L162 26 L172 62 L200 88 L188 123 L200 159 L165 174 L149 207 L114 197 L86 207 L70 174 L35 159 L47 123 L35 88 L63 62 L73 26 L109 36 Z" fill="url(#g1)" filter="drop-shadow(0 4px 12px rgba(255,65,108,0.4))"/>
    <text x="100" y="112" font-family="'Inter', sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="2">SALE</text>
    <text x="100" y="136" font-family="'Inter', sans-serif" font-weight="700" font-size="16" fill="#FFE57F" text-anchor="middle">50% OFF</text>
  </svg>`,

  'badge-verified.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="#00D2FF"/>
    <path d="M50 8 L59 17 L72 15 L78 27 L90 32 L91 45 L99 55 L93 66 L95 79 L83 85 L78 97 L65 97 L55 103 L45 97 L32 97 L27 85 L15 79 L17 66 L11 55 L19 45 L20 32 L32 27 L38 15 L51 17 Z" fill="#0072FF"/>
    <path d="M30 52 L43 65 L72 36" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'badge-bestseller.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <circle cx="80" cy="80" r="72" fill="#F7971E" stroke="#FFD200" stroke-width="6"/>
    <polygon points="80,25 97,60 135,65 107,92 114,130 80,112 46,130 53,92 25,65 63,60" fill="#FFE066"/>
    <circle cx="80" cy="80" r="38" fill="#F7971E"/>
    <text x="80" y="86" font-family="sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle">BEST SELLER</text>
  </svg>`,

  'badge-new.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <rect x="10" y="10" width="100" height="100" rx="30" fill="#10B981"/>
    <text x="60" y="70" font-family="sans-serif" font-weight="900" font-size="30" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">NEW!</text>
  </svg>`,

  // Tech & Sparks
  'sparkle-gold.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="#FACC15"/>
    <circle cx="80" cy="20" r="6" fill="#FDE047"/>
    <circle cx="20" cy="80" r="5" fill="#FEF08A"/>
  </svg>`,

  'sparkle-violet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="#8B5CF6"/>
    <circle cx="82" cy="18" r="8" fill="#C4B5FD"/>
    <circle cx="18" cy="82" r="6" fill="#DDD6FE"/>
  </svg>`,

  'rocket.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M40 70 L25 80 L30 65 Z" fill="#EF4444"/>
    <path d="M60 70 L75 80 L70 65 Z" fill="#EF4444"/>
    <path d="M35 65 C35 30 50 10 50 10 C50 10 65 30 65 65 L35 65 Z" fill="#F3F4F6"/>
    <circle cx="50" cy="40" r="8" fill="#3B82F6" stroke="#E5E7EB" stroke-width="2"/>
    <path d="M42 65 L50 90 L58 65 Z" fill="#F59E0B"/>
    <path d="M46 65 L50 82 L54 65 Z" fill="#EF4444"/>
  </svg>`,

  'flame.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M50 10 C60 30 85 45 80 70 C75 90 55 95 50 95 C45 95 25 90 20 70 C15 45 40 30 50 10 Z" fill="#F97316"/>
    <path d="M50 40 C57 52 70 60 67 75 C63 88 53 90 50 90 C47 90 37 88 33 75 C30 60 43 52 50 40 Z" fill="#FBBF24"/>
  </svg>`,

  'heart-3d.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <radialGradient id="hg" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#FF5E62"/>
        <stop offset="100%" stop-color="#FF1361"/>
      </radialGradient>
    </defs>
    <path d="M50 88 C20 68 8 50 8 32 C8 16 20 8 34 8 C42 8 48 13 50 18 C52 13 58 8 66 8 C80 8 92 16 92 32 C92 50 80 68 50 88 Z" fill="url(#hg)"/>
    <ellipse cx="36" cy="24" rx="10" ry="5" transform="rotate(-30 36 24)" fill="rgba(255,255,255,0.4)"/>
  </svg>`,

  'like-thumb.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect x="12" y="42" width="18" height="42" rx="4" fill="#3B82F6"/>
    <path d="M32 46 L32 84 L72 84 C76 84 79 81 80 77 L85 55 C86 51 83 46 78 46 L58 46 C60 38 62 25 57 16 C53 10 46 12 46 20 L40 40 L32 46 Z" fill="#2563EB"/>
  </svg>`,

  // Decorative Shapes & Arrows
  'neon-arrow.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width="120" height="60">
    <defs>
      <linearGradient id="nag" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
    </defs>
    <path d="M10 30 L80 30 M70 12 L105 30 L70 48" fill="none" stroke="url(#nag)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'curved-arrow.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M15 80 C20 30 50 20 80 30" fill="none" stroke="#EC4899" stroke-width="8" stroke-linecap="round"/>
    <path d="M65 15 L85 30 L65 45" fill="none" stroke="#EC4899" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'blob-purple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <path d="M45,-60C58,-52,69,-39,73,-24C78,-9,76,8,70,23C64,38,54,51,41,60C28,69,12,74,-4,79C-20,84,-40,89,-54,81C-68,73,-76,52,-78,33C-80,14,-76,-3,-70,-20C-64,-37,-56,-54,-42,-62C-28,-70,-14,-69,1,-70C16,-71,32,-68,45,-60Z" transform="translate(100 100)" fill="#7C3AED"/>
  </svg>`,

  'blob-cyan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <path d="M38.8,-53C50.2,-46.3,59.3,-34.5,65.3,-20.5C71.3,-6.5,74.2,9.7,69.5,23.8C64.8,37.9,52.5,49.9,38.6,58.8C24.7,67.7,9.2,73.5,-5.9,76.5C-21,79.5,-35.7,79.7,-46.8,71.7C-57.9,63.7,-65.4,47.5,-69.8,31.2C-74.2,14.9,-75.5,-1.5,-71.4,-16.1C-67.3,-30.7,-57.8,-43.5,-45.4,-49.9C-33,-56.3,-17.7,-56.3,-1.2,-54.6C15.3,-52.9,27.4,-59.7,38.8,-53Z" transform="translate(100 100)" fill="#06B6D4"/>
  </svg>`,

  // Emojis
  'emoji-sunglasses.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="#FBBF24"/>
    <path d="M15 42 Q32 36 48 42 L48 48 Q32 60 15 48 Z" fill="#1F2937"/>
    <path d="M52 42 Q68 36 85 42 L85 48 Q68 60 52 48 Z" fill="#1F2937"/>
    <line x1="48" y1="42" x2="52" y2="42" stroke="#1F2937" stroke-width="4"/>
    <path d="M32 68 Q50 82 68 68" fill="none" stroke="#92400E" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'emoji-party.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="#FBBF24"/>
    <path d="M18 20 L40 45 L15 55 Z" fill="#EF4444"/>
    <circle cx="16" cy="18" r="5" fill="#F59E0B"/>
    <path d="M28 35 L22 45 M34 40 L30 50" stroke="#FBBF24" stroke-width="3"/>
    <circle cx="68" cy="48" r="5" fill="#1F2937"/>
    <path d="M34 48 Q40 44 46 48" fill="none" stroke="#1F2937" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 68 Q54 84 70 68" fill="none" stroke="#92400E" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'tag-discount.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="120" height="70">
    <path d="M15 10 L85 10 L115 35 L85 60 L15 60 C10 60 5 55 5 50 L5 20 C5 15 10 10 15 10 Z" fill="#E11D48"/>
    <circle cx="25" cy="35" r="7" fill="#FFFFFF"/>
    <text x="65" y="42" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">OFF</text>
  </svg>`
};

for (const [filename, content] of Object.entries(stickers)) {
  fs.writeFileSync(path.join('assets', 'stickers', filename), content.trim());
}
console.log(`Created ${Object.keys(stickers).length} stickers.`);
