# Contributing to CanvasCraft (EazeGraphics)

Thank you for your interest in contributing to CanvasCraft! We welcome bug fixes, documentation improvements, new vector asset integrations, and UI enhancements.

---

## Code of Conduct

Be kind, constructive, and respectful. Focus on technical clarity and improving the software for all users.

---

## Development Setup

1. **Prerequisites**:
   - Install Rust and Cargo via [rustup](https://rustup.rs/).
   - (Optional) Install Node.js if working on asset generation scripts.

2. **Fork and Clone**:
   ```bash
   git clone https://github.com/<your-username>/CanvasCraft.git
   cd CanvasCraft
   git checkout -b feature/your-feature-name
   ```

3. **Run Locally**:
   ```bash
   cargo run
   ```
   Open `http://127.0.0.1:3000` in your web browser.

4. **Hot Reloading Frontend**:
   Frontend files under `public/` (HTML, CSS, JS) are served dynamically by Axum. Refreshing your browser immediately reflects changes without restarting `cargo run`.

---

## Architectural Guidelines

### 1. Zero-Config & Zero API Keys Requirement
CanvasCraft is strictly zero-config. **Never introduce dependencies or external asset engines that require user API keys, paid tokens, or mandatory logins.** All online integrations must remain 100% free and publicly accessible.

### 2. Frontend Conventions
- **No Heavy Frameworks**: Keep the client fast, lightweight, and dependency-free.
- **Vanilla CSS**: All design system styles belong in `public/css/style.css`. Avoid TailwindCSS or complex preprocessors unless explicitly agreed upon.
- **Same-Origin Asset Routing**: Always pass external image or SVG URLs through `API.proxyUrl(url)` before setting `<img src>` or loading into Fabric.js. This prevents browser Tracking Prevention blocking and canvas security tainting.

### 3. Backend Conventions (Rust)
- Format code using `cargo fmt`.
- Ensure no compilation warnings: `cargo check` and `cargo clippy`.
- Keep database queries inside async handlers via `sqlx`.
- Avoid hardcoded absolute filesystem paths; use relative project paths.

---

## Contribution Workflow

1. Create a descriptive branch:
   ```bash
   git checkout -b fix/icon-svg-rendering
   # or
   git checkout -b feat/export-pdf-support
   ```
2. Commit your changes with clear, imperative messages:
   ```bash
   git commit -m "Add keyboard shortcut for duplicate (Ctrl+D)"
   ```
3. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request against the `main` branch. Provide a brief explanation of the change, screenshots for UI changes, and steps to test.

---

## Areas Open for Contribution

- [ ] PDF export support using Rust vector renderers.
- [ ] Pen tool / bezier curve drawing mode.
- [ ] Layer panel with drag-and-drop reordering.
- [ ] Additional device mockups (Smartwatch, Billboard, Book Cover).
- [ ] Local asset caching in SQLite.
