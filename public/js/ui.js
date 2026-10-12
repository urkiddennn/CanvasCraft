// EazeGraphics Canva Studio UI Controller
// Replicates authentic Canva editor interactions, multi-page layout, and toolbars

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Fabric Canvas with white background like Canva paper
  const engine = new CanvasEngine('canvas-viewport');
  engine.init(600, 600);
  engine.setBackgroundColor('#FFFFFF');
  window.engine = engine;

  let currentProjectId = null;
  let projectTitle = 'Untitled design';
  let activeTab = 'elements';
  let saveTimer = null;
  const loadedFonts = new Set(['Inter', 'Outfit', 'Playfair Display', 'Caveat']);

  // Load Google Fonts
  ['Inter', 'Outfit', 'Playfair Display', 'Caveat', 'Space Grotesk'].forEach(loadGoogleFont);

  // Load initial Canva sample (matching user's screenshot: blue circle with "50%")
  setTimeout(() => {
    setupInitialCanvaSample();
  }, 100);

  function setupInitialCanvaSample() {
    if (engine.canvas.getObjects().length === 0) {
      // Circle
      const circle = new fabric.Circle({
        left: 300,
        top: 300,
        originX: 'center',
        originY: 'center',
        radius: 175,
        fill: '#38BDF8',
      });
      // 50% Text
      const text = new fabric.IText('50%', {
        left: 300,
        top: 300,
        originX: 'center',
        originY: 'center',
        fontSize: 110,
        fontWeight: 'bold',
        fontFamily: 'Caveat',
        fill: '#FFFFFF',
      });
      engine.canvas.add(circle, text);
      engine.canvas.renderAll();
      engine.recordHistory();
    }
  }

  // DOM Elements
  const projectTitleInput = document.getElementById('project-title');
  const drawer = document.getElementById('sidebar-drawer');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBody = document.getElementById('drawer-body');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const propToolbar = document.getElementById('property-toolbar');
  const zoomRange = document.getElementById('zoom-range');
  const zoomPercent = document.getElementById('zoom-percentage');
  const headerZoomLabel = document.getElementById('header-zoom-label');

  // --- RAIL TAB SWITCHING ---
  const railButtons = document.querySelectorAll('.rail-item');
  railButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (activeTab === tab && !drawer.classList.contains('collapsed')) {
        drawer.classList.add('collapsed');
        btn.classList.remove('active');
        return;
      }
      railButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      drawer.classList.remove('collapsed');
      activeTab = tab;
      renderDrawerTab(tab);
    });
  });

  btnCloseDrawer?.addEventListener('click', () => {
    drawer.classList.add('collapsed');
    railButtons.forEach((b) => b.classList.remove('active'));
  });

  // --- DRAWER DISPATCHER ---
  async function renderDrawerTab(tab) {
    drawerBody.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-dim); font-size: 12px;">Loading...</div>';

    switch (tab) {
      case 'templates':
        drawerTitle.textContent = 'Templates';
        await renderTemplatesTab();
        break;
      case 'elements':
        drawerTitle.textContent = 'Elements';
        renderElementsTab();
        break;
      case 'photos':
        drawerTitle.textContent = 'Photos';
        await renderPhotosTab();
        break;
      case 'text':
        drawerTitle.textContent = 'Text';
        renderTextTab();
        break;
      case 'uploads':
        drawerTitle.textContent = 'Uploads';
        renderUploadsTab();
        break;
      case 'mockups':
        drawerTitle.textContent = 'Frames';
        await renderMockupsTab();
        break;
      case 'layers':
        drawerTitle.textContent = 'Layers';
        renderLayersTab();
        break;
      case 'background':
        drawerTitle.textContent = 'Background';
        renderBackgroundTab();
        break;
    }
  }

  // 1. Templates Tab
  async function renderTemplatesTab() {
    const templates = await API.getTemplates();
    let html = `<div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">All templates</div>`;

    templates.forEach((t) => {
      html += `
        <div class="template-item" data-template-id="${t.id}">
          <div class="template-item-thumb" style="background:${t.preview};">
            ${t.title}
          </div>
          <div class="template-item-foot">
            <span>${t.title}</span>
            <span style="color:var(--text-dim); font-size:10px;">${t.width}×${t.height}</span>
          </div>
        </div>
      `;
    });
    drawerBody.innerHTML = html;

    drawerBody.querySelectorAll('.template-item').forEach((card) => {
      card.addEventListener('click', async () => {
        const id = card.dataset.templateId;
        const t = templates.find((x) => x.id === id);
        if (t && confirm(`Load "${t.title}"? Current canvas will be replaced.`)) {
          engine.setDimensions(t.width, t.height);
          updateDimensionSelector(t.width, t.height);
          await engine.loadFromJSON(t.canvas_json);
          fitCanvas();
          triggerAutoSave();
        }
      });
    });
  }

  // 2. Canva Unified Elements Tab (Shapes, Stickers, Photos, Frames, Gifs all combined)
  function renderElementsTab() {
    let currentFilter = 'all'; // all, shapes, graphics, photos, frames
    let currentSearch = '';

    drawerBody.innerHTML = `
      <div class="drawer-search-box">
        <svg class="drawer-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="elements-search-input" class="drawer-search-input" placeholder="Search elements (shapes, stickers, photos, frames)...">
      </div>

      <div class="drawer-chips" id="elements-filter-chips">
        <button class="drawer-chip active" data-filter="all">All</button>
        <button class="drawer-chip" data-filter="icons">Icons</button>
        <button class="drawer-chip" data-filter="illustrations">Illustrations</button>
        <button class="drawer-chip" data-filter="shapes">Shapes</button>
        <button class="drawer-chip" data-filter="graphics">Graphics</button>
        <button class="drawer-chip" data-filter="photos">Photos</button>
        <button class="drawer-chip" data-filter="frames">Frames</button>
      </div>

      <div id="elements-dynamic-container">
        <!-- Rendered dynamically -->
      </div>
    `;

    const searchInput = document.getElementById('elements-search-input');
    const container = document.getElementById('elements-dynamic-container');

    async function renderElementsView() {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px;">Loading elements...</div>';

      if (currentSearch) {
        // Unified Search Mode across all resources
        await renderElementsSearch(currentSearch, currentFilter);
      } else {
        // Default Canva Overview Mode with grouped sections
        await renderElementsDefault(currentFilter);
      }
    }

    async function renderElementsDefault(filter) {
      let html = '';

      // Section 1: Shapes & Lines
      if (filter === 'all' || filter === 'shapes') {
        html += `
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; font-weight:600; color:#fff;">Lines & Shapes</span>
            </div>
            <div class="asset-grid-4">
              <div class="vector-card shape-clickable" data-shape="circle" title="Circle">
                <svg viewBox="0 0 24 24" fill="#38BDF8"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div class="vector-card shape-clickable" data-shape="rect" title="Square">
                <svg viewBox="0 0 24 24" fill="#8B5CF6"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              </div>
              <div class="vector-card shape-clickable" data-shape="rounded-rect" title="Rounded rectangle">
                <svg viewBox="0 0 24 24" fill="#EC4899"><rect x="3" y="5" width="18" height="14" rx="6"/></svg>
              </div>
              <div class="vector-card shape-clickable" data-shape="triangle" title="Triangle">
                <svg viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12,3 22,21 2,21"/></svg>
              </div>
              <div class="vector-card shape-clickable" data-shape="star" title="Star">
                <svg viewBox="0 0 24 24" fill="#FBBF24"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>
              </div>
              <div class="vector-card shape-clickable" data-shape="line" title="Line">
                <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke="#FFFFFF" stroke-width="2.5"/></svg>
              </div>
            </div>
          </div>
        `;
      }

      // Section 2: Online Free Vector Illustrations (Open & dynamic from web)
      if (filter === 'all' || filter === 'illustrations') {
        const illustrations = await API.getIllustrations('illustration', 1);
        html += `
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; font-weight:600; color:#fff;">Free Illustrations (Online)</span>
            </div>
            <div class="asset-grid-2">
              ${illustrations.slice(0, 8).map(ill => `
                <div class="asset-card vector-card illustration-clickable" data-svg="${ill.svg_url}" title="${ill.title}" style="height:115px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:8px; background:var(--bg-panel-subtle); border-radius:8px; cursor:pointer;">
                  <img src="${ill.thumb}" alt="${ill.title}" style="max-height:80px; max-width:100%; object-fit:contain;" onerror="this.onerror=null; this.src='/assets/illustrations/startup-launch.svg';">
                  <span style="font-size:10px; color:var(--text-dim); margin-top:4px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:100%;">${ill.title}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Section 3: Graphics & Icons (Iconify & CDN)
      if (filter === 'all' || filter === 'graphics' || filter === 'icons') {
        const stickers = await API.getStickers('sparkle', 'fluent-emoji', 16);
        html += `
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; font-weight:600; color:#fff;">Graphics & Stickers</span>
            </div>
            <div class="asset-grid-4">
              ${stickers.map(s => `
                <div class="asset-card vector-card sticker-clickable" data-svg="${s.svg_url}" title="${s.name}">
                  <img src="${s.svg_url}" alt="${s.name}" onerror="this.onerror=null; this.src='/assets/stickers/sparkle-gold.svg';">
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Section 4: Stock Photos (Wikimedia Commons)
      if (filter === 'all' || filter === 'photos') {
        const photos = await API.getPhotos('aesthetic wallpaper', 1);
        html += `
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; font-weight:600; color:#fff;">Photos</span>
            </div>
            <div class="asset-grid-2">
              ${photos.slice(0, 8).map(p => `
                <div class="asset-card photo-card photo-clickable" data-full="${p.full}" title="${p.title}">
                  <img src="${p.thumb}" alt="${p.title}" loading="lazy">
                  <div class="photo-card-overlay"><span>${p.title}</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Section 5: Frames & Mockups
      if (filter === 'all' || filter === 'frames') {
        const mockups = await API.getMockups();
        html += `
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; font-weight:600; color:#fff;">Frames & Mockups</span>
            </div>
            <div class="asset-grid-2">
              ${mockups.map(m => `
                <div class="asset-card mockup-item frame-clickable" data-mockup-id="${m.id}">
                  <img src="${m.frame_url}" alt="${m.name}" style="height:65px;">
                  <span style="font-size:11px;">${m.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
      bindElementEvents();
    }

    async function renderElementsSearch(query, filter) {
      let html = '';

      // 1. Search Vector Illustrations from Internet
      if (filter === 'all' || filter === 'illustrations') {
        const illustrations = await API.getIllustrations(query, 1);
        if (illustrations && illustrations.length > 0) {
          html += `
            <div style="margin-bottom:16px;">
              <div style="font-size:13px; font-weight:600; color:#fff; margin-bottom:8px;">Free Illustrations for "${query}"</div>
              <div class="asset-grid-2">
                ${illustrations.slice(0, 12).map(ill => `
                  <div class="asset-card vector-card illustration-clickable" data-svg="${ill.svg_url}" title="${ill.title}" style="height:115px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:8px; background:var(--bg-panel-subtle); border-radius:8px; cursor:pointer;">
                    <img src="${ill.thumb}" alt="${ill.title}" style="max-height:80px; max-width:100%; object-fit:contain;" onerror="this.onerror=null; this.src='/assets/illustrations/startup-launch.svg';">
                    <span style="font-size:10px; color:var(--text-dim); margin-top:4px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:100%;">${ill.title}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      // 2. Search Vector Icons & Graphics across ALL 200,000+ free icons
      if (filter === 'all' || filter === 'graphics' || filter === 'icons') {
        const stickers = await API.getStickers(query, null, 48);
        if (stickers && stickers.length > 0) {
          html += `
            <div style="margin-bottom:16px;">
              <div style="font-size:13px; font-weight:600; color:#fff; margin-bottom:8px;">Icons & Graphics for "${query}"</div>
              <div class="asset-grid-4">
                ${stickers.map(s => `
                  <div class="asset-card vector-card sticker-clickable" data-svg="${s.svg_url}" title="${s.name}">
                    <img src="${s.svg_url}" alt="${s.name}" onerror="this.onerror=null; this.src='/assets/stickers/sparkle-gold.svg';">
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      // 3. Search Photos (Wikimedia)
      if (filter === 'all' || filter === 'photos') {
        const photos = await API.getPhotos(query, 1);
        if (photos && photos.length > 0) {
          html += `
            <div style="margin-bottom:16px;">
              <div style="font-size:13px; font-weight:600; color:#fff; margin-bottom:8px;">Photos matching "${query}"</div>
              <div class="asset-grid-2">
                ${photos.slice(0, 16).map(p => `
                  <div class="asset-card photo-card photo-clickable" data-full="${p.full}" title="${p.title}">
                    <img src="${p.thumb}" alt="${p.title}" loading="lazy">
                    <div class="photo-card-overlay"><span>${p.title}</span></div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      if (!html) {
        html = '<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px;">No elements found for that search. Try another word.</div>';
      }

      container.innerHTML = html;
      bindElementEvents();
    }

    function bindElementEvents() {
      // Bind Shapes
      container.querySelectorAll('.shape-clickable').forEach(card => {
        card.addEventListener('click', () => engine.addShape(card.dataset.shape));
      });

      // Bind Illustrations
      container.querySelectorAll('.illustration-clickable').forEach(card => {
        card.addEventListener('click', async () => {
          card.style.opacity = '0.5';
          try {
            await engine.addSvgFromUrl(card.dataset.svg);
          } catch (err) {
            console.error('Failed to add illustration:', err);
          } finally {
            card.style.opacity = '1';
          }
        });
      });

      // Bind Stickers/Graphics
      container.querySelectorAll('.sticker-clickable').forEach(card => {
        card.addEventListener('click', async () => {
          card.style.opacity = '0.5';
          try {
            await engine.addSvgFromUrl(card.dataset.svg);
          } catch (err) {
            console.error('Failed to add SVG:', err);
          } finally {
            card.style.opacity = '1';
          }
        });
      });

      // Bind Photos
      container.querySelectorAll('.photo-clickable').forEach(card => {
        card.addEventListener('click', async () => {
          card.style.opacity = '0.5';
          try {
            await engine.addImageFromUrl(card.dataset.full);
          } catch (err) {
            console.error('Failed to add image:', err);
          } finally {
            card.style.opacity = '1';
          }
        });
      });

      // Bind Frames
      container.querySelectorAll('.frame-clickable').forEach(card => {
        card.addEventListener('click', async () => {
          const mockups = await API.getMockups();
          const m = mockups.find(x => x.id === card.dataset.mockupId);
          if (m) {
            card.style.opacity = '0.5';
            await engine.addMockupWithImage(m);
            card.style.opacity = '1';
          }
        });
      });
    }

    // Filter Chips Event Handlers
    drawerBody.querySelectorAll('#elements-filter-chips .drawer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        drawerBody.querySelectorAll('#elements-filter-chips .drawer-chip').forEach(b => b.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        renderElementsView();
      });
    });

    // Search Input Event Handler
    let timer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        currentSearch = e.target.value.trim();
        renderElementsView();
      }, 350);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(timer);
        currentSearch = e.target.value.trim();
        renderElementsView();
      }
    });

    renderElementsView();
  }

  // 3. Photos Tab (Wikimedia Commons live media search)
  async function renderPhotosTab() {
    let currentPage = 1;
    let currentQuery = 'landscape';
    let isLoading = false;

    drawerBody.innerHTML = `
      <div class="drawer-search-box">
        <svg class="drawer-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="photo-search-input" class="drawer-search-input" placeholder="Search millions of photos...">
      </div>
      <div class="drawer-chips">
        <button class="drawer-chip active" data-cat="landscape">Landscape</button>
        <button class="drawer-chip" data-cat="architecture">Architecture</button>
        <button class="drawer-chip" data-cat="portrait">People</button>
        <button class="drawer-chip" data-cat="minimalist">Minimal</button>
        <button class="drawer-chip" data-cat="coffee">Coffee</button>
        <button class="drawer-chip" data-cat="technology">Tech</button>
      </div>
      <div id="photos-grid-area" class="asset-grid-2">
        <div style="grid-column:span 2; text-align:center; padding:30px; color:var(--text-dim);">Loading...</div>
      </div>
      <div style="text-align:center; padding:12px 0;">
        <button class="nav-pill-btn" id="btn-more-photos" style="width:100%; justify-content:center; background:#313238; border-radius:4px;">Load more photos</button>
      </div>
    `;

    const searchInput = document.getElementById('photo-search-input');
    const photosGrid = document.getElementById('photos-grid-area');
    const moreBtn = document.getElementById('btn-more-photos');

    async function loadPhotos(page, append = false) {
      if (isLoading) return;
      isLoading = true;
      if (!append) {
        photosGrid.innerHTML = '<div style="grid-column:span 2; text-align:center; padding:30px; color:var(--text-dim);">Loading photos...</div>';
      } else {
        moreBtn.textContent = 'Loading...';
      }

      const photos = await API.getPhotos(currentQuery, page);
      isLoading = false;
      moreBtn.textContent = 'Load more photos';

      if (!photos || photos.length === 0) {
        if (!append) photosGrid.innerHTML = '<div style="grid-column:span 2; text-align:center; padding:30px; color:var(--text-dim);">No photos found.</div>';
        return;
      }

      const html = photos.map(p => `
        <div class="asset-card photo-card" data-full="${p.full}" title="${p.title}">
          <img src="${p.thumb}" alt="${p.title}" loading="lazy">
          <div class="photo-card-overlay">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.title}</span>
          </div>
        </div>
      `).join('');

      if (append) photosGrid.insertAdjacentHTML('beforeend', html);
      else photosGrid.innerHTML = html;

      photosGrid.querySelectorAll('.photo-card').forEach((card) => {
        if (card._bound) return;
        card._bound = true;
        card.addEventListener('click', async () => {
          card.style.opacity = '0.5';
          await engine.addImageFromUrl(card.dataset.full);
          card.style.opacity = '1';
        });
      });
    }

    let searchTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      const val = e.target.value.trim();
      if (val) drawerBody.querySelectorAll('.drawer-chip').forEach(b => b.classList.remove('active'));
      searchTimer = setTimeout(() => {
        currentQuery = val || 'landscape';
        currentPage = 1;
        loadPhotos(1, false);
      }, 350);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchTimer);
        currentQuery = e.target.value.trim() || 'landscape';
        currentPage = 1;
        loadPhotos(1, false);
      }
    });

    drawerBody.querySelectorAll('.drawer-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        drawerBody.querySelectorAll('.drawer-chip').forEach(b => b.classList.remove('active'));
        chip.classList.add('active');
        searchInput.value = '';
        currentQuery = chip.dataset.cat;
        currentPage = 1;
        loadPhotos(1, false);
      });
    });

    moreBtn.addEventListener('click', () => {
      currentPage++;
      loadPhotos(currentPage, true);
    });

    loadPhotos(1, false);
  }

  // 4. Text Tab
  function renderTextTab() {
    drawerBody.innerHTML = `
      <div style="font-size:12px; font-weight:600; color:#fff; margin-bottom:12px;">Default text styles</div>
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
        <button class="nav-pill-btn" id="btn-add-heading" style="background:#313238; padding:12px; justify-content:flex-start;">
          <span style="font-size:18px; font-weight:700; font-family:'Outfit';">Add a heading</span>
        </button>
        <button class="nav-pill-btn" id="btn-add-subheading" style="background:#313238; padding:10px; justify-content:flex-start;">
          <span style="font-size:14px; font-weight:600; font-family:'Inter'; color:#CBD5E1;">Add a subheading</span>
        </button>
        <button class="nav-pill-btn" id="btn-add-body" style="background:#313238; padding:8px; justify-content:flex-start;">
          <span style="font-size:12px; font-weight:400; font-family:'Inter'; color:#94A3B8;">Add a little bit of body text</span>
        </button>
      </div>

      <div style="font-size:12px; font-weight:600; color:#fff; margin-bottom:10px;">Font styles</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="nav-pill-btn" id="btn-add-script" style="background:#313238; padding:10px; justify-content:flex-start;">
          <span style="font-size:24px; font-family:'Caveat'; color:#FDE047;">Handwritten script</span>
        </button>
        <button class="nav-pill-btn" id="btn-add-serif" style="background:#313238; padding:10px; justify-content:flex-start;">
          <span style="font-size:16px; font-family:'Playfair Display'; font-weight:700; font-style:italic; color:#A7F3D0;">Editorial Serif</span>
        </button>
      </div>
    `;

    document.getElementById('btn-add-heading').addEventListener('click', () => {
      engine.addText('Heading text', { fontSize: 48, fontWeight: '700', fontFamily: 'Outfit', fill: '#0E1318' });
    });
    document.getElementById('btn-add-subheading').addEventListener('click', () => {
      engine.addText('Subheading text', { fontSize: 28, fontWeight: '600', fontFamily: 'Inter', fill: '#334155' });
    });
    document.getElementById('btn-add-body').addEventListener('click', () => {
      engine.addText('Body text goes here', { fontSize: 18, fontWeight: '400', fontFamily: 'Inter', fill: '#64748B' });
    });
    document.getElementById('btn-add-script').addEventListener('click', () => {
      engine.addText('Hello Summer', { fontSize: 56, fontFamily: 'Caveat', fill: '#EC4899' });
    });
    document.getElementById('btn-add-serif').addEventListener('click', () => {
      engine.addText('Elegance in design', { fontSize: 36, fontFamily: 'Playfair Display', fontStyle: 'italic', fill: '#0E1318' });
    });
  }

  // 5. Uploads Tab
  function renderUploadsTab() {
    drawerBody.innerHTML = `
      <div style="border:1px dashed #4E505B; border-radius:6px; padding:24px 16px; text-align:center; cursor:pointer; background:#313238;" id="upload-box">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text-muted); margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <div style="font-size:13px; font-weight:600;">Upload files</div>
        <div style="font-size:11px; color:var(--text-dim); margin-top:2px;">PNG, JPG, SVG, WebP</div>
        <input type="file" id="file-picker" accept="image/*" style="display:none;">
      </div>
    `;

    const box = document.getElementById('upload-box');
    const picker = document.getElementById('file-picker');
    box.addEventListener('click', () => picker.click());

    picker.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        box.innerHTML = '<div style="font-size:12px; color:var(--canva-teal-light);">Uploading...</div>';
        try {
          const res = await API.uploadFile(file);
          renderUploadsTab();
          await engine.addImageFromUrl(res.url);
        } catch (err) {
          alert('Upload failed: ' + err.message);
          renderUploadsTab();
        }
      }
    });
  }

  // 6. Mockup Frames Tab
  async function renderMockupsTab() {
    const mockups = await API.getMockups();
    let html = `
      <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">Frames & Mockups</div>
      <div class="asset-grid-2">
    `;
    mockups.forEach((m) => {
      html += `
        <div class="asset-card mockup-item" data-mockup-id="${m.id}" style="padding:10px; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <img src="${m.frame_url}" alt="${m.name}" style="height:70px;">
          <span style="font-size:11px; text-align:center;">${m.name}</span>
        </div>
      `;
    });
    html += '</div>';
    drawerBody.innerHTML = html;

    drawerBody.querySelectorAll('.mockup-item').forEach((card) => {
      card.addEventListener('click', async () => {
        const m = mockups.find(x => x.id === card.dataset.mockupId);
        if (m) {
          card.style.opacity = '0.5';
          await engine.addMockupWithImage(m);
          card.style.opacity = '1';
        }
      });
    });
  }

  // 7. Layers Tab
  function renderLayersTab() {
    const objects = engine.canvas.getObjects().slice().reverse();
    if (objects.length === 0) {
      drawerBody.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:12px;">No layers on page</div>';
      return;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:6px;">`;
    objects.forEach((obj, idx) => {
      const type = obj.type || 'layer';
      const text = obj.text ? `"${obj.text.substring(0, 14)}"` : type.toUpperCase();
      const isActive = engine.canvas.getActiveObject() === obj;

      html += `
        <div class="asset-card" style="padding:8px 12px; display:flex; align-items:center; justify-content:space-between; background:${isActive ? '#3B3C44' : '#2D2E33'};" data-layer-idx="${objects.length - 1 - idx}">
          <span style="font-size:12px;">${text}</span>
          <div style="display:flex; gap:4px;">
            <button class="nav-pill-btn layer-up-btn" style="padding:2px 6px; font-size:10px;">▲</button>
            <button class="nav-pill-btn layer-down-btn" style="padding:2px 6px; font-size:10px;">▼</button>
            <button class="nav-pill-btn layer-del-btn" style="padding:2px 6px; font-size:10px; color:#EF4444;">✕</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    drawerBody.innerHTML = html;

    drawerBody.querySelectorAll('[data-layer-idx]').forEach((row) => {
      const realIdx = parseInt(row.dataset.layerIdx, 10);
      const targetObj = engine.canvas.getObjects()[realIdx];

      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        engine.canvas.setActiveObject(targetObj);
        engine.canvas.renderAll();
        renderLayersTab();
      });

      row.querySelector('.layer-up-btn')?.addEventListener('click', () => {
        engine.canvas.bringForward(targetObj);
        engine.canvas.renderAll();
        renderLayersTab();
      });

      row.querySelector('.layer-down-btn')?.addEventListener('click', () => {
        engine.canvas.sendBackwards(targetObj);
        engine.canvas.renderAll();
        renderLayersTab();
      });

      row.querySelector('.layer-del-btn')?.addEventListener('click', () => {
        engine.canvas.remove(targetObj);
        engine.canvas.renderAll();
        renderLayersTab();
      });
    });
  }

  // 8. Background Tab
  function renderBackgroundTab() {
    drawerBody.innerHTML = `
      <div style="font-size:12px; font-weight:600; color:#fff; margin-bottom:10px;">Solid colors</div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
        ${['#FFFFFF', '#F8FAFC', '#F1F5F9', '#38BDF8', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#0E1318', '#1E293B']
          .map(c => `<div class="bg-color-dot" data-col="${c}" style="width:32px; height:32px; border-radius:4px; background:${c}; cursor:pointer; border:1px solid #4E505B;"></div>`)
          .join('')}
      </div>
    `;

    drawerBody.querySelectorAll('.bg-color-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        engine.setBackgroundColor(dot.dataset.col);
      });
    });
  }

  // --- DYNAMIC SELECTION PROPERTY TOOLBAR ---
  engine.onSelectionChange = (active) => {
    renderPropertyToolbar(active);
    if (activeTab === 'layers') renderLayersTab();
  };

  function renderPropertyToolbar(active) {
    if (!active) {
      propToolbar.innerHTML = `<div style="font-size:12px; color:var(--text-dim);">Select an element to edit font, color, and positioning</div>`;
      return;
    }

    const isText = active.type === 'i-text' || active.type === 'text';
    const isImage = active instanceof fabric.Image;
    const isShape = !isText && !isImage;

    let html = `
      <div class="prop-unit">
        <button class="nav-pill-btn" id="btn-prop-align-h" title="Align center" style="padding:4px 6px;">⬌</button>
        <button class="nav-pill-btn" id="btn-prop-align-v" title="Align middle" style="padding:4px 6px;">⬍</button>
        <button class="nav-pill-btn" id="btn-prop-up" title="Bring forward" style="padding:4px 6px;">⇈</button>
        <button class="nav-pill-btn" id="btn-prop-down" title="Send backward" style="padding:4px 6px;">⇊</button>
      </div>
      <div class="divider-bar"></div>
    `;

    if (isText) {
      html += `
        <div class="prop-unit">
          <select id="prop-font-family" class="prop-dropdown">
            ${['Caveat', 'Inter', 'Outfit', 'Playfair Display', 'Space Grotesk'].map(f => `<option value="${f}" ${active.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
          <input type="number" id="prop-font-size" class="prop-num" value="${Math.round(active.fontSize || 40)}" min="8" max="240">
        </div>
        <div class="prop-unit">
          <button class="nav-pill-btn ${active.fontWeight === 'bold' ? 'active' : ''}" id="btn-prop-bold" style="padding:4px 8px;"><b>B</b></button>
          <button class="nav-pill-btn ${active.fontStyle === 'italic' ? 'active' : ''}" id="btn-prop-italic" style="padding:4px 8px;"><i>I</i></button>
        </div>
        <div class="divider-bar"></div>
        <div class="prop-unit" style="position:relative;">
          <div class="color-swatch-box" style="background:${active.fill || '#000000'};" id="text-color-box"></div>
          <input type="color" class="color-input-hidden" id="prop-text-col" value="${rgbToHex(active.fill) || '#000000'}">
        </div>
      `;
    }

    if (isShape) {
      html += `
        <div class="prop-unit" style="position:relative;">
          <span style="font-size:11px; color:var(--text-muted);">Color:</span>
          <div class="color-swatch-box" style="background:${active.fill || '#38BDF8'};" id="shape-fill-box"></div>
          <input type="color" class="color-input-hidden" id="prop-shape-col" value="${rgbToHex(active.fill) || '#38bdf8'}">
        </div>
      `;
    }

    html += `
      <div class="divider-bar"></div>
      <div class="prop-unit">
        <span style="font-size:11px; color:var(--text-muted);">Transparency:</span>
        <input type="range" id="prop-transparency" min="0.1" max="1" step="0.05" value="${active.opacity || 1}" style="width:60px; accent-color:#00C4CC;">
      </div>
      <div class="divider-bar"></div>
      <div class="prop-unit">
        <button class="nav-pill-btn" id="btn-prop-dup" title="Duplicate (Ctrl+D)" style="padding:4px 6px;">⧉</button>
        <button class="nav-pill-btn" id="btn-prop-lock" title="Lock" style="padding:4px 6px;">${active.lockMovementX ? '🔒' : '🔓'}</button>
        <button class="nav-pill-btn" id="btn-prop-del" title="Delete" style="padding:4px 6px; color:#EF4444;">🗑</button>
      </div>
    `;

    propToolbar.innerHTML = html;

    // Attach Handlers
    document.getElementById('btn-prop-align-h')?.addEventListener('click', () => engine.alignActive('center'));
    document.getElementById('btn-prop-align-v')?.addEventListener('click', () => engine.alignActive('middle'));
    document.getElementById('btn-prop-up')?.addEventListener('click', () => engine.bringToFront());
    document.getElementById('btn-prop-down')?.addEventListener('click', () => engine.sendToBack());
    document.getElementById('btn-prop-dup')?.addEventListener('click', () => engine.duplicateActive());
    document.getElementById('btn-prop-lock')?.addEventListener('click', () => engine.toggleLockActive());
    document.getElementById('btn-prop-del')?.addEventListener('click', () => engine.deleteActive());

    document.getElementById('prop-font-family')?.addEventListener('change', (e) => {
      const f = e.target.value;
      loadGoogleFont(f);
      active.set('fontFamily', f);
      engine.canvas.renderAll();
      engine.recordHistory();
    });

    document.getElementById('prop-font-size')?.addEventListener('change', (e) => {
      active.set('fontSize', parseInt(e.target.value, 10));
      engine.canvas.renderAll();
      engine.recordHistory();
    });

    document.getElementById('btn-prop-bold')?.addEventListener('click', () => {
      active.set('fontWeight', active.fontWeight === 'bold' ? 'normal' : 'bold');
      engine.canvas.renderAll();
      renderPropertyToolbar(active);
    });

    document.getElementById('btn-prop-italic')?.addEventListener('click', () => {
      active.set('fontStyle', active.fontStyle === 'italic' ? 'normal' : 'italic');
      engine.canvas.renderAll();
      renderPropertyToolbar(active);
    });

    document.getElementById('prop-text-col')?.addEventListener('input', (e) => {
      active.set('fill', e.target.value);
      document.getElementById('text-color-box').style.background = e.target.value;
      engine.canvas.renderAll();
      engine.recordHistory();
    });

    document.getElementById('prop-shape-col')?.addEventListener('input', (e) => {
      active.set('fill', e.target.value);
      document.getElementById('shape-fill-box').style.background = e.target.value;
      engine.canvas.renderAll();
      engine.recordHistory();
    });

    document.getElementById('prop-transparency')?.addEventListener('input', (e) => {
      active.set('opacity', parseFloat(e.target.value));
      engine.canvas.renderAll();
      engine.recordHistory();
    });
  }

  // --- GOOGLE FONTS DYNAMIC INJECTOR ---
  function loadGoogleFont(fontName) {
    if (loadedFonts.has(fontName)) return;
    loadedFonts.add(fontName);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }

  // --- CANVAS RESIZE PRESETS ---
  const dimensionSelector = document.getElementById('canvas-dimensions-select');
  dimensionSelector?.addEventListener('change', (e) => {
    const [w, h] = e.target.value.split('x').map(n => parseInt(n, 10));
    if (w && h) {
      engine.setDimensions(w, h);
      fitCanvas();
    }
  });

  function updateDimensionSelector(w, h) {
    const key = `${w}x${h}`;
    if (dimensionSelector) dimensionSelector.value = key;
  }

  // --- ZOOM CONTROLS ---
  zoomRange?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    engine.setZoom(val);
    zoomPercent.textContent = `${Math.round(val * 100)}%`;
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    const newZoom = Math.max(0.2, (parseFloat(zoomRange.value) || 1) - 0.1);
    engine.setZoom(newZoom);
    zoomRange.value = newZoom;
    zoomPercent.textContent = `${Math.round(newZoom * 100)}%`;
  });

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    const newZoom = Math.min(2.5, (parseFloat(zoomRange.value) || 1) + 0.1);
    engine.setZoom(newZoom);
    zoomRange.value = newZoom;
    zoomPercent.textContent = `${Math.round(newZoom * 100)}%`;
  });

  document.getElementById('btn-fit-screen')?.addEventListener('click', fitCanvas);

  function fitCanvas() {
    const availW = window.innerWidth - 420;
    const availH = window.innerHeight - 200;
    const scale = Math.min(availW / engine.width, availH / engine.height, 1);
    engine.setZoom(scale);
    if (zoomRange) zoomRange.value = scale;
    if (zoomPercent) zoomPercent.textContent = `${Math.round(scale * 100)}%`;
  }

  // --- MULTI-PAGE ENGINE & CONTROLS ---
  function updatePageUI() {
    const total = engine.pages.length;
    const current = engine.currentPageIndex;
    const activePage = engine.pages[current] || { title: `Page ${current + 1}` };

    const badge = document.getElementById('page-index-badge');
    if (badge) badge.textContent = `${current + 1}`;

    const titleInput = document.getElementById('page-title-input');
    if (titleInput) titleInput.value = activePage.title;

    const bottomLabel = document.getElementById('bottom-page-count-label');
    if (bottomLabel) bottomLabel.textContent = `Page ${current + 1} of ${total}`;

    // Enable/disable navigation buttons
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');
    if (prevBtn) prevBtn.style.opacity = current > 0 ? '1' : '0.4';
    if (nextBtn) nextBtn.style.opacity = current < total - 1 ? '1' : '0.4';
  }

  engine.onPagesChanged = updatePageUI;
  updatePageUI();

  // Add Page buttons
  document.getElementById('btn-page-add')?.addEventListener('click', async () => {
    await engine.addPage();
    updatePageUI();
  });

  document.getElementById('btn-stage-add-page')?.addEventListener('click', async () => {
    await engine.addPage();
    updatePageUI();
  });

  // Duplicate Page
  document.getElementById('btn-page-duplicate')?.addEventListener('click', async () => {
    await engine.duplicatePage();
    updatePageUI();
  });

  // Delete Page
  document.getElementById('btn-page-delete')?.addEventListener('click', async () => {
    if (engine.pages.length > 1) {
      if (confirm('Delete current page?')) {
        await engine.deletePage();
        updatePageUI();
      }
    } else {
      if (confirm('Clear current page?')) {
        engine.canvas.clear();
        engine.setBackgroundColor('#FFFFFF');
        engine.recordHistory();
      }
    }
  });

  // Switch Page navigation
  document.getElementById('btn-page-prev')?.addEventListener('click', async () => {
    if (engine.currentPageIndex > 0) {
      await engine.switchPage(engine.currentPageIndex - 1);
      updatePageUI();
    }
  });

  document.getElementById('btn-page-next')?.addEventListener('click', async () => {
    if (engine.currentPageIndex < engine.pages.length - 1) {
      await engine.switchPage(engine.currentPageIndex + 1);
      updatePageUI();
    }
  });

  // Rename Page Title
  document.getElementById('page-title-input')?.addEventListener('input', (e) => {
    engine.setPageTitle(engine.currentPageIndex, e.target.value.trim() || `Page ${engine.currentPageIndex + 1}`);
  });

  // --- UNDO / REDO ---
  document.getElementById('btn-undo')?.addEventListener('click', () => engine.undo());
  document.getElementById('btn-redo')?.addEventListener('click', () => engine.redo());

  // --- AUTOSAVE TO LOCAL SQLITE ---
  engine.onCanvasModified = triggerAutoSave;

  projectTitleInput?.addEventListener('input', (e) => {
    projectTitle = e.target.value.trim() || 'Untitled design';
    triggerAutoSave();
  });

  function triggerAutoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        engine.saveCurrentPageState();
        const payload = {
          id: currentProjectId,
          title: projectTitle,
          canvas_json: JSON.stringify(engine.pages),
          thumbnail: engine.exportPNG(0.3),
          width: engine.width,
          height: engine.height,
        };
        const saved = await API.saveProject(payload);
        currentProjectId = saved.id;
      } catch (_) {}
    }, 1500);
  }

  // --- SHARE / EXPORT DROPDOWN ---
  const shareBtn = document.getElementById('btn-share-export');
  const exportMenu = document.getElementById('export-menu');

  shareBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    exportMenu?.classList.remove('show');
  });

  document.getElementById('export-png-1x')?.addEventListener('click', () => downloadURI(engine.exportPNG(1), `${slugify(projectTitle)}.png`));
  document.getElementById('export-png-2x')?.addEventListener('click', () => downloadURI(engine.exportPNG(2), `${slugify(projectTitle)}_2x.png`));
  document.getElementById('export-jpg')?.addEventListener('click', () => downloadURI(engine.exportJPEG(0.92), `${slugify(projectTitle)}.jpg`));
  document.getElementById('export-svg')?.addEventListener('click', () => {
    const blob = new Blob([engine.exportSVG()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadURI(url, `${slugify(projectTitle)}.svg`);
    URL.revokeObjectURL(url);
  });
  document.getElementById('export-json')?.addEventListener('click', () => {
    engine.saveCurrentPageState();
    const blob = new Blob([JSON.stringify(engine.pages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadURI(url, `${slugify(projectTitle)}_pages.json`);
    URL.revokeObjectURL(url);
  });
  document.getElementById('export-server-rust')?.addEventListener('click', async () => {
    await API.exportRender(engine.exportPNG(2), 'png');
  });

  // --- HOME SCREEN DASHBOARD ---
  const homeScreen = document.getElementById('home-screen-view');
  const editorWorkspace = document.getElementById('editor-workspace');
  const homeProjectsGrid = document.getElementById('home-projects-grid');
  const homeSearchInput = document.getElementById('home-search-input');

  function openHomeScreen() {
    homeScreen.classList.remove('hidden');
    editorWorkspace.classList.add('hidden');
    renderHomeProjects();
  }

  function closeHomeScreen() {
    homeScreen.classList.add('hidden');
    editorWorkspace.classList.remove('hidden');
    fitCanvas();
  }

  document.getElementById('btn-home-toggle')?.addEventListener('click', openHomeScreen);
  document.getElementById('btn-nav-home')?.addEventListener('click', openHomeScreen);
  document.getElementById('btn-return-to-editor')?.addEventListener('click', closeHomeScreen);

  // Home Screen Format Preset Cards
  document.querySelectorAll('.home-preset-card[data-w]').forEach((card) => {
    card.addEventListener('click', () => {
      const w = parseInt(card.dataset.w, 10);
      const h = parseInt(card.dataset.h, 10);
      currentProjectId = null;
      projectTitle = `${card.querySelector('.preset-name')?.textContent || 'New design'}`;
      projectTitleInput.value = projectTitle;
      engine.setDimensions(w, h);
      updateDimensionSelector(w, h);
      engine.pages = [{ id: 'page-1', title: 'Page 1', json: null }];
      engine.currentPageIndex = 0;
      engine.canvas.clear();
      engine.setBackgroundColor('#FFFFFF');
      updatePageUI();
      closeHomeScreen();
    });
  });

  // Custom Size Creator
  document.getElementById('btn-create-custom')?.addEventListener('click', () => {
    const w = parseInt(document.getElementById('custom-w').value, 10) || 800;
    const h = parseInt(document.getElementById('custom-h').value, 10) || 800;
    currentProjectId = null;
    projectTitle = `Custom ${w}x${h} design`;
    projectTitleInput.value = projectTitle;
    engine.setDimensions(w, h);
    updateDimensionSelector(w, h);
    engine.pages = [{ id: 'page-1', title: 'Page 1', json: null }];
    engine.currentPageIndex = 0;
    engine.canvas.clear();
    engine.setBackgroundColor('#FFFFFF');
    updatePageUI();
    closeHomeScreen();
  });

  // Blank Canvas Creator
  document.getElementById('btn-home-blank-design')?.addEventListener('click', () => {
    currentProjectId = null;
    projectTitle = 'Untitled design';
    projectTitleInput.value = projectTitle;
    engine.setDimensions(800, 800);
    updateDimensionSelector(800, 800);
    engine.pages = [{ id: 'page-1', title: 'Page 1', json: null }];
    engine.currentPageIndex = 0;
    engine.canvas.clear();
    engine.setBackgroundColor('#FFFFFF');
    updatePageUI();
    closeHomeScreen();
  });

  // Render Projects on Home Screen from SQLite
  async function renderHomeProjects(query = '') {
    homeProjectsGrid.innerHTML = '<div style="color:var(--text-dim); padding:20px; font-size:12px;">Loading saved designs from SQLite...</div>';
    try {
      const projects = await API.getProjects();
      const filtered = query
        ? projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        : projects;

      if (!filtered || filtered.length === 0) {
        homeProjectsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--bg-panel); border: 1px dashed var(--border-default); border-radius: 10px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">No designs found</div>
            <div style="font-size: 12px; color: var(--text-dim);">Click any preset format above to start creating.</div>
          </div>
        `;
        return;
      }

      homeProjectsGrid.innerHTML = filtered.map(p => `
        <div class="home-project-card" data-id="${p.id}">
          <button class="btn-delete-project-card" data-id="${p.id}" title="Delete design">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
          </button>
          <div class="project-thumb-box" data-id="${p.id}">
            ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}">` : `<div style="font-size:32px; color:var(--text-dim);">🎨</div>`}
          </div>
          <div class="project-info-box" data-id="${p.id}">
            <span class="project-card-title">${p.title}</span>
            <span class="project-card-date">${p.width} × ${p.height} px · ${new Date(p.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');

      // Open project click handlers
      homeProjectsGrid.querySelectorAll('.home-project-card, .project-thumb-box, .project-info-box').forEach(el => {
        el.addEventListener('click', async (e) => {
          if (e.target.closest('.btn-delete-project-card')) return;
          const id = el.dataset.id || el.closest('.home-project-card')?.dataset.id;
          if (!id) return;
          const p = await API.getProject(id);
          currentProjectId = p.id;
          projectTitle = p.title;
          projectTitleInput.value = p.title;
          engine.setDimensions(p.width, p.height);
          updateDimensionSelector(p.width, p.height);

          try {
            const parsed = JSON.parse(p.canvas_json);
            if (Array.isArray(parsed)) {
              engine.pages = parsed;
              engine.currentPageIndex = 0;
              if (parsed[0] && parsed[0].json) {
                await engine.loadFromJSON(parsed[0].json);
              }
            } else {
              engine.pages = [{ id: 'page-1', title: 'Page 1', json: parsed }];
              engine.currentPageIndex = 0;
              await engine.loadFromJSON(parsed);
            }
          } catch (_) {
            await engine.loadFromJSON(p.canvas_json);
          }

          updatePageUI();
          closeHomeScreen();
        });
      });

      // Delete project click handlers
      homeProjectsGrid.querySelectorAll('.btn-delete-project-card').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          if (confirm('Delete this design permanently?')) {
            await API.deleteProject(id);
            if (currentProjectId === id) currentProjectId = null;
            renderHomeProjects(homeSearchInput.value);
          }
        });
      });
    } catch (err) {
      console.warn('Projects load error:', err);
      homeProjectsGrid.innerHTML = '<div style="color:var(--text-dim); padding:20px;">Could not load designs.</div>';
    }
  }

  homeSearchInput?.addEventListener('input', (e) => {
    renderHomeProjects(e.target.value);
  });

  // --- RIGHT-CLICK CONTEXT MENU ON CANVAS ELEMENTS ---
  const ctxMenu = document.getElementById('canvas-context-menu');

  if (engine.canvas && engine.canvas.upperCanvasEl) {
    engine.canvas.upperCanvasEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = engine.canvas.findTarget(e);
      if (target) {
        engine.canvas.setActiveObject(target);
        engine.canvas.renderAll();
      }

      const activeObj = engine.canvas.getActiveObject();
      if (!activeObj) {
        ctxMenu.style.display = 'none';
        return;
      }

      // Position context menu
      const posX = Math.min(e.clientX, window.innerWidth - 210);
      const posY = Math.min(e.clientY, window.innerHeight - 340);
      ctxMenu.style.left = `${posX}px`;
      ctxMenu.style.top = `${posY}px`;
      ctxMenu.style.display = 'flex';
    });
  }

  // Dismiss context menu
  document.addEventListener('click', () => {
    if (ctxMenu) ctxMenu.style.display = 'none';
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ctxMenu) {
      ctxMenu.style.display = 'none';
    }
  });

  // Context Menu Item Actions
  ctxMenu?.querySelectorAll('.ctx-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      ctxMenu.style.display = 'none';

      switch (action) {
        case 'duplicate':
          engine.duplicateActive();
          break;
        case 'delete':
          engine.deleteActive();
          break;
        case 'bring-to-front':
          engine.bringToFront();
          break;
        case 'bring-forward':
          engine.bringForward();
          break;
        case 'send-backward':
          engine.sendBackward();
          break;
        case 'send-to-back':
          engine.sendToBack();
          break;
        case 'flip-h':
          engine.flipHorizontal();
          break;
        case 'flip-v':
          engine.flipVertical();
          break;
        case 'toggle-lock':
          engine.toggleLockActive();
          break;
        case 'export-selection':
          const obj = engine.canvas.getActiveObject();
          if (obj) {
            const dataUrl = obj.toDataURL({ format: 'png', multiplier: 2 });
            downloadURI(dataUrl, 'element_selection.png');
          }
          break;
      }
    });
  });

  // --- SHORTCUTS ---
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Delete' || e.key === 'Backspace') engine.deleteActive();
    else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
      if (e.shiftKey) engine.redo();
      else engine.undo();
    } else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) engine.redo();
    else if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      engine.duplicateActive();
    }
  });

  function downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function slugify(text) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w\-]+/g, '');
  }

  function rgbToHex(color) {
    if (!color) return '#000000';
    if (color.startsWith('#')) return color;
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return '#000000';
    return '#' + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
  }

  renderDrawerTab('elements');
  fitCanvas();
});
