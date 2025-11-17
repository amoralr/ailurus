# 🐼 Ailurus - Branding & Identity

**Project Name**: Ailurus  
**Tagline**: _Documentation that evolves with your code_  
**Date**: November 17, 2025

---

## 📛 Name Origin

**Ailurus** is the scientific genus name for the red panda (_Ailurus fulgens_).

### Why Ailurus?

- 🦊 **Unique & Memorable**: Scientific name, not commonly used
- 🌍 **International**: Easy to pronounce in multiple languages
- 🎯 **Professional**: Sounds sophisticated and technical
- 🔍 **SEO Friendly**: Unique enough to dominate search results
- 🐼 **Red Panda Connection**: Subtle reference to documentation theme

---

## 🌐 Digital Presence

### Primary Domains

```
ailurus.dev         → Main product site
ailurus.io          → Alternative TLD
getailurus.com      → Marketing site
```

### Subdomains

```
app.ailurus.dev     → Web application
api.ailurus.dev     → Backend API
docs.ailurus.dev    → Documentation
cdn.ailurus.dev     → Static assets
```

### GitHub Organization

```
github.com/ailurus
├── /ailurus           → Main monorepo
├── /ailurus-cli       → CLI tool
├── /ailurus-themes    → UI themes
└── /ailurus-plugins   → Plugin ecosystem
```

---

## 📦 Package Naming

### NPM Scope

```json
{
  "name": "@ailurus/core",
  "name": "@ailurus/web",
  "name": "@ailurus/api",
  "name": "@ailurus/cli",
  "name": "@ailurus/ui",
  "name": "@ailurus/types",
  "name": "@ailurus/config"
}
```

### Standalone Packages

```bash
ailurus                # Main CLI
create-ailurus-app     # Starter template
ailurus-plugin-mermaid # Plugins
```

---

## 🐳 Docker Images

### Official Images

```bash
ailurus/web:latest
ailurus/web:1.0.0
ailurus/web:1.0.0-alpine

ailurus/api:latest
ailurus/api:1.0.0
ailurus/api:1.0.0-alpine

ailurus/all-in-one:latest
```

### Docker Compose

```yaml
services:
  ailurus-web:
    image: ailurus/web:latest
    container_name: ailurus-web

  ailurus-api:
    image: ailurus/api:latest
    container_name: ailurus-api
```

---

## 🎨 Visual Identity

### Logo - Pixel Art Red Panda

![Ailurus Logo](./logo.png)

**Official Logo:** `logo.png` - Pixel art red panda mascot in frontal view

---

### Logo Design - Pixel Art Style

**Design Concept:**

- Pixel art red panda face in frontal view
- 32x32 or 64x64 pixel resolution
- Retro 16-bit gaming aesthetic with modern colors
- Cute but professional, developer-friendly

**Key Features:**

- Front-facing red panda with large symmetrical eyes
- Triangular ears, small nose, optional tiny smile
- Pure pixel art (no anti-aliasing, no gradients)
- Each pixel intentional and visible
- Perfect symmetry (left/right mirror)

---

### Color Palette

```css
/* Primary Colors */
--ailurus-red: #e63946; /* Red panda red - PRIMARY for logo */
--ailurus-orange: #f77f00; /* Red panda orange - ACCENT for logo */
--ailurus-brown: #774936; /* Red panda brown - DETAILS for logo */

/* Accent Colors */
--ailurus-cream: #f4f1de; /* Light backgrounds */
--ailurus-dark: #1a1a1a; /* Dark mode backgrounds */

/* Semantic Colors */
--ailurus-success: #06d6a0;
--ailurus-warning: #ffd166;
--ailurus-error: #ef476f;
--ailurus-info: #118ab2;
```

#### **Color Usage for Logo**

| Color           | Hex       | Usage in Logo                              |
| --------------- | --------- | ------------------------------------------ |
| **Primary Red** | `#E63946` | Main body, face outline, primary elements  |
| **Orange**      | `#F77F00` | Accents, highlights, gradients             |
| **Brown**       | `#774936` | Details, shadows, secondary elements       |
| **White**       | `#FFFFFF` | Inner details, eyes, light mode background |
| **Dark**        | `#1A1A1A` | Dark mode version, outlines                |

