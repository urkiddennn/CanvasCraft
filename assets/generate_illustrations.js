import fs from 'fs';
import path from 'path';

const outDir = path.resolve('assets/illustrations');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const illustrations = {
  'startup-launch.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#1E1B4B"/>
      </linearGradient>
      <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#E2E8F0"/>
      </linearGradient>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="60%" stop-color="#EF4444"/>
        <stop offset="100%" stop-color="#DC2626"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#skyGrad)"/>
    <!-- Stars & Sparks -->
    <circle cx="80" cy="70" r="3" fill="#FDE047" opacity="0.8"/>
    <circle cx="420" cy="90" r="2.5" fill="#38BDF8" opacity="0.8"/>
    <circle cx="120" cy="220" r="2" fill="#F472B6" opacity="0.6"/>
    <circle cx="380" cy="280" r="3" fill="#A78BFA" opacity="0.7"/>
    <circle cx="230" cy="60" r="2" fill="#FFFFFF" opacity="0.9"/>
    <!-- Ground / Launch Cloud -->
    <ellipse cx="250" cy="370" rx="180" ry="40" fill="#312E81" opacity="0.6"/>
    <circle cx="210" cy="340" r="45" fill="#4338CA" opacity="0.7"/>
    <circle cx="290" cy="340" r="45" fill="#4338CA" opacity="0.7"/>
    <circle cx="250" cy="320" r="55" fill="#6366F1" opacity="0.8"/>
    <!-- Exhaust Flame -->
    <polygon points="230,240 270,240 250,330" fill="url(#flameGrad)" filter="url(#glow)"/>
    <polygon points="240,240 260,240 250,290" fill="#FEF08A"/>
    <!-- Rocket Main Frame -->
    <g transform="translate(250, 160)">
      <!-- Left Fin -->
      <path d="M-30,40 L-60,70 L-30,65 Z" fill="#EF4444"/>
      <!-- Right Fin -->
      <path d="M30,40 L60,70 L30,65 Z" fill="#EF4444"/>
      <!-- Central Body -->
      <path d="M-30,50 C-30,-20 0,-90 0,-90 C0,-90 30,-20 30,50 Z" fill="url(#rocketBody)"/>
      <!-- Nose Cone Tip -->
      <path d="M-18,-45 C-18,-45 0,-90 0,-90 C0,-90 18,-45 18,-45 Z" fill="#EF4444"/>
      <!-- Porthole Window -->
      <circle cx="0" cy="-10" r="14" fill="#0284C7" stroke="#E0F2FE" stroke-width="4"/>
      <circle cx="-4" cy="-14" r="4" fill="#FFFFFF" opacity="0.7"/>
      <!-- Stripe Accents -->
      <path d="M-28,30 L28,30 L28,40 L-28,40 Z" fill="#6366F1"/>
    </g>
    <!-- Floating Planets -->
    <circle cx="410" cy="120" r="28" fill="#F43F5E" opacity="0.9"/>
    <ellipse cx="410" cy="120" rx="42" ry="10" fill="none" stroke="#FBCFE8" stroke-width="3" transform="rotate(-20, 410, 120)"/>
  </svg>`,

  'creative-design.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgArt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDF4FF"/>
        <stop offset="100%" stop-color="#F5F3FF"/>
      </linearGradient>
      <linearGradient id="paletteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#bgArt)"/>
    <!-- Art Canvas Easel -->
    <polygon points="170,360 185,360 235,160 220,160" fill="#92400E"/>
    <polygon points="330,360 315,360 265,160 280,160" fill="#78350F"/>
    <polygon points="255,140 245,140 245,360 255,360" fill="#B45309"/>
    <!-- White Canvas Board -->
    <rect x="150" y="100" width="200" height="150" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.08))"/>
    <!-- Painting on canvas -->
    <path d="M170,220 C200,160 240,240 270,180 C290,140 330,220 330,220 Z" fill="#818CF8" opacity="0.8"/>
    <circle cx="210" cy="150" r="20" fill="#F43F5E"/>
    <path d="M190,230 L310,230" stroke="#FBBF24" stroke-width="8" stroke-linecap="round"/>
    <!-- Artist Palette -->
    <path d="M340,240 C400,220 440,270 410,320 C380,360 310,330 330,280 C340,260 330,250 340,240 Z" fill="url(#paletteGrad)" filter="drop-shadow(0 8px 16px rgba(217,119,6,0.25))"/>
    <circle cx="360" cy="270" r="10" fill="#EF4444"/>
    <circle cx="390" cy="280" r="10" fill="#3B82F6"/>
    <circle cx="380" cy="310" r="10" fill="#10B981"/>
    <circle cx="345" cy="305" r="10" fill="#8B5CF6"/>
    <!-- Paintbrush -->
    <g transform="translate(370, 210) rotate(-45)">
      <rect x="0" y="0" width="12" height="90" rx="4" fill="#78350F"/>
      <rect x="-2" y="80" width="16" height="20" fill="#94A3B8"/>
      <path d="M0,100 C0,115 6,125 6,125 C6,125 12,115 12,100 Z" fill="#EF4444"/>
    </g>
  </svg>`,

  'team-collaboration.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="tcBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EFF6FF"/>
        <stop offset="100%" stop-color="#DBEAFE"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#tcBg)"/>
    <!-- Meeting Table -->
    <ellipse cx="250" cy="290" rx="170" ry="50" fill="#93C5FD" opacity="0.6"/>
    <ellipse cx="250" cy="280" rx="160" ry="44" fill="#FFFFFF" stroke="#3B82F6" stroke-width="4"/>
    <!-- Laptops on Table -->
    <rect x="220" y="255" width="60" height="30" rx="4" fill="#334155"/>
    <polygon points="210,285 290,285 280,290 220,290" fill="#64748B"/>
    <rect x="140" y="260" width="40" height="22" rx="3" fill="#475569" transform="rotate(15, 160, 270)"/>
    <rect x="320" y="260" width="40" height="22" rx="3" fill="#475569" transform="rotate(-15, 340, 270)"/>
    <!-- Person Left -->
    <circle cx="110" cy="200" r="26" fill="#FBBF24"/>
    <path d="M70,300 C70,240 150,240 150,300 Z" fill="#6366F1"/>
    <!-- Person Right -->
    <circle cx="390" cy="200" r="26" fill="#F87171"/>
    <path d="M350,300 C350,240 430,240 430,300 Z" fill="#10B981"/>
    <!-- Person Center (Top) -->
    <circle cx="250" cy="140" r="28" fill="#FCD34D"/>
    <path d="M205,240 C205,185 295,185 295,240 Z" fill="#F43F5E"/>
    <!-- Idea Bubble -->
    <g transform="translate(250, 75)">
      <circle cx="0" cy="0" r="32" fill="#FDE047" stroke="#F59E0B" stroke-width="3" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"/>
      <path d="M-10,6 L10,6 M-8,12 L8,12 M-5,18 L5,18" stroke="#92400E" stroke-width="3" stroke-linecap="round"/>
      <circle cx="0" cy="-6" r="14" fill="#FEF08A"/>
    </g>
  </svg>`,

  'growth-analytics.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="grBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#10B981"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#grBg)"/>
    <!-- Dashboard Board -->
    <rect x="60" y="60" width="380" height="280" rx="16" fill="#1E293B" stroke="#334155" stroke-width="3"/>
    <!-- Grid Lines -->
    <line x1="90" y1="290" x2="410" y2="290" stroke="#475569" stroke-width="2"/>
    <line x1="90" y1="230" x2="410" y2="230" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="90" y1="170" x2="410" y2="170" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="90" y1="110" x2="410" y2="110" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
    <!-- Bars -->
    <rect x="115" y="210" width="35" height="80" rx="6" fill="#6366F1"/>
    <rect x="175" y="180" width="35" height="110" rx="6" fill="#8B5CF6"/>
    <rect x="235" y="140" width="35" height="150" rx="6" fill="#EC4899"/>
    <rect x="295" y="120" width="35" height="170" rx="6" fill="#F43F5E"/>
    <rect x="355" y="90" width="35" height="200" rx="6" fill="url(#chartGrad)"/>
    <!-- Rising Trend Line -->
    <polyline points="132,200 192,165 252,130 312,105 372,75" fill="none" stroke="#FDE047" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Arrow Head -->
    <polygon points="382,65 365,75 378,88" fill="#FDE047"/>
    <!-- Nodes -->
    <circle cx="132" cy="200" r="6" fill="#FFFFFF"/>
    <circle cx="192" cy="165" r="6" fill="#FFFFFF"/>
    <circle cx="252" cy="130" r="6" fill="#FFFFFF"/>
    <circle cx="312" cy="105" r="6" fill="#FFFFFF"/>
    <circle cx="372" cy="75" r="7" fill="#FFFFFF" stroke="#F59E0B" stroke-width="3"/>
  </svg>`,

  'coding-developer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="codeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181B"/>
        <stop offset="100%" stop-color="#09090B"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#codeBg)"/>
    <!-- Code Editor Window -->
    <rect x="60" y="50" width="380" height="240" rx="12" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>
    <!-- Window Header -->
    <rect x="60" y="50" width="380" height="32" rx="12" fill="#18181B"/>
    <circle cx="85" cy="66" r="5" fill="#EF4444"/>
    <circle cx="102" cy="66" r="5" fill="#F59E0B"/>
    <circle cx="119" cy="66" r="5" fill="#10B981"/>
    <!-- Syntax Lines -->
    <rect x="90" y="105" width="80" height="12" rx="4" fill="#A855F7"/>
    <rect x="180" y="105" width="120" height="12" rx="4" fill="#38BDF8"/>
    <rect x="110" y="130" width="160" height="12" rx="4" fill="#F472B6"/>
    <rect x="110" y="155" width="70" height="12" rx="4" fill="#34D399"/>
    <rect x="190" y="155" width="140" height="12" rx="4" fill="#FBBF24"/>
    <rect x="130" y="180" width="210" height="12" rx="4" fill="#E2E8F0"/>
    <rect x="90" y="210" width="60" height="12" rx="4" fill="#A855F7"/>
    <!-- Developer Character Hands & Laptop -->
    <rect x="160" y="270" width="180" height="70" rx="8" fill="#3F3F46" stroke="#71717A" stroke-width="3"/>
    <path d="M190,340 C190,300 230,290 240,320 Z" fill="#FCD34D"/>
    <path d="M310,340 C310,300 270,290 260,320 Z" fill="#FCD34D"/>
  </svg>`,

  'online-shopping.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="shopBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF7ED"/>
        <stop offset="100%" stop-color="#FFEDD5"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#shopBg)"/>
    <!-- Smartphone Frame -->
    <rect x="175" y="40" width="150" height="300" rx="24" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
    <rect x="185" y="60" width="130" height="260" rx="14" fill="#FFFFFF"/>
    <!-- Store Banner on Screen -->
    <rect x="195" y="80" width="110" height="70" rx="8" fill="#EA580C"/>
    <circle cx="250" cy="115" r="22" fill="#FED7AA"/>
    <!-- Product Grid on Screen -->
    <rect x="195" y="165" width="50" height="50" rx="6" fill="#FDBA74"/>
    <rect x="255" y="165" width="50" height="50" rx="6" fill="#FCA5A5"/>
    <rect x="195" y="225" width="110" height="24" rx="12" fill="#EA580C"/>
    <!-- Shopping Bag Floating Left -->
    <g transform="translate(70, 160)">
      <rect x="0" y="40" width="80" height="90" rx="12" fill="#F97316" filter="drop-shadow(0 10px 15px rgba(249,115,22,0.3))"/>
      <path d="M20,40 C20,10 60,10 60,40" fill="none" stroke="#C2410C" stroke-width="8" stroke-linecap="round"/>
      <polygon points="40,65 52,90 28,90" fill="#FFFFFF"/>
    </g>
    <!-- Gift Box Floating Right -->
    <g transform="translate(350, 180)">
      <rect x="0" y="30" width="80" height="80" rx="10" fill="#10B981" filter="drop-shadow(0 10px 15px rgba(16,185,129,0.3))"/>
      <rect x="0" y="20" width="80" height="18" rx="4" fill="#059669"/>
      <rect x="34" y="20" width="12" height="90" fill="#FDE047"/>
      <!-- Ribbon Bow -->
      <path d="M40,20 C20,0 20,20 40,20 C60,20 60,0 40,20 Z" fill="#F59E0B"/>
    </g>
  </svg>`,

  'ai-assistant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="aiBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090D16"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
      <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="100%" stop-color="#6366F1"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#aiBg)"/>
    <!-- Glowing Grid Circle -->
    <circle cx="250" cy="180" r="120" fill="none" stroke="#1E293B" stroke-width="2"/>
    <circle cx="250" cy="180" r="90" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>
    <!-- Robot Head -->
    <rect x="180" y="100" width="140" height="110" rx="30" fill="url(#neonCyan)"/>
    <rect x="195" y="120" width="110" height="65" rx="18" fill="#0F172A"/>
    <!-- Cyan Glowing Eyes -->
    <ellipse cx="225" cy="150" rx="14" ry="16" fill="#38BDF8"/>
    <circle cx="229" cy="146" r="4" fill="#FFFFFF"/>
    <ellipse cx="275" cy="150" rx="14" ry="16" fill="#38BDF8"/>
    <circle cx="279" cy="146" r="4" fill="#FFFFFF"/>
    <!-- Antenna -->
    <line x1="250" y1="100" x2="250" y2="70" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
    <circle cx="250" cy="65" r="10" fill="#F43F5E"/>
    <!-- Floating Ears -->
    <rect x="165" y="130" width="15" height="35" rx="6" fill="#6366F1"/>
    <rect x="320" y="130" width="15" height="35" rx="6" fill="#6366F1"/>
    <!-- Spark / Brainwave Particles -->
    <path d="M220,240 Q250,220 280,240" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <circle cx="120" cy="110" r="6" fill="#F472B6"/>
    <circle cx="380" cy="120" r="8" fill="#FBBF24"/>
    <circle cx="100" cy="230" r="5" fill="#34D399"/>
    <circle cx="390" cy="240" r="6" fill="#818CF8"/>
  </svg>`,

  'mobile-app.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="mBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F0FDF4"/>
        <stop offset="100%" stop-color="#DCFCE7"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#mBg)"/>
    <!-- Hand Holding Phone -->
    <rect x="180" y="40" width="140" height="280" rx="24" fill="#0F172A" stroke="#334155" stroke-width="4"/>
    <rect x="190" y="60" width="120" height="240" rx="16" fill="#FFFFFF"/>
    <!-- App UI -->
    <circle cx="250" cy="110" r="30" fill="#10B981"/>
    <path d="M240,110 L248,118 L262,102" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="210" y="160" width="80" height="12" rx="4" fill="#047857"/>
    <rect x="220" y="182" width="60" height="8" rx="4" fill="#94A3B8"/>
    <!-- App Cards -->
    <rect x="200" y="210" width="100" height="35" rx="8" fill="#F1F5F9"/>
    <rect x="200" y="255" width="100" height="35" rx="8" fill="#F1F5F9"/>
    <!-- Social Floating Bubbles -->
    <circle cx="110" cy="120" r="32" fill="#EC4899" filter="drop-shadow(0 6px 12px rgba(236,72,153,0.3))"/>
    <path d="M100,120 C100,110 110,110 110,120 C110,110 120,110 120,120 C120,130 110,135 110,135 C110,135 100,130 100,120 Z" fill="#FFFFFF"/>
    <circle cx="390" cy="160" r="30" fill="#3B82F6" filter="drop-shadow(0 6px 12px rgba(59,130,246,0.3))"/>
    <polygon points="385,150 405,160 385,170" fill="#FFFFFF"/>
  </svg>`,

  'celebration.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="celBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEFCE8"/>
        <stop offset="100%" stop-color="#FEF08A"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#celBg)"/>
    <!-- Trophy Cup -->
    <path d="M180,100 L320,100 L300,210 C300,250 200,250 200,210 Z" fill="#F59E0B" filter="drop-shadow(0 12px 20px rgba(245,158,11,0.3))"/>
    <path d="M190,110 L310,110 L292,205 C292,238 208,238 208,205 Z" fill="#FBBF24"/>
    <!-- Trophy Handles -->
    <path d="M180,120 C130,120 130,190 185,190" fill="none" stroke="#D97706" stroke-width="12" stroke-linecap="round"/>
    <path d="M320,120 C370,120 370,190 315,190" fill="none" stroke="#D97706" stroke-width="12" stroke-linecap="round"/>
    <!-- Trophy Stem & Base -->
    <rect x="235" y="240" width="30" height="50" rx="4" fill="#B45309"/>
    <polygon points="190,330 310,330 290,290 210,290" fill="#78350F"/>
    <polygon points="195,325 305,325 288,295 212,295" fill="#92400E"/>
    <!-- Star on Cup -->
    <polygon points="250,140 256,155 272,156 260,167 264,182 250,174 236,182 240,167 228,156 244,155" fill="#FFFFFF"/>
    <!-- Confetti Streamers -->
    <rect x="90" y="80" width="12" height="24" rx="4" fill="#EF4444" transform="rotate(35, 96, 92)"/>
    <rect x="140" y="50" width="10" height="20" rx="3" fill="#3B82F6" transform="rotate(-20, 145, 60)"/>
    <rect x="360" y="70" width="14" height="26" rx="4" fill="#10B981" transform="rotate(45, 367, 83)"/>
    <rect x="410" y="110" width="10" height="22" rx="3" fill="#EC4899" transform="rotate(-30, 415, 121)"/>
    <circle cx="110" cy="180" r="8" fill="#8B5CF6"/>
    <circle cx="390" cy="220" r="8" fill="#F97316"/>
  </svg>`,

  'coffee-chill.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="cofBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDF2F8"/>
        <stop offset="100%" stop-color="#FCE7F3"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#cofBg)"/>
    <!-- Table Surface -->
    <ellipse cx="250" cy="330" rx="190" ry="40" fill="#E2E8F0"/>
    <!-- Saucer Plate -->
    <ellipse cx="250" cy="290" rx="120" ry="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
    <!-- Coffee Mug -->
    <path d="M170,170 L330,170 C330,260 310,285 250,285 C190,285 170,260 170,170 Z" fill="#F43F5E" filter="drop-shadow(0 12px 18px rgba(244,63,94,0.25))"/>
    <ellipse cx="250" cy="170" rx="80" ry="16" fill="#881337"/>
    <!-- Dark Coffee Liquid -->
    <ellipse cx="250" cy="172" rx="72" ry="12" fill="#451A03"/>
    <ellipse cx="230" cy="172" rx="14" ry="4" fill="#78350F" opacity="0.6"/>
    <!-- Mug Handle -->
    <path d="M330,190 C370,190 370,250 325,250" fill="none" stroke="#E11D48" stroke-width="16" stroke-linecap="round"/>
    <!-- Steam Curves -->
    <path d="M220,140 Q210,110 230,80 Q240,60 230,40" fill="none" stroke="#FDA4AF" stroke-width="5" stroke-linecap="round"/>
    <path d="M250,140 Q265,110 245,80 Q235,60 250,40" fill="none" stroke="#FDA4AF" stroke-width="5" stroke-linecap="round"/>
    <path d="M280,140 Q270,110 290,80 Q300,60 285,40" fill="none" stroke="#FDA4AF" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'cyber-security.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="secBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="100%" stop-color="#1D4ED8"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#secBg)"/>
    <!-- Circuit lines in background -->
    <polyline points="50,100 120,100 150,150 180,150" fill="none" stroke="#1E293B" stroke-width="3"/>
    <polyline points="450,100 380,100 350,150 320,150" fill="none" stroke="#1E293B" stroke-width="3"/>
    <polyline points="80,300 150,300 190,260" fill="none" stroke="#1E293B" stroke-width="3"/>
    <polyline points="420,300 350,300 310,260" fill="none" stroke="#1E293B" stroke-width="3"/>
    <!-- Central Shield -->
    <path d="M250,60 L350,110 C350,230 250,310 250,330 C250,310 150,230 150,110 Z" fill="url(#shieldGrad)" filter="drop-shadow(0 15px 30px rgba(59,130,246,0.35))"/>
    <path d="M250,75 L335,118 C335,222 250,292 250,310 C250,292 165,222 165,118 Z" fill="#1E40AF"/>
    <!-- Golden Padlock -->
    <rect x="220" y="180" width="60" height="50" rx="10" fill="#FBBF24"/>
    <path d="M232,180 L232,150 C232,135 268,135 268,150 L268,180" fill="none" stroke="#FDE047" stroke-width="10" stroke-linecap="round"/>
    <circle cx="250" cy="200" r="5" fill="#78350F"/>
    <line x1="250" y1="205" x2="250" y2="218" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'education-learning.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
    <defs>
      <linearGradient id="edBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F0FDFA"/>
        <stop offset="100%" stop-color="#CCFBF1"/>
      </linearGradient>
    </defs>
    <rect width="500" height="400" rx="20" fill="url(#edBg)"/>
    <!-- Stack of Books -->
    <g transform="translate(150, 160)">
      <!-- Bottom Book -->
      <rect x="0" y="110" width="200" height="35" rx="6" fill="#0D9488"/>
      <rect x="180" y="115" width="25" height="25" rx="2" fill="#FFFFFF"/>
      <line x1="10" y1="128" x2="170" y2="128" stroke="#5EEAD4" stroke-width="3"/>
      <!-- Middle Book -->
      <rect x="20" y="70" width="170" height="32" rx="6" fill="#F43F5E"/>
      <line x1="30" y1="86" x2="160" y2="86" stroke="#FDA4AF" stroke-width="3"/>
      <!-- Top Book -->
      <rect x="40" y="32" width="140" height="30" rx="6" fill="#6366F1"/>
      <line x1="50" y1="47" x2="150" y2="47" stroke="#C7D2FE" stroke-width="3"/>
      <!-- Graduation Cap -->
      <polygon points="110,0 20,25 110,48 200,25" fill="#1E293B"/>
      <rect x="80" y="35" width="60" height="18" fill="#0F172A"/>
      <path d="M180,30 L195,55" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      <circle cx="195" cy="58" r="5" fill="#F59E0B"/>
    </g>
    <!-- Diploma Certificate Floating Right -->
    <g transform="translate(340, 90) rotate(15)">
      <rect x="0" y="0" width="80" height="110" rx="8" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.1))"/>
      <line x1="15" y1="25" x2="65" y2="25" stroke="#0D9488" stroke-width="4"/>
      <line x1="15" y1="40" x2="65" y2="40" stroke="#CBD5E1" stroke-width="3"/>
      <line x1="15" y1="55" x2="65" y2="55" stroke="#CBD5E1" stroke-width="3"/>
      <circle cx="40" cy="85" r="12" fill="#F59E0B"/>
      <!-- Ribbon -->
      <polygon points="35,95 40,110 45,95" fill="#EF4444"/>
    </g>
  </svg>`
};

for (const [filename, svg] of Object.entries(illustrations)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, svg.trim(), 'utf8');
}

console.log(`Generated ${Object.keys(illustrations).length} vector illustrations in ${outDir}`);
