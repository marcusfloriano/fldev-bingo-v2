# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Painel de Bingo — a real-time bingo board built with React + TypeScript + Vite + Three.js on the frontend and an Express/WebSocket server on the backend. The app renders entirely in a Three.js Canvas (no traditional DOM UI except for an overlay Settings panel).

## Commands

### Development (runs both client and server concurrently)
```bash
npm run dev
```

### Client only
```bash
npm run dev:client   # Vite dev server on http://localhost:5173
```

### Server only
```bash
npm run dev:server   # Express + WebSocket on http://localhost:3001
```

### Build & lint
```bash
npm run build   # tsc + vite build
npm run lint    # eslint
```

> The server has its own `package.json` in `server/`. Run `npm install` there separately if needed.

## Architecture

### Two-screen model
The app has two views toggled by `Ctrl+Shift+P` or the gear icon:
- **PrincipalScreen** — the audience-facing bingo board (75 balls, sorted panel, news panel)
- **ControlScreen** — the operator panel (same grid but balls are clickable, plus roll/clear buttons and zoom controls)

`App.tsx` owns the toggle state and renders only one screen at a time inside a single `<Canvas>`. Each screen has its own `OrthographicCamera` with an independently adjustable zoom level persisted via the server.

### Real-time sync
The server (`server/src/index.ts`) maintains state in `server/src/db.json` via **lowdb** and broadcasts updates over WebSocket. The frontend has a single shared WebSocket connection (`src/websocketClient.ts`) multiplexed through named channels (`'principal'`, `'zoom'`). Both screens subscribe independently via their local `useWebSocket` hooks.

### Ball state flow
1. Operator clicks a ball or presses "SORTEIO" in `ControlScreen`
2. `postBall(number, sorted)` POSTs to `/balls` — the server toggles the ball in db.json and broadcasts `{ action: 'balls', type: 'added'|'removed', ... }`
3. `PrincipalScreen` receives the WS message and calls `ref.current.activate()` / `deactivate()` on the corresponding `Ball` component via `useImperativeHandle`
4. When `sorted: true`, a 6-second roll animation plays in both screens (3 s suspense → reveal)

### REST API (`src/api.ts`)
All calls go to `http://localhost:3001`. Key endpoints:
- `GET/POST /balls` — read or toggle a ball; POST body: `{ number, sorted }`
- `POST /balls/clear` — reset all balls
- `GET/POST /zoom` — read or set `{ ctrlZoomPanel, sortedZoomPanel }` (camera zoom integers)

### 3D rendering notes
- All UI elements are Three.js objects (`<Text>`, `<Plane>`, `<mesh>` with `sphereGeometry`)
- `Ball` uses a `CanvasTexture` drawn at runtime to render the number with an `impact` font
- Sound is played via `THREE.Audio` + `THREE.AudioLoader` (not the Web Audio API directly)
- `ControlScreen` exposes `window.toggleSortedMusic` and `window.playSoundFromUI` for external control from the Settings overlay (which renders outside Canvas)

### Settings overlay
`Settings` renders as a regular DOM overlay (outside the Three.js Canvas). It communicates with `ControlScreen`'s Three.js audio via the `window.*` globals registered in a `useEffect`.

### Persistence
`server/src/db.json` is the live database (in dev) — it is excluded from Vite's file watcher to prevent hot-reload loops. It is **not** committed (gitignored) to avoid deploy conflicts on `git pull`; lowdb auto-creates it from defaults on first write, or copy `server/src/db.example.json` to seed it. In production the live state lives in `server/dist/db.json` (also gitignored). Reset state manually or via `POST /balls/clear` + `POST /zoom`.

### Environment variables (`src/api.ts`, `src/App.tsx`, `src/components/PrincipalScreen.tsx`)
- `VITE_API_URL` — base URL for REST calls (empty = relative path, routed by Nginx)
- `VITE_WS_URL` — WebSocket URL (empty = derived from `window.location`, auto `wss://` on HTTPS)
- Configured in `.env.production`; in dev, falls back to same-host defaults

## Production deployment

**URL:** https://bingo.fldev.com.br  
**Server:** srv712811.hstgr.cloud — Ubuntu 24.04, Node 22, Nginx, PM2  
**Process:** PM2 process named `bingo-server` runs `server/dist/index.js` on port 3001  
**Static files:** `/var/www/bingo/dist` served by Nginx  
**Nginx config:** `/etc/nginx/sites-available/bingo.fldev.com.br`
- `GET/POST /balls`, `GET/POST /zoom` → proxied to Node.js :3001
- `/ws` → WebSocket proxy to Node.js :3001
- Everything else → SPA (`try_files … /index.html`)

### Update procedure
```bash
cd /var/www/bingo
git pull
npm install --legacy-peer-deps && npm run build
cd server && npm install && npm run build
pm2 restart bingo-server
```