#### **Color Combinations**

```
Light Mode Logo:  #E63946 + #774936 on #FFFFFF
Dark Mode Logo:   #F77F00 + #FFB703 on #1A1A1A
Monochrome:       #1A1A1A (black) or #FFFFFF (white)
Gradient:         Linear #E63946 → #F77F00 (45deg)
```

**Style References:**

- Classic 16-bit sprites: SNES, Genesis era
- Modern indie games: Stardew Valley, pixel art icons
- Emoji-style but pixelated

**Technical Specs:**

- Resolution: 32x32px or 64x64px base
- Pixel-perfect symmetry
- Limited palette: 4-6 colors max
- Character size: 24-28px within 32x32 canvas (or 48-56px in 64x64)
- 2-4 pixel border padding

### Logo File Requirements

#### **Required Formats & Sizes**

```
Pixel Art Versions:
├── logo-32x32.png          → Original pixel art (favicon size)
├── logo-64x64.png          → 2x scale
├── logo-128x128.png        → 4x scale
├── logo-256x256.png        → 8x scale
├── logo-512x512.png        → 16x scale (app stores)
└── logo-1024x1024.png      → 32x scale (high-res)

Icon Formats:
├── favicon.ico             → 16x16, 32x32, 48x48
├── favicon.png             → 32x32 (modern browsers)
├── apple-touch-icon.png    → 180x180 (iOS)
└── android-icon.png        → 192x192 (Android)

Social Media:
├── social-preview.png      → 1200x630 (Open Graph, scaled pixel art)
├── twitter-card.png        → 800x418 (Twitter, scaled pixel art)
└── github-avatar.png       → 512x512 (GitHub org avatar)
```

#### **Scaling Rules**

**CRITICAL:** Use **nearest-neighbor** interpolation only

- ✅ Keeps pixels sharp and visible
- ✅ Maintains retro aesthetic
- ❌ Never use smooth/bilinear scaling

**Tools for Pixel-Perfect Scaling:**

```bash
# ImageMagick (nearest-neighbor)
magick logo-32x32.png -filter point -resize 512x512 logo-512x512.png

# Online: pixelartscaler.com, lospec.com/pixel-art-scaler
# Photoshop: Image Size → Nearest Neighbor (hard edges)
# GIMP: Scale Image → Interpolation: None
```

#### **File Format Specs**

```
Format:       PNG-8 with alpha transparency
Compression:  Lossless only (no JPG artifacts)
Color mode:   RGB + Alpha
Bit depth:    8-bit (256 colors max)
Background:   Transparent (alpha channel)
```

---

## 💬 Tone & Voice

### Brand Personality

- **Professional** but approachable
- **Technical** but not intimidating
- **Modern** and cutting-edge
- **Friendly** like a red panda 🦊
- **Nostalgic** with retro gaming aesthetic

### Messaging Examples

```
✅ "Document your code the way red pandas climb - naturally and gracefully"
✅ "Ailurus: Where documentation meets evolution"
✅ "Your living documentation companion"
✅ "Built for developers, loved by teams"
✅ "Retro charm, modern power"

❌ "The ultimate docs platform" (too generic)
❌ "Revolutionary documentation" (too marketing-heavy)
```

---

## 🚀 Product Positioning

### Taglines

**Primary**: _Documentation that evolves with your code_

**Alternatives**:

- _Living documentation for modern teams_
- _Code documentation, naturally_
- _Your docs, alive and breathing_
- _Pixel-perfect documentation_

### Elevator Pitch

> **Ailurus** is a modern documentation framework that combines the simplicity of Markdown with real-time collaboration. Built on Astro and NestJS, it offers developers a clean, fast, and scalable solution for living documentation that grows with their codebase.

### Target Audience

