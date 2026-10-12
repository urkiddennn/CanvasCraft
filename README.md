# CanvasCraft (EazeGraphics)

> Zero-config, local-first Canva alternative built with Rust, Axum, SQLite, and Fabric.js. Powered by a 100% free open asset ecosystem requiring zero API keys.

---

## What is CanvasCraft?

**CanvasCraft** is a privacy-first, lightweight graphic design suite designed to run locally on your machine. Unlike cloud-locked platforms (Canva, Figma) that require monthly subscriptions, forced logins, and proprietary cloud storage:

- **100% Local-First**: Runs entirely on your computer (`http://127.0.0.1:3000`). Projects are stored locally in SQLite (`canva_local.db`).
- **Zero API Keys & Zero Sign-Up**: Instantly access 90M+ photos, 5M+ vector SVG illustrations, 200,000+ icons, device mockups, and community templates without creating accounts or supplying credentials.
- **Pure Rust Backend**: High-performance asynchronous Axum 0.7 server handles project persistence, file uploads, server-side rasterization, and same-origin proxying.
- **Fluid Browser Canvas**: Fabric.js canvas engine supporting shapes, freehand drawing, layer reordering, device screen clipping, multi-page layout, and exports (PNG, 2x PNG, JPG, SVG, JSON).
- **Anti-Tracking & Anti-Taint Proxy**: Built-in `/api/proxy` endpoint streams external SVGs and photos same-origin, eliminating browser tracking prevention blocks and canvas export security errors.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                       Client (Browser)                          │
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │    ui.js     │◄───►│  canvas.js   │◄───►│     api.js      │  │
│  │ (Canva Chrome│     │ (Fabric.js   │     │ (Asset Engine & │  │
│  │ & Toolbars)  │     │  Subsystem)  │     │  Storage Client)│  │
│  └──────────────┘     └──────────────┘     └────────┬────────┘  │
└─────────────────────────────────────────────────────┼───────────┘
                                                      │ HTTP / JSON
┌─────────────────────────────────────────────────────▼───────────┐
│                   Backend (Rust / Axum 0.7)                     │
│                                                                 │
│  ┌───────────────────────┐             ┌─────────────────────┐  │
│  │      Endpoints        │             │    Asset Engines    │  │
│  │  /api/projects        │             │  • Wikimedia Media  │  │
│  │  /api/upload          │             │  • Iconify API      │  │
│  │  /api/export          │             │  • jsdelivr CDNs    │  │
│  │  /api/proxy           │             │  • Curated Mockups  │  │
│  └──────────┬────────────┘             └─────────────────────┘  │
│             │                                                   │
│             ▼                                                   │
│  ┌───────────────────────┐                                      │
│  │   SQLite (SQLx)       │                                      │
│  │   canva_local.db      │                                      │
│  └───────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

- **Multi-Category Asset Engine**:
  - **Photos**: 90M+ high-resolution photos via uncapped Wikimedia Commons search.
  - **Illustrations**: 5M+ SVG vector illustrations and scene artworks.
  - **Icons & Graphics**: 200,000+ vector symbols from Material Symbols, Tabler, Lucide, SimpleIcons, and Fluent 3D.
  - **Device Mockups**: iPhone 16 Pro, MacBook Pro 16", iPad Pro, Safari Window, Billboard with automatic screen clipping.
  - **Templates**: Instant starter templates (Social banners, YouTube thumbnails, Quote cards).
- **Rich Vector & Text Manipulation**:
  - Google Fonts integration (Inter, Outfit, Playfair Display, Space Grotesk, Syne, Caveat, etc.).
  - Color palettes, opacity, stroke, shadow, alignment, duplicate, layer up/down.
- **Multi-Page Layout**:
  - Add, duplicate, delete, and switch between pages.
  - Synced circular zoom slider (10% to 500%).
- **Export Engine**:
  - PNG, Retina (2x PNG), JPEG, SVG vector paths, and raw Fabric JSON backup.

---

## Quickstart

### Prerequisites

- [Rust & Cargo](https://rustup.rs/) (edition 2021+)
- Any modern web browser (Edge, Chrome, Firefox, Safari)

### Run Locally

```bash
# 1. Clone repository
git clone https://github.com/your-username/CanvasCraft.git
cd CanvasCraft

# 2. Run Rust server
cargo run
```

Server starts automatically at:
```text
🚀 EazeGraphics Server listening on http://127.0.0.1:3000
```

Open `http://127.0.0.1:3000` in your browser.

---

## Directory Structure

```text
├── Cargo.toml            # Rust dependencies & package configuration
├── src/
│   └── main.rs           # Axum router, SQLite migrations, API endpoints, asset proxy
├── public/               # Frontend single-page application
│   ├── index.html        # Canva-style UI markup
│   ├── css/
│   │   └── style.css     # Design tokens, slate/teal chrome, panels, controls
│   ├── js/
│   │   ├── api.js        # Free open asset connectors (Wikimedia, Iconify, Mockups)
│   │   ├── canvas.js     # Fabric.js canvas abstraction, history, clipping, exports
│   │   └── ui.js         # Navigation drawer, toolbar binding, layers, zoom slider
│   └── vendor/
│       └── fabric.min.js # Bundled local Fabric.js v5.3.1
└── assets/               # Local static graphics, mockups, and uploaded media
    ├── illustrations/    # Curated standalone SVG scene vector illustrations
    ├── mockups/          # SVG device mockup frames
    ├── stickers/         # Vector badges and stickers
    └── uploads/          # User-uploaded files (auto-created)
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/projects` | `GET` | List all saved design projects |
| `/api/projects` | `POST` | Create or update a design project |
| `/api/projects/:id` | `GET` | Retrieve single project canvas JSON |
| `/api/projects/:id` | `DELETE` | Delete a project |
| `/api/upload` | `POST` | Upload local image via multipart form |
| `/api/export` | `POST` | Server-side raster composite and download |
| `/api/proxy?url=...` | `GET` | Same-origin asset streaming (bypasses tracking prevention & CORS taint) |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for branch guidelines, code style standards, and local testing instructions.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
