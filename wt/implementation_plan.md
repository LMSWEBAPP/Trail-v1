# Implementation Plan - Chibi Astronaut Mascot "Vedika"

This plan outlines the architecture, layout, and implementation steps for building the 2D desktop mascot companion named **"Vedika"**, based on the provided chibi astronaut reference image and requirements. It covers the Electron shell, a custom SVG-based vector rigging system, environment activity observers, motion intelligence, and tray control modules.

---

## User Review Required

> [!IMPORTANT]
> **Proposed Animation Style: Custom SVG Vector Rigging**
> Rather than using complex and heavy Live2D binary files (`.moc3`), we propose to build the mascot using a layered SVG asset. By splitting the character into structured, parented groups (`<g id="head">`, `<g id="visor">`, `<g id="chest-light">`, `<g id="left-arm">`, etc.), we can write a JavaScript/CSS-transform-based motion system. This gives us pixel-perfect vector scalability at any desktop scale, smooth interpolation, and full editability of the character parts without needing the closed-source Live2D editor.

---

## Open Questions

> [!IMPORTANT]
> **1. SVG Vector vs. Raster PNG Layers**
> Do you prefer the mascot to be rendered using clean, scalable SVG paths (drawn programmatically to match your astronaut image) or would you prefer us to generate PNG images for the parts and rig them? We recommend **SVG paths** because they are crisp at any monitor resolution and easy to bend/rotate dynamically.
> 
> **2. Speaking & Thinking Visualizations**
> Since the astronaut visor has no mouth, how should "Vedika" represent speaking or thinking? We propose:
> - **Speaking**: An animated voice-wave/pulsing pattern on the lower visor, along with a synchronized pulse on the blue chest light and minor head/body bobbing.
> - **Thinking**: A slow, fading glow on the visor highlights and a breathing blue light on the chest.
> Does this approach match what you have in mind?
> 
> **3. Global Activity Observation vs. Privacy**
> To react to typing speed and clicks globally (when focus is on other applications):
> - *Option A (Recommended for simplicity/reliability)*: Monitor global cursor position via Electron APIs, and estimate general activity/idle state based on mouse distance and window focus.
> - *Option B (Advanced)*: Install a lightweight native dependency (like `iohook`) to register global mouse clicks and keystrokes. *Note: This requires compiling native C++ binaries, which can sometimes fail depending on your local Node/Python tools.*
> Which option do you prefer to start with?

---

## Proposed Changes

We will organize the project in the active workspace `c:\Users\ADMIN\Trail-V1` with a modular architecture.

### Desktop Shell & Main Process
Manages the application lifecycle, tray icon, and transparent, frameless window settings.

#### [NEW] [package.json](file:///c:/Users/ADMIN/Trail-V1/package.json)
Initializes npm dependencies including Electron, TypeScript, and developer tools.

#### [NEW] [tsconfig.json](file:///c:/Users/ADMIN/Trail-V1/tsconfig.json)
Configures TypeScript compiler settings for modern JS target and Electron modules.

#### [NEW] [src/main.ts](file:///c:/Users/ADMIN/Trail-V1/src/main.ts)
Electron main process file to spawn the transparent, frameless window, handle tray creation, configure click-through toggles, and manage drag-and-drop scaling IPC signals.

#### [NEW] [src/preload.ts](file:///c:/Users/ADMIN/Trail-V1/src/preload.ts)
Preload script providing a secure IPC bridge between Electron's main process and the renderer.

---

### Renderer & Rigging Layer
Handles the mascot structure, graphics, rendering loop, and parameter-based rotations.

#### [NEW] [src/renderer/index.html](file:///c:/Users/ADMIN/Trail-V1/src/renderer/index.html)
Main HTML page housing the container, styles for transparent frames, and the main SVG hierarchy defining "Vedika" (helmet, visor, chest plate, arms, body, legs).

#### [NEW] [src/renderer/rig.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/rig.ts)
Rig adapter containing parameter mapping declarations (`gazeX`, `gazeY`, `headTilt`, `bodyLean`, `breathing`, `chestLightOpen`) and updating the DOM elements' SVG transforms based on these parameters.

---

### Environment & Observer Module
Captures system metrics to determine when the user is active, idle, typing, or scrolling.

#### [NEW] [src/renderer/observer.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/observer.ts)
Polls cursor positions, tracks focus changes, monitors scrolling, and aggregates input metrics into a normalized `ActivityState` (e.g., `typingSpeed`, `mouseVelocity`, `isIdle`).

---

### Behavior Planner & Motion Intelligence
The "brain" of the mascot that converts activity states into character states and schedules micro-reactions.

#### [NEW] [src/renderer/behavior.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/behavior.ts)
Implements:
- **Idle scheduler**: Periodically triggers blinks, shifts gaze target, or schedules soft body stretches.
- **Reaction triggers**: Triggers head tilting/arm tapping on user activity bursts (fast mouse, active typing).
- **Mood variable tracker**: Updates memory state values (`energy`, `curiosity`, `sleepiness`).
- **Interpolator**: Smooths parameter values over time to eliminate sudden snaps.

#### [NEW] [src/renderer/speech.ts](file:///c:/Users/ADMIN/Trail-V1/src/renderer/speech.ts)
Controls dialogue rendering, lip sync animation, audio status lights, and typing states when Vedika is thinking or speaking.

---

## Verification Plan

### Automated Tests
We will build local test scripts to verify the observer signals and parameter transitions:
- Run `npm run start` to open the Electron shell and inspect performance.
- Use a debug overlay in the mascot window (toggled in config) showing current parameter values (`gazeX`, `headAngle`, `isIdle`, `typingSpeed`) in real-time.

### Manual Verification
- **Drag & Scale**: Verify that dragging the mascot repositions it and mousewheel scales it.
- **Click-through**: Toggle click-through from the system tray menu and confirm clicks pass through the mascot.
- **Idle vs. Active**: Leave the window idle for 30 seconds and check if Vedika enters the "sleepy/relaxed" posture; move cursor rapidly and check if gaze tracks it.
- **Speech Simulation**: Activate a simulated speech command and observe visor waveforms and chest light synchronization.
