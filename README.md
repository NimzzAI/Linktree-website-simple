# NimzzAI — Links & Profile

A clean, high-performance personal link hub and media player built with React, Vite, Framer Motion, and Web Audio.

Developed for **NimzzAI** ([github.com/NimzzAI](https://github.com/NimzzAI)).

---

## Features

- **Staggered Entrance Motion**: Smooth fade-in and subtle translation on social link cards using Framer Motion with cubic-bezier easing.
- **Background Switcher**: Switch between Cinema Video, Minimal Dark (OLED), and Studio Ambient backdrops.
- **Interactive Audio Player**:
  - Floating dock with real-time waveform bars and spinning vinyl thumbnail.
  - Expandable panel with audio scrubber, volume slider, mute toggle, and track repeat.
- **Audio Feedback**: Built-in low-latency sine synthesizer for tactile click feedback (toggleable).
- **Profile Share & QR Code**:
  - Modal with instant QR code rendering for quick mobile scanning.
  - Native Web Share API integration with one-click clipboard fallback.
- **Direct Link Card Actions**: Quick copy button on each card and external navigation links.
- **Time & Availability HUD**: Live clock toggle and availability indicator.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Animations**: Framer Motion 11
- **Icons**: Lucide React & FontAwesome 6
- **Audio**: Web Audio API & HTML5 Audio
- **Typography**: Space Grotesk & Plus Jakarta Sans

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/NimzzAI/Linktree-website-simple.git
cd Linktree-website-simple
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

---

## Configuration (`src/settings.js`)

All profile information, links, and media assets are configured in `src/settings.js`:

```javascript
export const settings = {
    site: {
        siteUrl: "https://github.com/NimzzAI",
        title: "NimzzAI — Links & Profile",
        description: "Official profile, verified links, and media player of NimzzAI"
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
    links: [ ... ]
};
```

---

## License

MIT License © [NimzzAI](https://github.com/NimzzAI)
