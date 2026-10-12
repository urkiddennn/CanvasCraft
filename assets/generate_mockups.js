import fs from 'fs';
import path from 'path';

const mockups = [
  {
    id: 'phone',
    name: 'iPhone 16 Pro',
    category: 'mobile',
    width: 320,
    height: 640,
    screen: { x: 20, y: 20, width: 280, height: 600, rx: 42 },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 640" width="320" height="640">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2D3748"/>
          <stop offset="50%" stop-color="#1A202C"/>
          <stop offset="100%" stop-color="#171923"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <rect x="15" y="15" width="290" height="610" rx="46" fill="rgba(0,0,0,0.3)" filter="blur(8px)"/>
      <!-- Body outer bezel -->
      <rect x="10" y="10" width="300" height="620" rx="46" fill="url(#bodyGrad)" stroke="#4A5568" stroke-width="3"/>
      <!-- Inner bezel border -->
      <rect x="18" y="18" width="284" height="604" rx="43" fill="none" stroke="#000000" stroke-width="4"/>
      <!-- Speaker & Dynamic Island -->
      <rect x="115" y="32" width="90" height="24" rx="12" fill="#000000"/>
      <circle cx="185" cy="44" r="5" fill="#1A202C"/>
      <!-- Home bar indicator -->
      <rect x="110" y="605" width="100" height="4" rx="2" fill="rgba(255,255,255,0.7)"/>
    </svg>`
  },
  {
    id: 'laptop',
    name: 'MacBook Pro 16"',
    category: 'desktop',
    width: 640,
    height: 400,
    screen: { x: 74, y: 24, width: 492, height: 312, rx: 8 },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400">
      <defs>
        <linearGradient id="laptopLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
      </defs>
      <!-- Lid / Display surround -->
      <rect x="64" y="14" width="512" height="332" rx="14" fill="url(#laptopLid)" stroke="#64748B" stroke-width="2"/>
      <!-- Notch / Camera -->
      <rect x="300" y="14" width="40" height="12" rx="4" fill="#020617"/>
      <circle cx="320" cy="20" r="3" fill="#1E293B"/>
      <!-- Base keyboard plate -->
      <path d="M20 346 L620 346 C630 346 638 354 632 364 L608 376 C604 380 596 382 590 382 L50 382 C44 382 36 380 32 376 L8 364 C2 354 10 346 20 346 Z" fill="#475569" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Trackpad notch -->
      <rect x="270" y="346" width="100" height="6" rx="3" fill="#1E293B"/>
    </svg>`
  },
  {
    id: 'tablet',
    name: 'iPad Pro',
    category: 'tablet',
    width: 440,
    height: 580,
    screen: { x: 25, y: 25, width: 390, height: 530, rx: 16 },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 580" width="440" height="580">
      <!-- Body outer bezel -->
      <rect x="15" y="15" width="410" height="550" rx="24" fill="#1E293B" stroke="#475569" stroke-width="3"/>
      <!-- Camera dot -->
      <circle cx="220" cy="20" r="3" fill="#0F172A"/>
    </svg>`
  },
  {
    id: 'browser',
    name: 'Glass Browser Window',
    category: 'web',
    width: 600,
    height: 400,
    screen: { x: 2, y: 46, width: 596, height: 350, rx: 0 },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
      <!-- Outer Window -->
      <rect x="2" y="2" width="596" height="396" rx="12" fill="#1E293B" stroke="#334155" stroke-width="2"/>
      <!-- Header Bar -->
      <rect x="2" y="2" width="596" height="44" rx="12" fill="#0F172A"/>
      <!-- Window Dots -->
      <circle cx="24" cy="24" r="6" fill="#EF4444"/>
      <circle cx="44" cy="24" r="6" fill="#F59E0B"/>
      <circle cx="64" cy="24" r="6" fill="#10B981"/>
      <!-- Address Bar -->
      <rect x="90" y="12" width="400" height="24" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <text x="110" y="28" font-family="sans-serif" font-size="11" fill="#94A3B8">https://eazegraphics.app</text>
    </svg>`
  },
  {
    id: 'billboard',
    name: 'Minimal Poster / Canvas',
    category: 'print',
    width: 480,
    height: 360,
    screen: { x: 30, y: 30, width: 420, height: 300, rx: 4 },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <!-- Frame border -->
      <rect x="15" y="15" width="450" height="330" rx="6" fill="#0F172A" stroke="#E2E8F0" stroke-width="12" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))"/>
      <!-- Inner matting border -->
      <rect x="28" y="28" width="424" height="304" rx="2" fill="none" stroke="#64748B" stroke-width="2"/>
    </svg>`
  }
];

fs.writeFileSync(path.join('assets', 'mockups', 'mockups.json'), JSON.stringify(mockups, null, 2));

for (const m of mockups) {
  fs.writeFileSync(path.join('assets', 'mockups', `${m.id}.svg`), m.svg.trim());
}

console.log(`Created ${mockups.length} mockups.`);
