# LEGO Bedroom Diorama

[![CI](https://github.com/chaitanya2692/diorama/actions/workflows/ci.yml/badge.svg)](https://github.com/chaitanya2692/diorama/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-blue?logo=github)](https://chaitanya2692.github.io/diorama/)

Procedural, interactive Three.js recreation of the supplied LEGO bedroom reference. The scene is static and visual: it is not a Home Assistant custom card and does not read or control HA entities.

## Run locally

```sh
npm install
npm run dev
```

Drag to orbit and use the wheel or a pinch gesture to zoom. Production files are generated in `dist/`:

```sh
npm run build
```

## Home Assistant

Copy the contents of `dist/` into `/config/www/bedroom/` (create the directory first). Home Assistant serves this directory below `/local/bedroom/`.

Use the built-in Lovelace iframe card:

```yaml
type: iframe
url: /local/bedroom/index.html
aspect_ratio: 100%
```
