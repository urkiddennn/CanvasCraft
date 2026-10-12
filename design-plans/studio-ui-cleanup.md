# Studio Surface Cleanliness & Viewport Isolation Plan

Written against: HEAD

## Evidence chain

- Surface: `public/index.html`, `public/css/style.css`, `public/js/ui.js`
- Problem: Obsolete artifacts, unshielded view switching, and loose drawer hierarchy cause visual collisions between home dashboard and editor workspace.
- Design evidence: Dark studio tokens in `public/css/style.css`, structural HTML in `public/index.html`.
- Owner: `public/css/style.css`, `public/js/ui.js`
- Scope and affected surfaces: Editor canvas stage, Left navigation rail, Home dashboard overlay.
- Uncertainty: None.

## Design decision

Enforce strict visibility gating via `.hidden` class (`display: none !important;`), isolate Home Dashboard as a standalone top-level route/view, crisp vector SVG icons with defined inline dimensions, and structured sectioning in drawer panels.

## Reuse

- Tokens: `--bg-app`, `--bg-stage`, `--bg-panel`, `--primary`, `--border-default`, `--font-sans`
- Exemplar: `public/css/style.css`

## Changes

1. `public/css/style.css`
   - Change: Add `.hidden { display: none !important; }`. Ensure `#home-screen-view` is strictly isolated with `position: fixed; inset: 0; z-index: 200;` when visible. Add clear drawer section category dividers and vector tags.
   - Preserve: Design tokens, fabric stage scrolling, zoom controls, context menu styling.
   - Verify: Workspace stays 100% clean on load without any overlay leak.

2. `public/index.html`
   - Change: Add class `hidden` directly to `#home-screen-view`. Add explicit `width` and `height` attributes to all SVG elements to prevent unstyled rendering jumps.
   - Preserve: Element IDs and event hooks.
   - Verify: Canvas workspace loads cleanly with crisp proportions.

3. `public/js/ui.js`
   - Change: Update `openHomeScreen` and `closeHomeScreen` to toggle `.hidden` class rather than inline style manipulations. Structure Elements drawer into categorized accordions (Basic Shapes, Crisp Icons, Scene Illustrations).
   - Preserve: Canvas multi-page state management and SQLite persistence.
   - Verify: Home button toggles cleanly, Elements drawer shows clean hierarchy.

## Scope

- Inherit: All tools and canvas elements.
- Verify: Chrome / Edge viewport at 100% zoom and mobile-responsive bounds.
- Exclude: Rust backend API routes (already operational).

## Validation

- Product: Studio opens directly into clean canvas. Home button opens dashboard. "Open Current Design" returns cleanly.
- Interface: Zero overlapping views. Crisp vector icons.
- System: No console errors, no unstyled HTML layout flash.

## Stop conditions

- Stop if SQLite database calls or Fabric canvas viewport binding fails.

## Design documentation

- None.
