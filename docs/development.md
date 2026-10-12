# Development Guide

## Prerequisites

- [Rust & Cargo](https://rustup.rs/) (edition 2021 or newer)
- Modern web browser (Chrome, Edge, Firefox, Brave)
- Node.js (optional, for asset generation scripts)

## Running Locally

```bash
# Clone the repository
git clone https://github.com/urkiddennn/CanvasCraft.git
cd CanvasCraft

# Run server
cargo run
```

Server starts on `http://127.0.0.1:3000`. Axum serves the frontend directly from `public/`. Changes in `public/` (HTML, CSS, JS) reload immediately upon browser refresh.

## Project Structure

```
├── Cargo.toml                  # Rust dependencies (Axum, Tokio, SQLx, Reqwest, Image)
├── src/
│   └── main.rs                 # Backend server, SQLite setup, API endpoints
├── public/                     # Frontend static assets
│   ├── css/
│   │   └── style.css           # Studio Pro dark design tokens & layout
│   ├── js/
│   │   ├── api.js              # REST API client
│   │   ├── canvas.js           # Fabric.js wrapper with multi-page state
│   │   └── ui.js               # Studio UI controller & event listeners
│   ├── vendor/
│   │   └── fabric.min.js       # Standalone Fabric.js bundle
│   └── index.html              # Studio editor & home dashboard DOM
├── assets/                     # Local vector assets and illustrations
├── docs/                       # Project documentation
└── canva_local.db              # Local SQLite database (created automatically)
```

## Adding New Features

- **New Asset Categories**: Add tab button to `.studio-rail` in `public/index.html` and handle the tab render in `renderDrawerTab(tab)` in `public/js/ui.js`.
- **New Export Formats**: Hook into the export menu options in `public/js/ui.js` using `engine.exportPNG()`, `engine.exportJPEG()`, or `engine.exportSVG()`.
- **Backend Endpoints**: Register new routes in `Router::new()` within `src/main.rs`.
