# CanvasCraft Studio — Functional Audit & Icon Review

## 1. Icon Modernization Audit (Completed)
- **Problem**: Property inspector toolbar and layers panel previously used text/unicode characters (`⬌`, `⬍`, `⇈`, `⇊`, `⧉`, `▲`, `▼`, `✕`, `🗑`, `🔒`).
- **Resolution**: Replaced with crisp 24×24 Lucide SVGs styled with CSS variables (`--bg-panel`, `--border-default`, `--primary`):
  - Alignment: Horizontal (`line`, `rect`), Vertical (`line`, `rect`)
  - Z-Order: Bring forward (`polyline`), Send backward (`polyline`)
  - Formatting: Bold, Italic, Color swatch trigger, Opacity slider
  - Layer Actions: Move up, Move down, Delete
  - State indicators: Dynamic lock/unlock SVG icon states

---

## 2. Missing Functionality Gap Analysis

| Category | Missing Feature | Impact | Implementation Path |
| --- | --- | --- | --- |
| **Canvas Manipulation** | **Multi-selection & Grouping** | Medium | Fabric.js `fabric.ActiveSelection` -> `group.toGroup()` / `toActiveSelection()` |
| **Canvas Manipulation** | **Smart Guides & Snapping** | High | Center/edge alignment guides on `object:moving` event |
| **Typography** | **Text Alignment & Letter Spacing** | Medium | `textAlign` ('left', 'center', 'right'), `charSpacing`, `lineHeight` in property bar |
| **Styling & Effects** | **Stroke & Shadow Controls** | High | `stroke`, `strokeWidth`, `shadow` controls in property bar for shapes and text |
| **Styling & Effects** | **Image Filters & Adjustments** | High | Fabric.js image filters: Brightness, Contrast, Grayscale, Blur, Saturation |
| **Assets & Library** | **Uploads Persistence & Thumbnail Previews** | Medium | Store uploaded files list in SQLite / local storage so users see past uploads |
| **Export Engine** | **PDF Export** | High | Vector PDF export via jsPDF or backend `image` composite |
| **Workflow** | **Multi-page Grid View** | Medium | Bird's-eye thumbnail grid modal to reorder pages via drag & drop |

---

## 3. Recommended Next Implementation Steps
1. Add Text Alignment (Left, Center, Right) + Letter Spacing to the property bar.
2. Add Stroke & Shadow controls to shapes and text.
3. Add Canvas Snapping / Alignment guidelines for dragging objects.
