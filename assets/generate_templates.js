import fs from 'fs';
import path from 'path';

const templates = [
  {
    id: 'flash-sale-post',
    title: 'Flash Sale Promo',
    category: 'social',
    width: 800,
    height: 800,
    thumbnail: '/assets/images/cosmic-nebula.svg',
    canvas_json: JSON.stringify({
      version: '5.3.0',
      background: '#0F172A',
      objects: [
        {
          type: 'rect',
          left: 40,
          top: 40,
          width: 720,
          height: 720,
          rx: 24,
          ry: 24,
          fill: '#1E293B',
          stroke: '#3B82F6',
          strokeWidth: 4,
          selectable: true
        },
        {
          type: 'i-text',
          text: 'EXCLUSIVE OFFER',
          left: 400,
          top: 140,
          originX: 'center',
          originY: 'center',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#38BDF8',
          fontFamily: 'Inter',
          charSpacing: 250
        },
        {
          type: 'i-text',
          text: 'SUMMER MEGA SALE',
          left: 400,
          top: 240,
          originX: 'center',
          originY: 'center',
          fontSize: 54,
          fontWeight: '900',
          fill: '#FFFFFF',
          fontFamily: 'Outfit',
          textAlign: 'center'
        },
        {
          type: 'i-text',
          text: 'UP TO 70% OFF ON ALL ITEMS',
          left: 400,
          top: 320,
          originX: 'center',
          originY: 'center',
          fontSize: 20,
          fontWeight: '600',
          fill: '#94A3B8',
          fontFamily: 'Inter'
        },
        {
          type: 'rect',
          left: 400,
          top: 460,
          originX: 'center',
          originY: 'center',
          width: 260,
          height: 64,
          rx: 32,
          ry: 32,
          fill: '#EC4899',
          stroke: '#F472B6',
          strokeWidth: 2
        },
        {
          type: 'i-text',
          text: 'SHOP NOW ➔',
          left: 400,
          top: 460,
          originX: 'center',
          originY: 'center',
          fontSize: 22,
          fontWeight: 'bold',
          fill: '#FFFFFF',
          fontFamily: 'Inter'
        },
        {
          type: 'i-text',
          text: 'Limited time offer · Use code SUMMER2026',
          left: 400,
          top: 600,
          originX: 'center',
          originY: 'center',
          fontSize: 16,
          fontWeight: '400',
          fill: '#64748B',
          fontFamily: 'Inter'
        }
      ]
    })
  },
  {
    id: 'youtube-thumbnail-tech',
    title: 'Rust Masterclass Thumbnail',
    category: 'youtube',
    width: 1280,
    height: 720,
    thumbnail: '/assets/images/cyberpunk-neon.svg',
    canvas_json: JSON.stringify({
      version: '5.3.0',
      background: '#090A0F',
      objects: [
        {
          type: 'rect',
          left: 40,
          top: 40,
          width: 1200,
          height: 640,
          rx: 16,
          ry: 16,
          fill: '#13111C',
          stroke: '#F43F5E',
          strokeWidth: 3
        },
        {
          type: 'rect',
          left: 80,
          top: 100,
          width: 260,
          height: 48,
          rx: 10,
          ry: 10,
          fill: '#F43F5E'
        },
        {
          type: 'i-text',
          text: 'FULL COURSE 2026',
          left: 210,
          top: 124,
          originX: 'center',
          originY: 'center',
          fontSize: 18,
          fontWeight: '900',
          fill: '#FFFFFF',
          fontFamily: 'Inter'
        },
        {
          type: 'i-text',
          text: 'BUILD A FULL-STACK APP\nENTIRELY IN RUST',
          left: 80,
          top: 280,
          fontSize: 68,
          fontWeight: '900',
          fill: '#FFFFFF',
          fontFamily: 'Outfit',
          lineHeight: 1.1
        },
        {
          type: 'i-text',
          text: 'Axum · SQLite · WebAssembly · Zero Config',
          left: 80,
          top: 490,
          fontSize: 28,
          fontWeight: '600',
          fill: '#38BDF8',
          fontFamily: 'Inter'
        },
        {
          type: 'rect',
          left: 920,
          top: 360,
          originX: 'center',
          originY: 'center',
          width: 320,
          height: 320,
          rx: 40,
          ry: 40,
          fill: '#1E1B4B',
          stroke: '#6366F1',
          strokeWidth: 4
        },
        {
          type: 'i-text',
          text: '🦀 100%',
          left: 920,
          top: 320,
          originX: 'center',
          originY: 'center',
          fontSize: 52,
          fontWeight: '900',
          fill: '#F97316',
          fontFamily: 'Inter'
        },
        {
          type: 'i-text',
          text: 'BLAZING FAST',
          left: 920,
          top: 400,
          originX: 'center',
          originY: 'center',
          fontSize: 24,
          fontWeight: '900',
          fill: '#FFFFFF',
          fontFamily: 'Outfit'
        }
      ]
    })
  },
  {
    id: 'quote-card',
    title: 'Minimalist Quote Card',
    category: 'social',
    width: 800,
    height: 800,
    thumbnail: '/assets/images/emerald-geometry.svg',
    canvas_json: JSON.stringify({
      version: '5.3.0',
      background: '#064E3B',
      objects: [
        {
          type: 'circle',
          left: 400,
          top: 400,
          originX: 'center',
          originY: 'center',
          radius: 340,
          fill: 'transparent',
          stroke: '#34D399',
          strokeWidth: 2
        },
        {
          type: 'i-text',
          text: '“',
          left: 400,
          top: 220,
          originX: 'center',
          originY: 'center',
          fontSize: 120,
          fontWeight: '900',
          fill: '#FDE047',
          fontFamily: 'Playfair Display'
        },
        {
          type: 'i-text',
          text: 'Simplicity is\nthe ultimate\nsophistication.',
          left: 400,
          top: 390,
          originX: 'center',
          originY: 'center',
          fontSize: 48,
          fontWeight: '700',
          fill: '#ECFDF5',
          fontFamily: 'Playfair Display',
          textAlign: 'center',
          lineHeight: 1.3
        },
        {
          type: 'i-text',
          text: '— LEONARDO DA VINCI',
          left: 400,
          top: 570,
          originX: 'center',
          originY: 'center',
          fontSize: 18,
          fontWeight: '700',
          fill: '#A7F3D0',
          fontFamily: 'Inter',
          charSpacing: 200
        }
      ]
    })
  }
];

fs.writeFileSync(path.join('assets', 'templates', 'templates.json'), JSON.stringify(templates, null, 2));

for (const t of templates) {
  fs.writeFileSync(path.join('assets', 'templates', `${t.id}.json`), t.canvas_json);
}

console.log(`Created ${templates.length} templates.`);
