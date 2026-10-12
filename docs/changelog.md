# Changelog

All notable changes to CanvasCraft Studio are documented here.

## [v0.2.0] - 2026-10-12

### Added
- **Multi-Page Canvas Engine**: Add, duplicate, delete, and switch pages per project.
- **Home Dashboard**: Modern dashboard with preset cards (Square, Story, YouTube, Presentation, Flyer) and SQLite project gallery.
- **Right-Click Context Menu**: Canvas context menu with duplicate, delete, z-order, flip horizontal/vertical, lock/unlock, and PNG slice export.
- **Vector Scene Illustrations**: Open vector illustration generator with 12 distinct art styles.
- **Single Share Export Button**: Replaced Canva-style header with clean dropdown for 1x PNG, 2x Retina PNG, JPEG, SVG, JSON backup, and Rust Server Composite.
- **Documentation**: Comprehensive guides in `docs/` (`usage.md`, `architecture.md`, `development.md`, `changelog.md`).

### Changed
- Switched to Studio Pro dark theme (`#090D16` / `#0E1422`) with indigo accents.
- Hardened view isolation using `.hidden` class to prevent home dashboard overlay collisions.
- Replaced third-party API dependencies with zero-config open asset streaming proxy.

### Fixed
- Fixed unconstrained SVG dimensions causing logo overflow on page reload.
- Fixed 429 rate limit issues on icon fetching via backend proxy caching.
- Fixed browser tracking prevention blocks on external CDNs.

---

## [v0.1.0] - Initial Release

### Added
- Axum web server with SQLite database persistence.
- Fabric.js canvas editor with basic shapes, text, and photo loading.
- Export pipeline for PNG and JPEG formats.
