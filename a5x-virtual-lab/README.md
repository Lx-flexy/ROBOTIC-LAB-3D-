# SRI Public School — Virtual Robotics & Innovation Lab

An interactive 3D virtual-tour website built with **Three.js**, **GSAP**, and **Vite**. Walk through a full-scale robotics lab with WASD controls on desktop or touch joystick on mobile.

![Virtual Lab Preview](https://img.shields.io/badge/3D-Virtual%20Tour-ff7a00?style=for-the-badge)

## 🚀 Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
```

## 📦 Build & Deploy

```bash
npm run build      # outputs to dist/
npm run preview    # preview production build locally
```

### Deploy to Netlify / Vercel / GitHub Pages

- **Netlify**: drag `dist/` folder to Netlify Drop, or connect the repo with build command `npm run build` and publish directory `dist`
- **Vercel**: `npx vercel --prod` (auto-detects Vite)
- **GitHub Pages**: push `dist/` contents to `gh-pages` branch

## 🎮 Controls

| Platform | Move | Look | Sprint | Interact |
|----------|------|------|--------|----------|
| Desktop | WASD / Arrow keys | Mouse drag / Pointer lock | Shift | Click hotspots |
| Mobile | Left joystick | Drag right half | — | Tap hotspots |

## 🏗️ Project Structure

```
src/
├── main.js                    # Entry point, animation loop, state machine
├── config.js                  # Brand name, colours, zone data, hotspots
├── styles.css                 # Responsive UI styles
├── controls/
│   └── FirstPersonControls.js # WASD + mouse + mobile joystick + collision
├── scene/
│   ├── building.js            # Hall shell, walls, ceiling, doors, exterior
│   ├── props/
│   │   ├── furniture.js       # Tables, chairs, plants, monitors, racks, signs
│   │   └── equipment.js       # 3D printers, drones, robot cars, robotic arms
│   └── zones/
│       ├── centre.js          # Central tables & chairs
│       ├── backwall.js        # 3D Printing, Design, Coding zones
│       ├── testing.js         # Testing Zone arena (soccer, race, obstacles)
│       └── rightwall.js       # Smart Learning Wall & Robotics Lab Wall
├── ui/
│   ├── loader.js              # Loading screen with progress bar
│   ├── menu.js                # Zone teleport menu & zone proximity cards
│   ├── infoPanel.js           # Clickable hotspot info panels
│   ├── minimap.js             # Bottom-right minimap with player position
│   └── sound.js               # Ambient sound toggle
└── utils/
    ├── geometry.js            # box(), cyl(), put() helpers
    ├── materials.js           # Cached materials, canvas textures, stripes
    └── performance.js         # Adaptive quality detection, WebGL fallback
```

## 🎨 Branding

Change the brand name in `src/config.js`:

```js
export const BRAND_NAME = 'A5X Industries';  // or 'SRI'
export const BRAND_SHORT = 'A5X';            // or 'SRI'
```

### Colour Palette

| Colour | Hex | Usage |
|--------|-----|-------|
| Navy | `#14284b` | Walls, signs, panels |
| Orange | `#ff7a00` | Accents, buttons, highlights |
| Cream | `#fff1e3` | Wall paint |
| Wood | `#deb887` | Table tops |

## 🏛️ Lab Zones

1. **3D Printing Zone** — Bambu Lab style printers, filament spools, pegboard tools
2. **Design Zone** — CAD workstations with dual monitors
3. **Coding Zone** — Code editors, Python/C++/Web Dev books, GitHub hex icons
4. **Testing Zone** — Robo Soccer field, Race track, Line Following mat, Obstacle course
5. **Smart Learning Wall** — 75″ smart TV with topic icons, glowing cabinet
6. **Robotics Lab Wall** — Workbench with robotic arm, drones, robot cars

## ⚡ Performance

- Adaptive quality: caps pixel ratio on low-end devices, reduces lights
- Canvas textures (no external image loading)
- Material caching to avoid duplicate GPU uploads
- Code-split bundles: Three.js / GSAP / app code
- Targets 60fps desktop, 30+ fps mobile

## 📋 Known Limitations

- All geometry is procedural (box/cylinder primitives) — no GLB models loaded
- No shadow maps (performance choice for mobile compatibility)
- Ambient sound is a simple Web Audio oscillator, not recorded audio
- Minimap is 2D top-down, not a 3D inset
- Collision is axis-aligned bounding boxes only (no diagonal surfaces)

## 📄 License

MIT
