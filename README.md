# 📺 RetroBaja — Vintage TV YouTube Music Experience

> A nostalgic, cozy music player that brings timeless 90s Bollywood, golden classics, Ghazals, and Indie Pop to life inside an authentic retro CRT television set.

Built for seamless, lightning-fast deployment on **Cloudflare Pages**.

![RetroBaja Screenshot](/public/favicon.svg)

---

## ✨ Features

- 📺 **Authentic Vintage CRT TV UI**:
  - Realistic wooden cabinet finish, rounded bezel depth, curved glass reflections, and top telescopic antennas.
  - Tactile rotary knobs for **Channel Switching** and **Volume Control** with synthesized mechanical click sounds.
  - Physical power rocker switch with glowing ruby neon pilot bulb.
  - Multi-finish cabinet selector: **Vintage Teakwood**, **80s Charcoal Slate**, and **Retro Mint**.
- 🎶 **Curated Timeless Playlist (20+ Iconic Tracks)**:
  - **CH 01**: 90s Golden Romance *(DDLJ, Jo Jeeta Wohi Sikandar, Mohra, HDDCS)*
  - **CH 02**: 2000s Millennium Hits *(RHTDM, Kal Ho Naa Ho, Dil Chahta Hai, KANK)*
  - **CH 03**: Late Night Ghazals *(Jagjit Singh, Chitra Singh, Kaifi Azmi)*
  - **CH 04**: Monsoon Melodies *(Rimjhim Gire Sawan, 1942 A Love Story, Chameli)*
  - **CH 05**: Indie Pop Revolution *(Lucky Ali, Euphoria, Silk Route)*
  - **CH 06**: Kishore & Rafi Gold *(Pal Pal Dil Ke Paas, O Mere Dil Ke Chain, Likhe Jo Khat Tujhe)*
- 🌧️ **Synthesized Ambient Soundscapes (Web Audio API)**:
  - Pure, legal, self-contained ambient audio generation: **Monsoon Rain**, **Vinyl Needle Warmth/Pops**, **Ceiling Fan Blade Hum**, and **50Hz CRT Transformer Hum**.
  - Independent volume faders and quick atmospheric presets (*"Monsoon Chai"*, *"Late Night Vinyl"*, *"Living Room"*).
- 🎛️ **Modern Player Controls**:
  - Play / Pause, Next / Previous, Track Scrubber with LED time display.
  - Smart Shuffle & Repeat Modes (`Off`, `All`, `One`).
  - "Surprise Me" track generator.
  - Favorites & Listening History persistence in `localStorage`.
- 🌙 **Cinema & Fullscreen Modes**:
  - "Lights Off" cinema backdrop for evening listening.
  - Fullscreen expanded TV view.
- ⌨️ **Rich Keyboard Shortcuts**:
  - Full desktop accessibility with single-key triggers for playback, channels, lights, and ambience.
- 📱 **Fully Responsive**:
  - Clean scaling across desktop, tablet, and mobile with a slide-out drawer.

---

## 🔒 YouTube Compliance & Privacy

RetroBaja strictly follows the [YouTube API Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service):
1. **Official IFrame API**: All playback is powered exclusively by the official YouTube IFrame Player API (`https://www.youtube.com/iframe_api`).
2. **No Ad Blocking or Circumvention**: Does not alter, inspect, block, or skip YouTube advertisements.
3. **No Hidden Player**: The embedded player is always visible and unobstructed.
4. **No Audio Extraction / Proxying**: Video streams directly from YouTube servers.
5. **Compliant Styling**: The retro television aesthetics are applied purely to the surrounding cabinet, bezels, and room atmosphere.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Vanilla CSS Modules & CSS Custom Properties (Zero runtime overhead)
- **Icons**: Lucide React
- **Audio Synthesis**: Web Audio API (tactile SFX & ambient generators)
- **Deployment**: Cloudflare Pages (Static-first with `_headers` and `_redirects`)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn / pnpm

### 2. Installation
```bash
# Clone or navigate to the repository
cd RetroBaja

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The compiled, optimized production bundle will be created in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Cloudflare Pages Deployment Guide

RetroBaja is designed to deploy to **Cloudflare Pages** out of the box with zero configuration needed.

### Method 1: Git Integration (Recommended)
1. Push your repository to GitHub or GitLab.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` or `20` (set environment variable `NODE_VERSION=20` if needed)
5. Click **Save and Deploy**.

### Method 2: Direct Upload via Wrangler CLI
```bash
# Install Wrangler globally or use npx
npm run build
npx wrangler pages deploy dist --project-name=retrobaja
```

