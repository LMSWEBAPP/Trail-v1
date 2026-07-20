# Walkthrough - Vedika Desktop Companion Mascot

We have successfully built and launched **"Vedika"**, the 2D desktop companion mascot. The application is currently running on your desktop. Here is a summary of the implementation and how to interact with it.

---

## 🛠️ Architecture Overview

The codebase is split into clean, modular TypeScript components following the design principles:

1. **Desktop Shell ([src/main.ts](file:///c:/Users/ADMIN/Trail-V1/src/main.ts))**:
   - Manages a transparent, frameless, always-on-top window.
   - Spawns a system tray icon with settings toggles.
   - Polls global mouse positions (safe relative coordinates) to send to the renderer.
2. **Preload secure bridge ([src/preload.ts](file:///c:/Users/ADMIN/Trail-V1/src/preload.ts))**:
   - Safely exposes IPC events (cursor tracks, speech triggers, window drag commands) to the web context.
3. **Mascot Vector Rig ([src/renderer/rig.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/rig.ts))**:
   - Binds high-level parameters (`gazeX`, `headAngle`, `bodyLean`, `breathing`, `chestLightIntensity`, `mouthPulse`, `squashStretch`) to rotation, translation, and scale attributes of parented SVG elements.
4. **Environment Observer ([src/renderer/observer.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/observer.ts))**:
   - Tracks cursor movement, wheel scroll, and click rates to build a real-time `activityIntensity` score and trigger reactions.
5. **Behavior Planner ([src/renderer/behavior.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/behavior.ts))**:
   - Runs a linear-interpolation (LERP) loop for smooth, organic transitions.
   - Implements state transitions (`IDLE`, `ACTIVE`, `SLEEPY`, `SPEAKING`).
   - Drives automatic behaviors like breathing, eye blinks (visors reflection dims), and random head tilts.
6. **Speech Manager ([src/renderer/speech.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/speech.ts))**:
   - Fades dialogue boxes, drives speech intervals, and creates real-time glowing sine-wave patterns on the visor to represent talking.

---

## 🎮 How to Interact with Vedika

You can interact with Vedika in several ways:

1. **Repositioning (Dragging)**:
   - Left-click on Vedika's helmet or body and drag to move the transparent window anywhere on your screen.
2. **Resizing (Scaling)**:
   - Hover over the mascot, hold the **Ctrl** key, and use your mouse scroll wheel to scale Vedika up or down (from `0.5x` to `1.5x`).
3. **Click Reactivity (Bouncing)**:
   - Click on the mascot. Vedika will compress and spring-bounce using spring physics.
4. **Dialogue & Speech**:
   - **Double-click** on the mascot to make her say a random dialogue line.
   - Alternatively, right-click the system tray icon and select **Simulate Speaking**.
5. **Cursor-Aware Gaze**:
   - Move your mouse around. Vedika's head will turn slightly and the highlights on her glossy visor will drift to look towards your cursor.
6. **Sleep Mode**:
   - If you leave your mouse still for 15 seconds, Vedika's head will droop, the chest status light will slow down, and she will enter a sleepy, breathing state. Move your mouse to wake her up!

---

## ⚙️ System Tray Controls

Look for the blue-white dot icon in your system tray (bottom-right of your taskbar). Right-click it to access:
- **Always on Top**: Toggles whether Vedika stays above other app windows.
- **Ghost Mode (Click-Through)**: Makes the window click-through so you can click folder items underneath Vedika.
- **Privacy Mode**: Disables global cursor tracking (gaze returns to center).
- **Show Debug Overlay**: Toggles a live text panel on the top-left showing current parameters (`gazeX`, `headAngle`, `activityIntensity`, `mood`).
- **Reset Position**: Teleports Vedika back to the bottom-right corner of your desktop.
