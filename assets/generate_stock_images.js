import fs from 'fs';
import path from 'path';

const images = [
  {
    id: 'cosmic-nebula',
    title: 'Cosmic Nebula',
    category: 'gradients',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <radialGradient id="c1" cx="20%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="60%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </radialGradient>
        <radialGradient id="c2" cx="80%" cy="70%" r="60%">
          <stop offset="0%" stop-color="#EC4899" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#c1)"/>
      <rect width="1200" height="800" fill="url(#c2)"/>
      <circle cx="300" cy="200" r="140" fill="#C084FC" opacity="0.4" filter="blur(50px)"/>
      <circle cx="900" cy="550" r="180" fill="#F43F5E" opacity="0.3" filter="blur(60px)"/>
      <circle cx="600" cy="400" r="2" fill="#fff" opacity="0.9"/>
      <circle cx="350" cy="150" r="1.5" fill="#fff" opacity="0.8"/>
      <circle cx="850" cy="250" r="2" fill="#fff" opacity="0.9"/>
      <circle cx="200" cy="650" r="2.5" fill="#fff" opacity="0.7"/>
      <circle cx="1050" cy="450" r="1.5" fill="#fff" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpunk Grid',
    category: 'abstract',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#090A0F"/>
          <stop offset="60%" stop-color="#180B2B"/>
          <stop offset="100%" stop-color="#2D0B42"/>
        </linearGradient>
        <linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="50%" stop-color="#FB923C"/>
          <stop offset="100%" stop-color="#FBBF24"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <circle cx="600" cy="380" r="180" fill="url(#sun)"/>
      <!-- Sun stripes -->
      <line x1="420" y1="360" x2="780" y2="360" stroke="#090A0F" stroke-width="6"/>
      <line x1="430" y1="385" x2="770" y2="385" stroke="#090A0F" stroke-width="10"/>
      <line x1="450" y1="415" x2="750" y2="415" stroke="#090A0F" stroke-width="14"/>
      <line x1="490" y1="450" x2="710" y2="450" stroke="#090A0F" stroke-width="20"/>
      <!-- Grid floor -->
      <path d="M0 450 L1200 450 L1200 800 L0 800 Z" fill="#070312"/>
      <line x1="0" y1="450" x2="1200" y2="450" stroke="#06B6D4" stroke-width="3"/>
      <!-- Perspective lines -->
      <line x1="600" y1="450" x2="0" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="200" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="400" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="600" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="800" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="1000" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="600" y1="450" x2="1200" y2="800" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <!-- Horizontal grid steps -->
      <line x1="0" y1="470" x2="1200" y2="470" stroke="#06B6D4" stroke-width="1" opacity="0.4"/>
      <line x1="0" y1="500" x2="1200" y2="500" stroke="#06B6D4" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="545" x2="1200" y2="545" stroke="#06B6D4" stroke-width="1.2" opacity="0.6"/>
      <line x1="0" y1="610" x2="1200" y2="610" stroke="#06B6D4" stroke-width="1.5" opacity="0.7"/>
      <line x1="0" y1="700" x2="1200" y2="700" stroke="#06B6D4" stroke-width="2" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'sunset-minimal',
    title: 'Sunset Dune',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FD7E14"/>
          <stop offset="60%" stop-color="#FAB005"/>
          <stop offset="100%" stop-color="#FFE066"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky)"/>
      <circle cx="600" cy="320" r="140" fill="#FFF3BF" opacity="0.85"/>
      <path d="M0 520 Q350 420 700 500 T1200 480 L1200 800 L0 800 Z" fill="#D9480F"/>
      <path d="M0 600 Q450 540 850 630 T1200 590 L1200 800 L0 800 Z" fill="#9C36B5" opacity="0.85"/>
      <path d="M0 680 Q300 620 600 700 T1200 650 L1200 800 L0 800 Z" fill="#5F3DC4"/>
    </svg>`
  },
  {
    id: 'emerald-geometry',
    title: 'Emerald Luxe',
    category: 'abstract',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#022C22"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#eg)"/>
      <polygon points="100,50 400,20 350,300 50,320" fill="#10B981" opacity="0.15"/>
      <polygon points="500,100 950,50 850,500 400,450" fill="#34D399" opacity="0.2"/>
      <polygon points="200,400 700,350 600,750 150,700" fill="#6EE7B7" opacity="0.1"/>
      <polygon points="750,300 1150,250 1100,700 700,650" fill="#A7F3D0" opacity="0.12"/>
      <circle cx="600" cy="400" r="280" fill="none" stroke="#FDE047" stroke-width="2" opacity="0.3"/>
      <circle cx="600" cy="400" r="340" fill="none" stroke="#FDE047" stroke-width="1" stroke-dasharray="8 8" opacity="0.2"/>
    </svg>`
  },
  {
    id: 'aurora-borealis',
    title: 'Northern Lights',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <linearGradient id="darknight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <radialGradient id="aurora1" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#2DD4BF" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="aurora2" cx="70%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#A855F7" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#darknight)"/>
      <path d="M0 200 Q300 100 600 250 T1200 150 L1200 600 Q900 450 600 550 T0 500 Z" fill="url(#aurora1)" filter="blur(40px)"/>
      <path d="M0 300 Q400 180 800 320 T1200 280 L1200 700 Q800 600 400 680 T0 600 Z" fill="url(#aurora2)" filter="blur(50px)"/>
      <!-- Mountain silhouettes -->
      <polygon points="0,800 150,550 350,800" fill="#090D16"/>
      <polygon points="250,800 450,480 700,800" fill="#0B132B"/>
      <polygon points="600,800 850,520 1050,800" fill="#090D16"/>
      <polygon points="950,800 1150,580 1200,800" fill="#0B132B"/>
    </svg>`
  },
  {
    id: 'studio-minimal',
    title: 'Clean Pastel Podiums',
    category: 'gradients',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
      <defs>
        <linearGradient id="wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#wall)"/>
      <!-- Sun circle reflection -->
      <circle cx="600" cy="300" r="220" fill="#E0E7FF" opacity="0.6"/>
      <!-- Floor shadow -->
      <ellipse cx="600" cy="620" rx="260" ry="24" fill="#94A3B8" opacity="0.25"/>
      <!-- Cylinder pedestal -->
      <rect x="420" y="440" width="360" height="180" rx="20" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
      <ellipse cx="600" cy="440" rx="180" ry="32" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <!-- Accent sphere -->
      <circle cx="820" cy="520" r="50" fill="#F472B6"/>
      <ellipse cx="820" cy="580" rx="40" ry="8" fill="#94A3B8" opacity="0.3"/>
    </svg>`
  }
];

fs.writeFileSync(path.join('assets', 'images', 'images.json'), JSON.stringify(images.map(img => ({
  id: img.id,
  title: img.title,
  category: img.category,
  path: `/assets/images/${img.id}.svg`
})), null, 2));

for (const img of images) {
  fs.writeFileSync(path.join('assets', 'images', `${img.id}.svg`), img.svg.trim());
}

console.log(`Created ${images.length} stock images.`);