### Built-in Cloudflare Configurations
- `public/_headers`: Configures high-performance browser caching (`Cache-Control: public, max-age=31536000, immutable`) for static assets, SVG icons, and sets security policies.
- `public/_redirects`: Configures SPA routing (`/* /index.html 200`) so all URLs resolve seamlessly.

---

## 📂 Project Structure

```
RetroBaja/
├── public/
│   ├── favicon.svg             # Vintage TV vector icon
│   ├── _headers                # Cloudflare Pages security & caching headers
│   └── _redirects              # Cloudflare Pages SPA rewrite rules
├── src/
│   ├── components/
│   │   ├── AmbientControls/    # Web Audio ambient generator & faders
│   │   │   ├── AmbientAudioEngine.ts
│   │   │   ├── AmbientControls.tsx
│   │   │   └── AmbientControls.module.css
│   │   ├── Common/             # Tactile dials, switches, and badges
│   │   │   ├── DialKnob.tsx
│   │   │   └── PowerSwitch.tsx
│   │   ├── Header/             # Brand, theme switcher, and atmosphere trigger
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── NowPlaying/         # Track title, singers, era badges, and EQ visualizer
│   │   │   ├── NowPlaying.tsx
│   │   │   └── NowPlaying.module.css
│   │   ├── PlayerControls/     # Scrubber, play/pause, shuffle, volume, lights
│   │   │   ├── PlayerControls.tsx
│   │   │   └── PlayerControls.module.css
│   │   ├── PlaylistPanel/      # Slide-out drawer with search, tabs, and filters
│   │   │   ├── PlaylistPanel.tsx
│   │   │   ├── PlaylistTrackItem.tsx
│   │   │   └── PlaylistPanel.module.css
│   │   ├── RetroTv/            # Vintage CRT television chassis & screen
│   │   │   ├── RetroTv.tsx
│   │   │   ├── RetroTv.module.css
│   │   │   ├── TvAntenna.tsx
│   │   │   ├── TvDials.tsx
│   │   │   └── TvScreenOverlay.tsx
│   │   └── ShortcutsModal/     # Keyboard shortcuts modal dialog
│   │       ├── ShortcutsModal.tsx
│   │       └── ShortcutsModal.module.css
│   ├── data/
│   │   └── playlist.json       # Curated 20+ tracks and 7 channel categories
│   ├── hooks/
│   │   ├── useAmbientAudio.ts  # State management for ambient sound
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useLocalStorage.ts  # Persistent storage for favorites & theme
│   │   ├── usePlaylist.ts      # Queue, filtering, search, and history
│   │   └── useYouTubePlayer.ts # Official YouTube Iframe API lifecycle & methods
│   ├── styles/
│   │   ├── index.css           # Global tokens, typography, CRT effects
│   │   └── themes.css          # Teakwood, Charcoal, and Mint themes
│   ├── types/
│   │   ├── player.ts           # Player and theme types
│   │   └── playlist.ts         # Track and channel types
│   ├── utils/
│   │   ├── formatTime.ts       # MM:SS time formatting
│   │   ├── sfx.ts              # Web Audio tactile click and static SFX
│   │   └── shuffle.ts          # Fisher-Yates array shuffling
│   ├── App.tsx                 # Main layout & coordinator
│   ├── main.tsx                # React entry
│   └── vite-env.d.ts           # CSS module and environment typing
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎵 How to Customize the Playlist

Edit `src/data/playlist.json` to add new tracks or channels. Each track supports:

```json
{
  "id": "trk-21",
  "youtubeVideoId": "YOUR_YOUTUBE_VIDEO_ID",
  "title": "Song Title",
  "artist": "Singer Names",
  "movieOrAlbum": "Movie / Album Name",
  "year": 1996,
  "era": "90s",
  "category": "90s Romance",
  "channelId": "90s-romance",
  "duration": "4:45",
  "language": "Hindi",
  "mood": "Romantic",
  "description": "Short nostalgic note about the song."
}
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` or `K` | Play / Pause |
| `N` or `→` | Next Track |
| `P` or `←` | Previous Track |
| `M` | Mute / Unmute Audio |
| `S` | Toggle Shuffle |
| `C` | Cycle TV Channel |
| `L` | Toggle Cinema Mode (Lights Off) |
| `F` | Toggle Fullscreen TV Mode |
| `A` | Toggle Room Ambience |
| `?` or `H` | Show Shortcuts Cheat Sheet |
| `Esc` | Close Drawers & Modals |

---

## 📜 License

MIT License — free for personal and educational use. Music videos and audio copyrights belong to their respective copyright holders on YouTube.
