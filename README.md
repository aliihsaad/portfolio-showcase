# 3D Portfolio Showcase
![ezgif-8bffd4dbcef6e104](https://github.com/user-attachments/assets/b8d61114-6d2b-44df-83d6-305c20a40f86)


# 3D Portfolio Showcase

  A cinematic, immersive portfolio gallery built with React, TypeScript, and Tailwind CSS.
Designed to feel physical, emotional, and alive — transforming a simple portfolio into a digital exhibition where every card tilts, reacts, and moves with intention.

No WebGL. No heavy animation libraries.
Pure CSS transforms + native browser rendering.

## 🚀 Why This Exists
 Most portfolios display content.
This one performs it.

The goal was to build an interface that behaves like a living object:
cards that tilt with depth, text that scatters like particles, grids that fade into infinity, and navigation that feels mechanical, precise, and satisfying.

You don’t scroll this gallery —
you enter it.

## ✨ Key Features

### 1. Interactive 3D Card Carousel
- **Central Focus:** The main stage features a 3D card deck that transitions vertically.
- **Physics-based Transitions:** Cards rotate and scale smoothly (`cubic-bezier` easing) as they enter or exit the viewport, creating a physical "flipping" sensation.
- **Parallax & Glare:** On desktop, cards react to mouse movement with a gyroscope-like 3D tilt and dynamic light glare that follows the cursor.
- **Hover Zoom:** Aggressive scale-up effect on hover for an immersive look.
- **Slideshow:** Supports multiple images per project. Hovering on desktop cycles through them; mobile devices auto-play.

### 2. 3D Wheel Navigation
- **Sidebar Component:** A visual 3D cylinder located on the right side of the screen.
- **True 3D Transforms:** Uses CSS `rotateX` and `translateZ` to arrange numbers in a perfect circle.
- **Interactive:** Functional on both Desktop (Click) and Mobile (Touch/Drag) to scroll through projects.

### 3. Typography Effects ("Scatter")
- **Custom Component:** `ScatterText.tsx` splits text strings into individual characters.
- **Interaction:** On hover, characters explode/scatter randomly in 3D space (translation, rotation, scale) and reassemble smoothly when the mouse leaves.
- **Premium Fonts:** Uses 'Syne' for headers and 'Space Grotesk'/'Inter' for body text.

### 4. Atmospheric Backgrounds
- **Interactive Grid:** A specialized `Canvas` component (`GridBackground.tsx`) draws a perspective grid that scrolls infinitely towards a horizon. It adjusts its blending mode based on the theme (Light/Dark).
- **Ambient Lighting:** Large, slow-moving gradient blobs providing a "breathing" color atmosphere.
- **Film Grain:** A subtle SVG noise overlay adds texture and prevents color banding.

### 5. Responsive & Adaptive
- **Mobile First Logic:**
  - Layout shifts from a vertical stack (Mobile/Tablet) to a horizontal row (Desktop).
  - "Hover" effects are replaced by "Breathing" auto-animations on touch devices.
  - Touch swipe gestures enabled for main screen navigation.
- **Tablet Optimization:** Specific sizing and layout adjustments for iPad/Tablet viewports.

## 🛠 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Modules (for 3D `preserve-3d` contexts)
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Syne, Space Grotesk, Inter)
- **Animation:** CSS Transitions & Native RequestAnimationFrame (no heavy animation libraries like GSAP or Framer Motion used, ensuring lightweight performance).

## 📂 Project Structure

- `App.tsx` - Main layout and state manager (Navigation, Theme, Gestures).
- `components/ProjectCard.tsx` - The core 3D card component with parallax and slideshow logic.
- `components/WheelNavigation.tsx` - The rotating sidebar navigation.
- `components/ScatterText.tsx` - The text hover effect component.
- `components/GridBackground.tsx` - Canvas-based background rendering.
- `constants.ts` - Project data (Images, Titles, Colors).
- `types.ts` - TypeScript definitions.

## 🎨 Customization

To add your own projects, simply edit `constants.ts`. The app automatically adapts the theme (Dark/Light) based on the `textColor` property defined for each project.

## ⭐ Support This Project

If you enjoyed this experience, starring the repository helps it grow and motivates further updates.
