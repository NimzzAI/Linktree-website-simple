# NimzzAI — Links & Profile

A high-performance, responsive personal link hub and iOS-styled interactive media player built with React, Vite, Framer Motion, and Web Audio.

Developed for **NimzzAI** ([github.com/NimzzAI](https://github.com/NimzzAI)).

---

## ✨ Features

- **🕒 Real-Time Clock (WIB - Asia/Jakarta)**:
  - Live 24-hour clock synchronized to **Indonesia / Jakarta Timezone (WIB - UTC+7)** displaying `HH:mm:ss WIB`.
  - Interactive top HUD pill button to instantly toggle between live Jakarta time and availability status (`Available for projects`).
  - Pulsing live indicator with sound-assisted interaction feedback.

- **🎵 iOS-Inspired Music Player**:
  - **Dynamic Island Capsule**: Sleek, compact bottom pill displaying album art, real-time soundwave visualizer bars, track metadata, and quick play/pause control.
  - **Apple Music Now Playing Sheet**:
    - Opaque, solid high-contrast dark card with background scrim to prevent visual clutter.
    - Responsive artwork scaling during playback.
    - AirPlay speaker route indicator badge.
    - Interactive seek scrubber with elapsed and remaining timestamps (`-mm:ss`).
    - Quick forward/rewind skip controls (±10 seconds).
    - Repeat / loop toggle, favorite bookmarking, and native volume slider.
    - "Apple Music Lossless (24-bit / 48kHz ALAC)" aesthetic badge.
    - Centered layout with responsive height guards (`max-height` breakpoints) ensuring no UI clipping across mobile, tablet, and desktop views.

- **🎬 Dynamic Background Atmosphere**:
  - Cycle between 3 distinct backdrops via the HUD button:
    1. **Cinema View**: Atmospheric video background with custom overlay.
    2. **Minimal Dark**: Pure OLED deep-black surface for maximum focus and battery efficiency.
    3. **Studio Ambient**: Radial gradient canvas with subtle depth lighting.

- **🔊 Tactile Haptic Audio Feedback**:
  - Integrated low-latency Web Audio API sine-wave synthesizer generating subtle physical click feedback on interactions.
  - One-click mute/unmute control directly in the top HUD.

- **📲 Profile Sharing & QR Code**:
  - Built-in share modal with instant dynamic QR Code generation for seamless scanning on mobile devices.
  - Native Web Share API integration with automatic fallback to clipboard URL copying.

- **🔗 Refined Link & Social Cards**:
  - Staggered entrance animation powered by Framer Motion.
  - Independent quick-copy button on every social card.
  - Profile identity section with username copy button and tech stack pills.

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React + FontAwesome 6
- **Audio Engine**: Web Audio API (tactile feedback) + HTML5 Audio Element (music playback)
- **Utilities**: `qrcode.react`, Canvas-free vector icons

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/NimzzAI/Linktree-website-simple.git
cd Linktree-website-simple

# Install dependencies
npm install

# Start development server (port 3000)
npm run dev
```

### Production Build

```bash
# Build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

---

## ⚙️ Configuration (`src/settings.js`)

You can customize the profile, links, tracks, and metadata directly in `src/settings.js`:

```javascript
export const settings = {
    site: {
        siteUrl: "https://github.com/NimzzAI",
        title: "NimzzAI — Links & Profile",
        description: "Official links, projects, and media hub of NimzzAI",
        favicon: "/favicon.ico"
    },
    profile: {
        username: "NimzzAI",
        name: "NimzzAI",
        handle: "@NimzzAI",
        title: "Frontend & Creative Developer",
        bio: "Crafting fast, refined interfaces and exploring modern web engineering.",
        avatar: "/avatar.jpg",
        videoBg: "/bg-video.mp4",
        status: "Available for projects",
        location: "Indonesia",
        stack: ["React", "TypeScript", "Vite", "Node.js", "Tailwind CSS"]
    },
    music: {
        title: "Ntah",
        artist: "mboh su",
        cover: "/cover.jpg",
        audio: "/lagu.mp3"
    },
    links: [
        { 
            id: 1, 
            title: "GitHub", 
            subtitle: "github.com/NimzzAI", 
            url: "https://github.com/NimzzAI", 
            icon: "fa-brands fa-github", 
            tag: "Repositories" 
        },
        // Add more links here...
    ]
};
```

---

## 📄 License

MIT License © [NimzzAI](https://github.com/NimzzAI)

