# System Architecture

CanvasCraft Studio is architected with a local-first design paradigm.

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client Layer                     │
│                                                             │
│  ┌────────────────┐  ┌───────────────────┐  ┌─────────────┐ │
│  │  UI Controller │  │ Fabric.js Engine  │  │ API Client  │ │
│  │    (ui.js)     │  │   (canvas.js)     │  │  (api.js)   │ │
│  └───────┬────────┘  └─────────┬─────────┘  └──────┬──────┘ │
└──────────┼─────────────────────┼───────────────────┼────────┘
           │ HTTP Fetch / Assets │                   │
┌──────────▼─────────────────────▼───────────────────▼────────┐
│               Axum Web Server (Rust / Tokio)                │
│                                                             │
│  ┌───────────────────────┐         ┌─────────────────────┐  │
│  │ Asset Proxy Engine    │         │ Static File Server  │  │
│  │ (CORS bypass/caching) │         │ (tower-http)        │  │
│  └───────────────────────┘         └─────────────────────┘  │
│                                                             │
│  ┌───────────────────────┐         ┌─────────────────────┐  │
│  │ Project CRUD API      │         │ Export Composite    │  │
│  │ (Axum routes)         │         │ (image processing)  │  │
│  └───────────┬───────────┘         └─────────────────────┘  │
└──────────────┼──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    Persistence Layer                        │
│                   SQLite (canva_local.db)                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Client Engine (`public/js/`)
- `canvas.js`: Wraps Fabric.js with multi-page management (`pages` array), history stack (undo/redo), responsive scaling, and element transforms.
- `ui.js`: DOM event orchestrator, rail tabs, drawer accordions, property inspector binding, and context menu.
- `api.js`: Thin client for communicating with local Axum endpoints.

### 2. Backend Server (`src/main.rs`)
- Built on **Axum 0.7** and **Tokio**.
- **SQLite with SQLx**: Project schema stores project ID, title, canvas pages JSON, thumbnail, width, height, and timestamp.
- **Asset Proxy (`/api/proxy`)**: Streams SVG icons and photos from free open web sources, stripping tracking and bypassing browser CORS blocks without requiring third-party API keys.
- **Rasterizer Engine (`/api/export`)**: Server-side image decoding and composite generation.

### 3. Open Asset Library (`assets/`)
- Local standalone SVG assets and generative scene vector illustrations stored in `/assets/illustrations/` ensuring zero offline downtime.
