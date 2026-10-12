# Usage Guide

CanvasCraft Studio is a local-first creative graphic design suite powered by a high-performance Rust backend and Fabric.js canvas engine.

## Quick Start

1. Start server:
   ```bash
   cargo run
   ```
2. Open browser:
   ```
   http://127.0.0.1:3000
   ```

## Key Workflows

### 1. Canvas Navigation & Sizing
- Switch aspect ratio presets via the top format dropdown (1:1 Square, 9:16 Story, 16:9 Banner, etc.).
- Zoom canvas using the slider (`-`, `+`, or fit-to-screen button in the footer).

### 2. Multi-Page Workflow
- Click **Add page** in the page header bar or below the canvas to create additional pages.
- Switch pages using the left/right arrow controls.
- Duplicate or delete individual pages without losing project state.
- Pages automatically auto-save to SQLite (`canva_local.db`).

### 3. Adding Elements
- **Templates**: Pre-designed layouts ready for one-click customization.
- **Elements**: Basic vector geometry (rectangles, circles, stars, badges), crisp Lucide vector icons, and open vector scene illustrations.
- **Text**: Heading, Subheading, Body presets with Google Fonts typography (Inter, Outfit, Playfair Display, Caveat, Space Grotesk).
- **Photos**: Free open stock photography fetched through Rust backend proxy without user API keys.
- **Uploads**: Drag and drop local images or click upload.
- **Frames**: Mockup templates for mobile and desktop screens.
- **Layers**: Z-order reordering and visibility locking.

### 4. Right-Click Context Menu
Right-click any canvas element to access:
- Duplicate (`Ctrl+D`)
- Delete (`Delete`)
- Bring to Front (`Ctrl+]`) / Send to Back (`Ctrl+[`)
- Flip Horizontal / Vertical
- Lock / Unlock position
- Export Element as PNG

### 5. Exporting Designs
Click the **Share** button in the top right to export in multiple formats:
- **PNG image**: Standard 1x web-ready resolution.
- **PNG (2x Retina)**: Crisp 2x high-definition export.
- **JPEG photo**: Compressed image file.
- **SVG vector**: Scalable vector graphics export.
- **Project backup**: Editable JSON file containing all pages.
- **Rust Server Composite**: Backend pixel-perfect rasterization.
