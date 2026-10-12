// EazeGraphics Open Asset Engine
// Wikimedia Commons (90M+ media files with origin=* CORS), Openverse, and Iconify (200k+ vectors)

const API = {
  // 1. Photos Engine: Search Wikimedia Commons (90M+ media files, 0 keys, 0 auth)
  async getPhotos(query = 'landscape', page = 1) {
    const rawQ = query && query !== 'Trending' ? query.trim() : 'nature landscape';
    const limit = 28;
    const offset = (page - 1) * limit;

    // Query Wikimedia Commons with namespace=6 (Files)
    try {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(rawQ)}&gsrlimit=${limit}&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      
      if (res.ok) {
        const data = await res.json();
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          const results = [];
          
          for (const p of pages) {
            if (p.imageinfo && p.imageinfo[0]) {
              const info = p.imageinfo[0];
              const url = info.url || '';
              // Ensure it's an image file
              const isImg = /\.(jpe?g|png|webp|svg|gif)(\?|$)/i.test(url);
              if (isImg) {
                const cleanTitle = (p.title || 'Photo')
                  .replace(/^File:/i, '')
                  .replace(/\.[^/.]+$/, '')
                  .replace(/_/g, ' ');

                results.push({
                  id: `wiki-${p.pageid}`,
                  title: cleanTitle,
                  author: 'Wikimedia Commons',
                  thumb: info.thumburl || url,
                  full: url,
                });
              }
            }
          }

          if (results.length > 0) {
            return results;
          }
        }
      }
    } catch (err) {
      console.warn('Wikimedia fetch fallback:', err);
    }

    // Dynamic search fallback in curated stock collection
    return this.getFilteredFallback(rawQ);
  },

  getFilteredFallback(query) {
    const q = query.toLowerCase();
    const bank = this.getCuratedFallbackPhotos();
    const filtered = bank.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    return filtered.length > 0 ? filtered : bank;
  },

  getCuratedFallbackPhotos() {
    return [
      { id: 'f1', title: 'Mountain Lake Reflection', author: 'Alexey Topolyanskiy', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80', full: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85' },
      { id: 'f2', title: 'Cyberpunk Neon Alley', author: 'Aleksandar Pasaric', thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80', full: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=85' },
      { id: 'f3', title: 'Minimalist Architecture', author: 'Simone Hutsch', thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80', full: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=85' },
      { id: 'f4', title: 'Cosmic Nebula Galaxy', author: 'NASA Hub', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', full: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=85' },
      { id: 'f5', title: 'Modern Clean Workspace', author: 'Domenico Loia', thumb: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80', full: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=85' },
      { id: 'f6', title: 'Golden Hour Desert Dune', author: 'Jeremy Bishop', thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80', full: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&q=85' },
      { id: 'f7', title: 'Fluid Iridescent Wave', author: 'DeepMind Labs', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', full: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85' },
      { id: 'f8', title: 'Deep Forest Mist', author: 'Lukasz Szmigiel', thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80', full: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85' },
      { id: 'f9', title: 'Violet Gradient Mesh', author: 'Studio Mesh', thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80', full: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=85' },
      { id: 'f10', title: 'Brutalist Concrete Angle', author: 'Victor Garcia', thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80', full: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85' },
      { id: 'f11', title: 'Keyboard & Coffee Desk', author: 'Bench Accounting', thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', full: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=85' },
      { id: 'f12', title: 'Dark Holographic Foil', author: 'Studio Mesh', thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80', full: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=85' },
    ];
  },

  // 2. Vector Stickers, Icons & Logos: Multi-Engine with Iconify + jsdelivr CDN Fallbacks
  async getStickers(query = 'star', collection = null, limit = 60) {
    // Clean search string
    let cleanQ = (query || 'star')
      .replace(/\b(icon|icons|sticker|stickers|logo|logos|vector|vectors)\b/gi, '')
      .trim() || query || 'star';

    // Map common acronyms and abbreviations
    const synonyms = {
      'ict': 'computer',
      'it': 'technology',
      'tech': 'computer',
      'fb': 'facebook',
      'ig': 'instagram',
      'yt': 'youtube',
      'pc': 'monitor',
      'net': 'network',
      'web': 'globe',
      'pic': 'image',
      'pics': 'image',
      'photo': 'camera',
    };
    const mapped = synonyms[cleanQ.toLowerCase()];
    const searchTerms = mapped ? [mapped, cleanQ] : [cleanQ];

    for (const term of searchTerms) {
      try {
        const prefixParam = collection && collection !== 'all' ? `&prefixes=${encodeURIComponent(collection)}` : '';
        const url = `https://api.iconify.design/search?query=${encodeURIComponent(term)}&limit=${limit}${prefixParam}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.icons && data.icons.length > 0) {
            return data.icons.map(iconStr => {
              const parts = iconStr.split(':');
              const prefix = parts.length === 2 ? parts[0] : (collection || 'tabler');
              const name = parts.length === 2 ? parts[1] : iconStr;
              const directSvg = `https://api.iconify.design/${prefix}/${name}.svg`;
              return {
                id: iconStr,
                name: name.replace(/-/g, ' '),
                collection: prefix,
                // Routed through local proxy to eliminate Edge Tracking Prevention errors
                svg_url: this.proxyUrl(directSvg),
              };
            });
          }
        }
      } catch (err) {
        console.warn(`Iconify online search for "${term}" error:`, err);
      }
    }

    // High-availability CDN Fallback (Lucide + Tabler + SimpleIcons on jsdelivr via local proxy)
    return this.getCdnFallbackIcons(cleanQ);
  },

  getCdnFallbackIcons(query = '') {
    const q = query.toLowerCase();
    const lucideList = [
      'home', 'user', 'heart', 'star', 'check', 'search', 'settings', 'trash-2', 'edit-3', 'bell',
      'mail', 'phone', 'camera', 'image', 'video', 'music', 'mic', 'play', 'pause',
      'monitor', 'laptop', 'smartphone', 'cpu', 'hard-drive', 'wifi', 'code', 'terminal', 'database', 'server',
      'shopping-cart', 'shopping-bag', 'credit-card', 'dollar-sign', 'wallet',
      'calendar', 'clock', 'file-text', 'folder', 'paperclip', 'bookmark', 'tag',
      'compass', 'map-pin', 'globe', 'sun', 'moon', 'cloud', 'zap', 'sparkles', 'flame', 'shield',
      'lock', 'unlock', 'eye', 'refresh-cw', 'share-2', 'download', 'upload', 'link', 'layers', 'sliders'
    ];

    const simpleIconsList = [
      'facebook', 'instagram', 'youtube', 'github', 'linkedin', 'tiktok', 'discord', 'slack',
      'whatsapp', 'telegram', 'apple', 'google', 'rust', 'react', 'python', 'javascript'
    ];

    const results = [];

    // Filter Lucide icons
    for (const name of lucideList) {
      if (!q || name.includes(q) || (q === 'house' && name === 'home') || (q === 'ict' && ['monitor', 'laptop', 'server', 'cpu', 'wifi'].includes(name))) {
        const rawUrl = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`;
        results.push({
          id: `lucide:${name}`,
          name: name.replace(/-/g, ' '),
          collection: 'lucide',
          svg_url: this.proxyUrl(rawUrl),
        });
      }
    }

    // Filter SimpleIcons brand icons
    for (const name of simpleIconsList) {
      if (!q || name.includes(q) || (q === 'ict' && ['github', 'rust', 'python', 'react'].includes(name))) {
        const rawUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${name}.svg`;
        results.push({
          id: `simple-icons:${name}`,
          name: name,
          collection: 'brands',
          svg_url: this.proxyUrl(rawUrl),
        });
      }
    }

    return results.length > 0 ? results : lucideList.slice(0, 30).map(name => {
      const rawUrl = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`;
      return {
        id: `lucide:${name}`,
        name: name.replace(/-/g, ' '),
        collection: 'lucide',
        svg_url: this.proxyUrl(rawUrl),
      };
    });
  },

  // 3. Online Vector Illustrations: Dynamic search via Wikimedia Commons SVG (5M+ vector files) + Iconify Art
  async getIllustrations(query = 'startup', page = 1) {
    const rawQ = query && query !== 'Trending' ? query.trim() : 'illustration';
    const limit = 28;
    const offset = (page - 1) * limit;
    const results = [];

    // 1. Wikimedia Commons free SVG search (Millions of vector illustrations with origin=* CORS)
    try {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(rawQ)}+filetype:svg&gsrlimit=${limit}&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          for (const p of pages) {
            if (p.imageinfo && p.imageinfo[0]) {
              const info = p.imageinfo[0];
              const fullUrl = info.url || '';
              if (/\.svg(\?|$)/i.test(fullUrl)) {
                const cleanTitle = (p.title || 'Illustration')
                  .replace(/^File:/i, '')
                  .replace(/\.svg$/i, '')
                  .replace(/_/g, ' ');

                results.push({
                  id: `wiki-svg-${p.pageid}`,
                  title: cleanTitle,
                  author: 'Wikimedia Commons',
                  thumb: this.proxyUrl(info.thumburl || fullUrl),
                  svg_url: this.proxyUrl(fullUrl),
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Wikimedia illustration search error:', err);
    }

    // 2. Iconify Rich Vector Illustration Collections (openmoji, noto-v1, flat-color-icons)
    try {
      const icoUrl = `https://api.iconify.design/search?query=${encodeURIComponent(rawQ)}&limit=24&prefixes=openmoji,noto-v1,flat-color-icons,twemoji`;
      const res = await fetch(icoUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.icons && data.icons.length > 0) {
          for (const iconStr of data.icons) {
            const parts = iconStr.split(':');
            const prefix = parts[0];
            const name = parts[1] || iconStr;
            const fullUrl = `https://api.iconify.design/${prefix}/${name}.svg`;
            results.push({
              id: iconStr,
              title: name.replace(/-/g, ' '),
              author: prefix,
              thumb: this.proxyUrl(fullUrl),
              svg_url: this.proxyUrl(fullUrl),
            });
          }
        }
      }
    } catch (err) {
      console.warn('Iconify illustration search error:', err);
    }

    // 3. Fallback / Curated Scene Illustrations
    if (results.length === 0) {
      return this.getFallbackIllustrations(rawQ);
    }

    return results;
  },

  getFallbackIllustrations(query = '') {
    const q = (query || '').toLowerCase();
    const curated = [
      { id: 'ill-startup', title: 'Startup Rocket Launch', author: 'EazeGraphics', svg_url: '/assets/illustrations/startup-launch.svg', thumb: '/assets/illustrations/startup-launch.svg' },
      { id: 'ill-design', title: 'Creative Designer Canvas', author: 'EazeGraphics', svg_url: '/assets/illustrations/creative-design.svg', thumb: '/assets/illustrations/creative-design.svg' },
      { id: 'ill-team', title: 'Team Collaboration Meeting', author: 'EazeGraphics', svg_url: '/assets/illustrations/team-collaboration.svg', thumb: '/assets/illustrations/team-collaboration.svg' },
      { id: 'ill-growth', title: 'Growth Analytics Dashboard', author: 'EazeGraphics', svg_url: '/assets/illustrations/growth-analytics.svg', thumb: '/assets/illustrations/growth-analytics.svg' },
      { id: 'ill-code', title: 'Software Developer Coding', author: 'EazeGraphics', svg_url: '/assets/illustrations/coding-developer.svg', thumb: '/assets/illustrations/coding-developer.svg' },
      { id: 'ill-shop', title: 'Online Mobile Shopping', author: 'EazeGraphics', svg_url: '/assets/illustrations/online-shopping.svg', thumb: '/assets/illustrations/online-shopping.svg' },
      { id: 'ill-ai', title: 'AI Robot Assistant', author: 'EazeGraphics', svg_url: '/assets/illustrations/ai-assistant.svg', thumb: '/assets/illustrations/ai-assistant.svg' },
      { id: 'ill-app', title: 'Mobile App Interface', author: 'EazeGraphics', svg_url: '/assets/illustrations/mobile-app.svg', thumb: '/assets/illustrations/mobile-app.svg' },
      { id: 'ill-cel', title: 'Success Trophy Celebration', author: 'EazeGraphics', svg_url: '/assets/illustrations/celebration.svg', thumb: '/assets/illustrations/celebration.svg' },
      { id: 'ill-coffee', title: 'Coffee Break Chill', author: 'EazeGraphics', svg_url: '/assets/illustrations/coffee-chill.svg', thumb: '/assets/illustrations/coffee-chill.svg' },
      { id: 'ill-sec', title: 'Cybersecurity Shield', author: 'EazeGraphics', svg_url: '/assets/illustrations/cyber-security.svg', thumb: '/assets/illustrations/cyber-security.svg' },
      { id: 'ill-edu', title: 'Education & Learning Diploma', author: 'EazeGraphics', svg_url: '/assets/illustrations/education-learning.svg', thumb: '/assets/illustrations/education-learning.svg' },
    ];
    const filtered = curated.filter(item => item.title.toLowerCase().includes(q));
    return filtered.length > 0 ? filtered : curated;
  },

  // 3. Mockups Catalog
  async getMockups() {
    return [
      {
        id: 'phone',
        name: 'iPhone 16 Pro',
        category: 'mobile',
        width: 320,
        height: 640,
        screen: { x: 20, y: 20, width: 280, height: 600, rx: 42 },
        frame_url: '/assets/mockups/phone.svg',
      },
      {
        id: 'laptop',
        name: 'MacBook Pro 16"',
        category: 'desktop',
        width: 640,
        height: 400,
        screen: { x: 74, y: 24, width: 492, height: 312, rx: 8 },
        frame_url: '/assets/mockups/laptop.svg',
      },
      {
        id: 'tablet',
        name: 'iPad Pro',
        category: 'tablet',
        width: 440,
        height: 580,
        screen: { x: 25, y: 25, width: 390, height: 530, rx: 16 },
        frame_url: '/assets/mockups/tablet.svg',
      },
      {
        id: 'browser',
        name: 'Safari Glass Window',
        category: 'web',
        width: 600,
        height: 400,
        screen: { x: 2, y: 46, width: 596, height: 350, rx: 0 },
        frame_url: '/assets/mockups/browser.svg',
      },
      {
        id: 'billboard',
        name: 'Minimal Canvas Poster',
        category: 'print',
        width: 480,
        height: 360,
        screen: { x: 30, y: 30, width: 420, height: 300, rx: 4 },
        frame_url: '/assets/mockups/billboard.svg',
      },
    ];
  },

  // 4. Pro Templates
  async getTemplates() {
    return [
      {
        id: 'saas-launch',
        title: 'Platform Overview',
        category: 'banner',
        width: 800,
        height: 800,
        preview: 'linear-gradient(135deg, #18191B 0%, #202226 100%)',
        canvas_json: {
          background: '#131417',
          objects: [
            { type: 'rect', left: 40, top: 40, width: 720, height: 720, rx: 8, ry: 8, fill: '#1E2024', stroke: '#333740', strokeWidth: 1.5 },
            { type: 'i-text', text: 'Software Studio', left: 400, top: 160, originX: 'center', originY: 'center', fontSize: 18, fontWeight: '600', fill: '#9CA3AF', fontFamily: 'Inter' },
            { type: 'i-text', text: 'Design systems for\nmodern web products', left: 400, top: 280, originX: 'center', originY: 'center', fontSize: 44, fontWeight: '700', fill: '#FFFFFF', fontFamily: 'Inter', textAlign: 'center', lineHeight: 1.2 },
            { type: 'i-text', text: 'Zero configuration · Pure Rust engine · High performance', left: 400, top: 390, originX: 'center', originY: 'center', fontSize: 16, fontWeight: '400', fill: '#6B7280', fontFamily: 'Inter' },
            { type: 'rect', left: 400, top: 480, originX: 'center', originY: 'center', width: 200, height: 44, rx: 6, ry: 6, fill: '#3B82F6' },
            { type: 'i-text', text: 'Explore platform', left: 400, top: 480, originX: 'center', originY: 'center', fontSize: 15, fontWeight: '500', fill: '#FFFFFF', fontFamily: 'Inter' },
          ]
        }
      },
      {
        id: 'youtube-masterclass',
        title: 'Video Thumbnail',
        category: 'youtube',
        width: 1280,
        height: 720,
        preview: 'linear-gradient(135deg, #131417 0%, #1F2228 100%)',
        canvas_json: {
          background: '#131417',
          objects: [
            { type: 'rect', left: 40, top: 40, width: 1200, height: 640, rx: 8, ry: 8, fill: '#1E2024', stroke: '#333740', strokeWidth: 1.5 },
            { type: 'i-text', text: 'Masterclass', left: 100, top: 110, fontSize: 18, fontWeight: '600', fill: '#3B82F6', fontFamily: 'Inter' },
            { type: 'i-text', text: 'Building creative tools\nwith Rust and Wasm', left: 100, top: 250, fontSize: 58, fontWeight: '800', fill: '#FFFFFF', fontFamily: 'Outfit', lineHeight: 1.15 },
            { type: 'i-text', text: 'Full architecture overview and implementation details', left: 100, top: 440, fontSize: 22, fontWeight: '400', fill: '#9CA3AF', fontFamily: 'Inter' },
            { type: 'rect', left: 960, top: 360, originX: 'center', originY: 'center', width: 260, height: 260, rx: 12, ry: 12, fill: '#26292E', stroke: '#3B82F6', strokeWidth: 2 },
            { type: 'i-text', text: '🦀', left: 960, top: 320, originX: 'center', originY: 'center', fontSize: 60 },
            { type: 'i-text', text: 'Pure Rust', left: 960, top: 410, originX: 'center', originY: 'center', fontSize: 22, fontWeight: '700', fill: '#FFFFFF', fontFamily: 'Inter' },
          ]
        }
      },
      {
        id: 'editorial-quote',
        title: 'Editorial Quote',
        category: 'social',
        width: 800,
        height: 800,
        preview: 'linear-gradient(135deg, #1A1F1D 0%, #202E27 100%)',
        canvas_json: {
          background: '#141816',
          objects: [
            { type: 'rect', left: 60, top: 60, width: 680, height: 680, rx: 4, ry: 4, fill: '#1C221F', stroke: '#2D3B34', strokeWidth: 1.5 },
            { type: 'i-text', text: '“', left: 400, top: 220, originX: 'center', originY: 'center', fontSize: 90, fontWeight: '700', fill: '#A7F3D0', fontFamily: 'Playfair Display' },
            { type: 'i-text', text: 'Simplicity is about subtracting\nthe obvious and adding the meaningful.', left: 400, top: 370, originX: 'center', originY: 'center', fontSize: 34, fontWeight: '700', fill: '#ECFDF5', fontFamily: 'Playfair Display', textAlign: 'center', lineHeight: 1.35 },
            { type: 'i-text', text: 'John Maeda', left: 400, top: 520, originX: 'center', originY: 'center', fontSize: 15, fontWeight: '500', fill: '#6EE7B7', fontFamily: 'Inter' },
          ]
        }
      }
    ];
  },

  // 5. Backend SQLite Persistence
  async getProjects() {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async getProject(id) {
    const res = await fetch(`/api/projects/${id}`);
    return await res.json();
  },

  async saveProject(payload) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // 6. File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  },

  // 7. Rust Server Export
  async exportRender(imageData, format = 'png') {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_data: imageData, format }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design_export.${format === 'jpeg' ? 'jpg' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Proxy Helper (routes external images through Axum proxy so canvas is never tainted and Tracking Prevention never blocks)
  proxyUrl(url) {
    if (!url) return '';
    if (url.startsWith('/api/proxy') || url.startsWith('data:') || url.startsWith('/') || url.startsWith('./')) {
      return url;
    }
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
};

window.API = API;
