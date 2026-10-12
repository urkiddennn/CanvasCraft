// EazeGraphics Canvas Engine
// Wraps Fabric.js with advanced editing, history, mockups, filters, and export

class CanvasEngine {
  constructor(canvasElementId) {
    this.canvasId = canvasElementId;
    this.canvas = null;
    this.width = 800;
    this.height = 800;
    this.zoom = 1;

    // History stack for Undo / Redo
    this.history = [];
    this.historyIndex = -1;
    this.isHistoryProcessing = false;
    this.maxHistory = 40;

    // Multi-page state
    this.pages = [
      { id: 'page-1', title: 'Page 1', json: null }
    ];
    this.currentPageIndex = 0;

    // Callbacks
    this.onSelectionChange = null;
    this.onCanvasModified = null;
    this.onPagesChanged = null;
  }

  init(width = 800, height = 800) {
    this.width = width;
    this.height = height;

    this.canvas = new fabric.Canvas(this.canvasId, {
      width: this.width,
      height: this.height,
      backgroundColor: '#0F172A',
      preserveObjectStacking: true,
      selection: true,
    });

    // Fabric selection styling
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#3B82F6';
    fabric.Object.prototype.borderColor = '#3B82F6';
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.cornerStyle = 'rect';
    fabric.Object.prototype.borderScaleFactor = 1.5;

    // Listeners
    this.canvas.on('selection:created', (e) => this._handleSelection(e));
    this.canvas.on('selection:updated', (e) => this._handleSelection(e));
    this.canvas.on('selection:cleared', () => this._handleSelection(null));

    this.canvas.on('object:modified', () => this.recordHistory());
    this.canvas.on('object:added', (e) => {
      if (!this.isHistoryProcessing && !e.target._isTemp) {
        this.recordHistory();
      }
    });
    this.canvas.on('object:removed', () => {
      if (!this.isHistoryProcessing) {
        this.recordHistory();
      }
    });

    this.recordHistory();
    return this;
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
    this.recordHistory();
  }

  setBackgroundColor(color) {
    this.canvas.backgroundColor = color;
    this.canvas.renderAll();
    this.recordHistory();
  }

  // --- OBJECT SELECTION & TOOLBAR DISPATCH ---

  _handleSelection(e) {
    const active = this.canvas.getActiveObject();
    if (this.onSelectionChange) {
      this.onSelectionChange(active);
    }
  }

  getActiveObject() {
    return this.canvas.getActiveObject();
  }

  // --- TEXT TOOLS ---