- 👨‍💻 **Primary**: Engineering teams (5-50 people)
- 📚 **Secondary**: Technical writers, DevOps teams
- 🎯 **Tertiary**: Open source maintainers
- 🎮 **Appeal**: Developers who appreciate retro gaming aesthetics

---

## 📱 Social Media

### Handles

```
@ailurusdev       → Twitter/X
@ailurus.dev      → Instagram
/company/ailurus  → LinkedIn
```

### Hashtags

```
#ailurus
#ailurusdev
#livingdocs
#devdocs
#documentationframework
#pixelart
#indiedev
```

### Profile Images

- Use 512x512 pixel art logo (scaled from 32x32 or 64x64)
- Maintain pixel-perfect aesthetic in all sizes
- Add subtle background color (#F4F1DE cream) for profiles requiring non-transparent

---

## 🔗 CLI Commands

### Installation

```bash
# NPM
npm install -g ailurus

# Yarn
yarn global add ailurus

# pnpm
pnpm add -g ailurus
```

### Usage

```bash
ailurus init my-docs          # Initialize new project
ailurus dev                   # Start dev server
ailurus build                 # Build for production
ailurus deploy                # Deploy to hosting
ailurus version               # Show version
ailurus help                  # Show help

# Aliases
ailurus new my-docs           # Same as init
ailurus start                 # Same as dev
```

---

## 📄 License & Copyright

```
MIT License

Copyright (c) 2025 Ailurus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT License text...]
```

---

## 🎯 Marketing One-Liners

For different contexts:

### GitHub README

> A modern, real-time documentation framework built with Astro and NestJS.

### Product Hunt

> Ailurus brings your documentation to life with real-time collaboration, powerful search, and a beautiful developer experience. Plus, it has a cute pixel art mascot! 🐼

### Conference Talks

> Meet Ailurus - the documentation framework that treats your docs like living code, with a nostalgic pixel art twist.

### Job Postings

> We're building Ailurus, a next-generation documentation platform for modern development teams.

---

## 🌟 Feature Naming Convention

Keep it simple and descriptive:

```
✅ "Live Preview"
✅ "Real-time Presence"
✅ "Smart Search"
✅ "Auto-save"
✅ "Dark Mode"
✅ "Pixel Perfect Editor" (if theme available)

❌ "Ailurus Live™"
❌ "Presence Pro"
❌ "SuperSearch"
```

---

## 📊 Success Metrics

### Community Goals

- 📦 1,000+ npm downloads/week (Year 1)
- ⭐ 5,000+ GitHub stars (Year 1)
- 👥 100+ active contributors
- 🌍 50+ companies using in production
- 🎨 Recognition for unique pixel art branding

### Technical Goals

- ⚡ <50ms API response time
- 🎨 100/100 Lighthouse score
- 📱 Mobile-first responsive
- ♿ WCAG 2.1 AA accessibility
- 🖼️ Logo renders perfectly at all sizes (16px to 1024px)

---

## 🎮 Brand Personality

### Visual Aesthetic

- **Retro Gaming**: Embraces 16-bit pixel art nostalgia
- **Modern Tech**: Contemporary color palette and typography
- **Friendly**: Approachable red panda mascot
- **Professional**: Clean, developer-focused design
- **Unique**: Stands out in the documentation tool space

### Why Pixel Art?

1. **Memorable**: Unique in a sea of flat/gradient logos
2. **Scalable**: Works at any size (nearest-neighbor scaling)
3. **Developer Appeal**: Resonates with gaming-influenced tech culture
4. **Nostalgic**: Evokes positive retro gaming memories
5. **Versatile**: Easy to animate, create variations, merchandise

---

**Next Steps:**

1. ✅ Reserve domains (ailurus.dev, ailurus.io)
2. ✅ Create GitHub organization
3. ✅ Register NPM scope (@ailurus)
4. ⏳ Generate pixel art logo
5. ⏳ Scale logo to all required sizes
6. ⏳ Create social media profiles
7. ⏳ Design landing page with pixel art theme
