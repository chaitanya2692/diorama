# LEGO Bedroom Diorama

[![CI](https://github.com/chaitanya2692/diorama/actions/workflows/ci.yml/badge.svg)](https://github.com/chaitanya2692/diorama/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue?logo=github)](https://chaitanya2692.github.io/diorama/)

Interactive Three.js LEGO recreation of the real master bedroom, replacing the original proof of concept. The apartment floor plan controls the 280 × 453 cm interior, stepped north return, 164 cm south window, and 75/66 cm empty doorways. Furniture and heights use the approved photograph/reference estimates; one nominal stud represents 10 cm. No doors, window backdrop, wall circle, or extra pillows are rendered.

## Run locally

```sh
npm install
npm run dev
```

Drag to orbit and use the wheel or a pinch gesture to zoom. Production files are generated in `dist/`:

```sh
npm run build
```

## Bedroom geometry and official parts

The custom bedside toy, tank appliance, flowering sill plant, and radiator are built from official LDraw parts. Refresh their bundled assets with `npm run sync-ldraw`; upstream attribution and license headers remain in `public/ldraw/`. No assets are fetched from LDraw at runtime.

`src/rooms/bedroom.js` owns the surveyed shell and room assembly; `furniture.js` owns brick-built furniture and custom objects, `materials.js` the shared palette, and `geometry.js` the centimetre-fitting helpers. `src/apartment.js` places completed room groups in parent-local stud coordinates; the master bedroom starts at the origin. `src/lighting.js` owns mode lighting and bounds-fitted shadows, while `src/main.js` owns camera framing and controls.

Run the surveyed geometry regression with:

```sh
node scripts/check-bedroom.js
```

This checks the measured shell, stepped floor, clear openings, single-pillow bounds, finite geometry, and shadow flags. Day/night and night-only Lights off/on remain available; drag to orbit and scroll/pinch to inspect details.

## Home Assistant

Copy the contents of `dist/` into `/config/www/bedroom/` (create the directory first). Home Assistant serves this directory below `/local/bedroom/`.

Use the built-in Lovelace iframe card:

```yaml
type: iframe
url: /local/bedroom/index.html
aspect_ratio: 100%
```