  addText(text = 'Heading Text', options = {}) {
    const defaults = {
      left: this.width / 2,
      top: this.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Outfit',
      fontSize: 48,
      fontWeight: 'bold',
      fill: '#FFFFFF',
      textAlign: 'center',
    };

    const textObj = new fabric.IText(text, { ...defaults, ...options });
    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);
    this.canvas.renderAll();
    return textObj;
  }

  // --- SHAPES ---

  addShape(type, options = {}) {
    let obj = null;
    const cx = this.width / 2;
    const cy = this.height / 2;

    const baseOpts = {
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      fill: '#6366F1',
      stroke: 'transparent',
      strokeWidth: 0,
      ...options,
    };

    switch (type) {
      case 'rect':
        obj = new fabric.Rect({
          ...baseOpts,
          width: options.width || 180,
          height: options.height || 180,
          rx: options.rx || 0,
          ry: options.ry || 0,
        });
        break;

      case 'rounded-rect':
        obj = new fabric.Rect({
          ...baseOpts,
          width: options.width || 200,
          height: options.height || 120,
          rx: 20,
          ry: 20,
        });
        break;

      case 'circle':
        obj = new fabric.Circle({
          ...baseOpts,
          radius: options.radius || 90,
        });
        break;

      case 'triangle':
        obj = new fabric.Triangle({
          ...baseOpts,
          width: 180,
          height: 160,
        });
        break;

      case 'star': {
        const points = this._getStarPoints(5, 90, 45);
        obj = new fabric.Polygon(points, {
          ...baseOpts,
        });
        break;
      }

      case 'line':
        obj = new fabric.Line([cx - 100, cy, cx + 100, cy], {
          stroke: options.stroke || '#FFFFFF',
          strokeWidth: options.strokeWidth || 4,
          strokeLineCap: 'round',
          ...options,
        });
        break;

      default:
        obj = new fabric.Rect({
          ...baseOpts,
          width: 150,
          height: 150,
        });
    }

    if (obj) {
      this.canvas.add(obj);
      this.canvas.setActiveObject(obj);
      this.canvas.renderAll();
    }
    return obj;
  }

  _getStarPoints(arms, outerRadius, innerRadius) {
    const results = [];
    const angle = Math.PI / arms;
    for (let i = 0; i < 2 * arms; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const currAngle = i * angle - Math.PI / 2;
      results.push({
        x: r * Math.cos(currAngle),
        y: r * Math.sin(currAngle),
      });
    }
    return results;
  }

  // --- IMAGES & STICKERS ---

  addImageFromUrl(url, options = {}) {
    return new Promise((resolve, reject) => {
      // Use proxy if external URL to avoid canvas taint
      const proxiedUrl = API.proxyUrl(url);

      fabric.Image.fromURL(
        proxiedUrl,
        (img) => {
          if (!img) {
            reject(new Error('Failed loading image'));
            return;
          }

          // Scale down if image is too large
          const maxDim = Math.min(this.width, this.height) * 0.7;
          if (img.width > maxDim || img.height > maxDim) {
            const scale = maxDim / Math.max(img.width, img.height);
            img.scale(scale);
          }

          img.set({
            left: options.left ?? this.width / 2,
            top: options.top ?? this.height / 2,
            originX: 'center',
            originY: 'center',
            ...options,
          });

          this.canvas.add(img);
          this.canvas.setActiveObject(img);
          this.canvas.renderAll();
          resolve(img);
        },
        { crossOrigin: 'anonymous' }
      );
    });
  }

  async addSvgFromUrl(url, options = {}) {
    let svgText = null;

    // Direct fetch (Iconify / jsdelivr send open CORS; never blocked by localhost proxy)
    try {
      const res = await fetch(url);
      if (res.ok) {
        svgText = await res.text();
      }
    } catch (err) {
      console.warn('Direct SVG fetch failed, trying proxy:', err);
    }

    // Proxy fallback only if direct fetch failed
    if (!svgText && (url.startsWith('http://') || url.startsWith('https://'))) {
      try {
        const proxied = API.proxyUrl(url);
        if (proxied !== url) {
          const res = await fetch(proxied);
          if (res.ok) {
            svgText = await res.text();
          }
        }
      } catch (err) {
        console.warn('Proxied SVG fetch failed:', err);
      }
    }

    if (!svgText || !svgText.includes('<svg')) {
      throw new Error(`Failed to load valid SVG from ${url}`);
    }

    // Normalize SVG attributes:
    // 1. Convert currentColor to options.fill or default dark slate #1e293b
    // 2. Expand width="1em"/height="1em" into explicit pixels for Fabric's viewBox parser
    const fillCol = options.fill || '#1e293b';
    const normalizedSvg = svgText
      .replace(/currentColor/gi, fillCol)
      .replace(/width="1em"/gi, 'width="128"')
      .replace(/height="1em"/gi, 'height="128"');

    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(normalizedSvg, (objects, opts) => {
        if (!objects || objects.length === 0) {
          reject(new Error('Empty SVG'));
          return;
        }

        const svgGroup = fabric.util.groupSVGElements(objects, opts);
        const maxDim = Math.min(this.width, this.height) * 0.35;
        const currentDim = Math.max(svgGroup.width || 100, svgGroup.height || 100);
        if (currentDim > 0) {
          svgGroup.scale(maxDim / currentDim);
        }

        svgGroup.set({
          left: options.left ?? this.width / 2,
          top: options.top ?? this.height / 2,
          originX: 'center',
          originY: 'center',
          ...options,
        });

        this.canvas.add(svgGroup);
        this.canvas.setActiveObject(svgGroup);
        this.canvas.renderAll();
        resolve(svgGroup);
      });
    });
  }

  // --- DEVICE MOCKUPS WITH SCREEN CLIPPING ---

  async addMockupWithImage(mockupDef, imageUrl = null) {
    const frameUrl = API.proxyUrl(mockupDef.frame_url);
    const fallbackImage = imageUrl || '/assets/images/cosmic-nebula.svg';
    const screenImgUrl = API.proxyUrl(fallbackImage);

    return new Promise((resolve) => {
      // 1. Load Screen Inner Image
      fabric.Image.fromURL(
        screenImgUrl,
        (screenImg) => {
          // Fit image to mockup screen dimensions
          const screen = mockupDef.screen;
          const scaleX = screen.width / screenImg.width;
          const scaleY = screen.height / screenImg.height;
          const scale = Math.max(scaleX, scaleY);

          screenImg.set({
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            left: screen.x + screen.width / 2,
            top: screen.y + screen.height / 2,
          });

          // Clip image to screen area with rounded corners
          const clipRect = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            left: screen.x + screen.width / 2,
            top: screen.y + screen.height / 2,
            width: screen.width,
            height: screen.height,
            rx: screen.rx || 0,
            ry: screen.rx || 0,
            absolutePositioned: true,
          });
          screenImg.clipPath = clipRect;

          // 2. Load Frame SVG
          fabric.loadSVGFromURL(frameUrl, (objects, opts) => {
            const frameGroup = fabric.util.groupSVGElements(objects, opts);
            frameGroup.set({
              left: 0,
              top: 0,
              originX: 'left',
              originY: 'top',
              selectable: false,
              evented: false,
            });

            // 3. Composite into a single Interactive Mockup Group
            const mockupGroup = new fabric.Group([screenImg, frameGroup], {
              left: this.width / 2,
              top: this.height / 2,
              originX: 'center',
              originY: 'center',
              subTargetCheck: true,
            });

            // Scale mockup to fit canvas nicely
            const maxAllowed = Math.min(this.width, this.height) * 0.75;
            if (mockupGroup.width > maxAllowed || mockupGroup.height > maxAllowed) {
              const scale = maxAllowed / Math.max(mockupGroup.width, mockupGroup.height);
              mockupGroup.scale(scale);
            }

            mockupGroup.customData = {
              isMockup: true,
              mockupId: mockupDef.id,
              mockupDef: mockupDef,
            };

            this.canvas.add(mockupGroup);
            this.canvas.setActiveObject(mockupGroup);
            this.canvas.renderAll();
            resolve(mockupGroup);
          });
        },
        { crossOrigin: 'anonymous' }
      );
    });
  }

  // --- FILTERS ---

  applyFilter(filterName, value) {
    const obj = this.canvas.getActiveObject();
    if (!obj || !(obj instanceof fabric.Image)) return;

    obj.filters = obj.filters || [];
    obj.filters = obj.filters.filter((f) => f && f.type !== filterName);

    switch (filterName) {
      case 'Grayscale':
        if (value) obj.filters.push(new fabric.Image.filters.Grayscale());
        break;
      case 'Sepia':
        if (value) obj.filters.push(new fabric.Image.filters.Sepia());
        break;
      case 'Invert':
        if (value) obj.filters.push(new fabric.Image.filters.Invert());
        break;
      case 'Brightness':
        obj.filters.push(new fabric.Image.filters.Brightness({ brightness: value }));
        break;
      case 'Contrast':
        obj.filters.push(new fabric.Image.filters.Contrast({ contrast: value }));
        break;
      case 'Blur':
        obj.filters.push(new fabric.Image.filters.Blur({ blur: value }));
        break;
    }

    obj.applyFilters();
    this.canvas.renderAll();
    this.recordHistory();
  }

  // --- ALIGNMENT & ARRANGE ---

  alignActive(type) {
    const obj = this.canvas.getActiveObject();
    if (!obj) return;

    const bound = obj.getBoundingRect(true);

    switch (type) {
      case 'left':
        obj.set('left', obj.left - bound.left);
        break;
      case 'center':
        obj.set('left', this.width / 2);
        obj.set('originX', 'center');
        break;
      case 'right':
        obj.set('left', this.width - (bound.width / 2));
        obj.set('originX', 'center');
        break;
      case 'top':
        obj.set('top', obj.top - bound.top);
        break;
      case 'middle':
        obj.set('top', this.height / 2);
        obj.set('originY', 'center');
        break;
      case 'bottom':
        obj.set('top', this.height - (bound.height / 2));
        obj.set('originY', 'center');
        break;
    }

    obj.setCoords();
    this.canvas.renderAll();
    this.recordHistory();
  }

  bringForward() {
    const obj = this.canvas.getActiveObject();
    if (obj) {
      this.canvas.bringForward(obj);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  sendBackward() {
    const obj = this.canvas.getActiveObject();
    if (obj) {
      this.canvas.sendBackwards(obj);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  bringToFront() {
    const obj = this.canvas.getActiveObject();
    if (obj) {
      this.canvas.bringToFront(obj);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  sendToBack() {
    const obj = this.canvas.getActiveObject();
    if (obj) {
      this.canvas.sendToBack(obj);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  duplicateActive() {
    const obj = this.canvas.getActiveObject();
    if (!obj) return;

    obj.clone((cloned) => {
      cloned.set({
        left: obj.left + 24,
        top: obj.top + 24,
        evented: true,
      });
      this.canvas.add(cloned);
      this.canvas.setActiveObject(cloned);
      this.canvas.renderAll();
      this.recordHistory();
    });
  }

  deleteActive() {
    const active = this.canvas.getActiveObjects();
    if (active && active.length > 0) {
      this.canvas.discardActiveObject();
      active.forEach((obj) => this.canvas.remove(obj));
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  toggleLockActive() {
    const obj = this.canvas.getActiveObject();
    if (!obj) return;
    const isLocked = !obj.lockMovementX;
    obj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      hasControls: !isLocked,
    });
    this.canvas.renderAll();
    this._handleSelection(obj);
  }

  flipHorizontal() {
    const obj = this.canvas.getActiveObject();
    if (!obj) return;
    obj.set('flipX', !obj.flipX);
    this.canvas.renderAll();
    this.recordHistory();
  }

  flipVertical() {
    const obj = this.canvas.getActiveObject();
    if (!obj) return;
    obj.set('flipY', !obj.flipY);
    this.canvas.renderAll();
    this.recordHistory();
  }

  // --- MULTI-PAGE CONTROLLER ---

  saveCurrentPageState() {
    if (!this.pages[this.currentPageIndex]) return;
    this.pages[this.currentPageIndex].json = this.canvas.toJSON(['customData']);
  }

  async switchPage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.pages.length) return;
    if (targetIndex === this.currentPageIndex) return;

    this.saveCurrentPageState();
    this.currentPageIndex = targetIndex;

    const targetPage = this.pages[targetIndex];
    if (targetPage.json) {
      await this.loadFromJSON(targetPage.json);
    } else {
      this.isHistoryProcessing = true;
      this.canvas.clear();
      this.canvas.backgroundColor = '#FFFFFF';
      this.canvas.renderAll();
      this.isHistoryProcessing = false;
      this.history = [];
      this.historyIndex = -1;
      this.recordHistory();
    }

    if (this.onPagesChanged) {
      this.onPagesChanged(this.pages, this.currentPageIndex);
    }
  }

  async addPage(title = null) {
    this.saveCurrentPageState();

    const newIndex = this.pages.length;
    const pageTitle = title || `Page ${newIndex + 1}`;
    this.pages.push({
      id: `page-${Date.now()}`,
      title: pageTitle,
      json: null,
    });

    this.currentPageIndex = newIndex;
    this.isHistoryProcessing = true;
    this.canvas.clear();
    this.canvas.backgroundColor = '#FFFFFF';
    this.canvas.renderAll();
    this.isHistoryProcessing = false;
    this.history = [];
    this.historyIndex = -1;
    this.recordHistory();

    if (this.onPagesChanged) {
      this.onPagesChanged(this.pages, this.currentPageIndex);
    }
  }

  async duplicatePage(index = null) {
    const targetIdx = index !== null ? index : this.currentPageIndex;
    this.saveCurrentPageState();

    const sourcePage = this.pages[targetIdx];
    const newPage = {
      id: `page-${Date.now()}`,
      title: `${sourcePage.title} (Copy)`,
      json: JSON.parse(JSON.stringify(sourcePage.json || this.canvas.toJSON(['customData']))),
    };

    this.pages.splice(targetIdx + 1, 0, newPage);
    await this.switchPage(targetIdx + 1);
  }

  async deletePage(index = null) {
    if (this.pages.length <= 1) {
      // Don't delete only page, just clear
      this.canvas.clear();
      this.canvas.backgroundColor = '#FFFFFF';
      this.canvas.renderAll();
      this.recordHistory();
      return;
    }

    const targetIdx = index !== null ? index : this.currentPageIndex;
    this.pages.splice(targetIdx, 0);
    this.pages.splice(targetIdx, 1);

    if (this.currentPageIndex >= this.pages.length) {
      this.currentPageIndex = this.pages.length - 1;
    }

    const newActive = this.pages[this.currentPageIndex];
    if (newActive.json) {
      await this.loadFromJSON(newActive.json);
    } else {
      this.canvas.clear();
      this.canvas.backgroundColor = '#FFFFFF';
      this.canvas.renderAll();
      this.recordHistory();
    }

    if (this.onPagesChanged) {
      this.onPagesChanged(this.pages, this.currentPageIndex);
    }
  }

  setPageTitle(index, title) {
    if (this.pages[index]) {
      this.pages[index].title = title;
      if (this.onPagesChanged) {
        this.onPagesChanged(this.pages, this.currentPageIndex);
      }
    }
  }

  recordHistory() {
    if (this.isHistoryProcessing) return;

    const json = JSON.stringify(this.canvas.toJSON(['customData']));

    // Truncate future states if we modified after undo
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push(json);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;

    if (this.onCanvasModified) {
      this.onCanvasModified();
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this._loadHistoryState(this.history[this.historyIndex]);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this._loadHistoryState(this.history[this.historyIndex]);
    }
  }

  _loadHistoryState(jsonState) {
    this.isHistoryProcessing = true;
    this.canvas.loadFromJSON(jsonState, () => {
      this.canvas.renderAll();
      this.isHistoryProcessing = false;
      this._handleSelection(null);
      if (this.onCanvasModified) {
        this.onCanvasModified();
      }
    });
  }

  // --- EXPORT & SERIALIZATION ---

  exportPNG(multiplier = 1) {
    return this.canvas.toDataURL({
      format: 'png',
      multiplier: multiplier,
    });
  }

  exportJPEG(quality = 0.92) {
    return this.canvas.toDataURL({
      format: 'jpeg',
      quality: quality,
      multiplier: 1,
    });
  }

  exportSVG() {
    return this.canvas.toSVG();
  }

  exportJSON() {
    return JSON.stringify(this.canvas.toJSON(['customData']), null, 2);
  }

  loadFromJSON(json) {
    return new Promise((resolve) => {
      this.isHistoryProcessing = true;
      this.canvas.loadFromJSON(json, () => {
        this.canvas.renderAll();
        this.isHistoryProcessing = false;
        this.recordHistory();
        resolve();
      });
    });
  }

  // --- ZOOM & PAN ---

  setZoom(zoomFactor) {
    this.zoom = Math.max(0.2, Math.min(4, zoomFactor));
    const stage = document.querySelector('.canvas-shadow-wrap');
    if (stage) {
      stage.style.transform = `scale(${this.zoom})`;
      stage.style.transformOrigin = 'center center';
    }
  }
}

window.CanvasEngine = CanvasEngine;
