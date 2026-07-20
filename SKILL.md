---
name: desktop-mascot-builder
description: Use this skill when building a 2D desktop mascot or Live2D-style desktop companion with environment awareness, motion blending, subtle human-like reactions, and a transparent desktop app shell.
---

# Desktop Mascot Builder

Build a production-minded 2D desktop mascot that feels alive on the desktop, reacts subtly to user activity, and is designed around reusable rigged assets instead of requiring original character creation from scratch.

This skill is for projects where the user wants a mascot that:
- lives on the desktop,
- uses a 2D rigged character such as Live2D or an equivalent parameter-driven system,
- reacts to context such as typing, clicking, scrolling, dragging, speaking, idling, and app focus,
- blends motions and expressions rather than only switching large fixed animations,
- feels lightly human through subtle head, eye, mouth, torso, and hand reactions,
- can be built using bought, licensed, commissioned, or sample rigs.

If the user asks for full cinematic human realism, reduce the target to stylized believable 2D behavior. The goal is not full biomechanical simulation. The goal is desktop believability.

## When to use this skill

Activate this skill when the user wants any of the following:
- a desktop pet,
- a desktop mascot,
- a Live2D desktop companion,
- a transparent animated assistant on desktop,
- a context-aware coding/study companion,
- an environment-reactive mascot with gesture and expression logic.

## Core principles

### 1. Motion before chat
A mascot feels alive because of timing, idle life, gaze, posture, and recovery behavior. Conversation is secondary until the character can idle, observe, and react smoothly.

### 2. Rig-first realism
The quality ceiling is set by the rig and parameter coverage. Do not promise finger-perfect human movement from a weak rig. Instead, inspect available parameters and design behavior around what the asset can truly support.

### 3. Reuse assets
Do not block the project on original art creation. The preferred order is:
1. licensed or purchased Live2D rig,
2. commissioned cut/rig,
3. official sample or prototype model.

### 4. Layered animation
Never build the system around one giant animation per behavior. Split movement into reusable layers:
- base state,
- expression overlay,
- micro reaction,
- transition/recovery,
- optional speech layer.

### 5. Privacy by design
Desktop sensing must be minimal, transparent, and configurable. Prefer high-level activity summaries over invasive content capture.

## Required outcome

The mascot must be able to:
- render in a transparent frameless desktop window,
- stay on top optionally,
- support drag, reposition, scaling, and click-through,
- load a rigged 2D character,
- idle believably for long periods,
- react subtly to user activity,
- enter listening and speaking states,
- expose privacy and behavior settings,
- remain modular enough to swap rigs later.

## Target architecture

Always bias the build toward a modular architecture with at least these parts:

### Desktop shell
Responsibilities:
- transparent window,
- always-on-top,
- tray menu,
- resize/drag,
- click-through,
- monitor positioning,
- startup launch,
- packaging.

Preferred stack:
- Electron + TypeScript for fastest iteration in JS-heavy projects.

Alternative:
- Qt + Live2D when native desktop constraints dominate.

### Render layer
Responsibilities:
- rig loading,
- frame updates,
- parameter interpolation,
- expression overlays,
- physics updates,
- lip sync,
- animation blending.

### Environment observer
Responsibilities:
- keyboard activity summary,
- mouse movement/click summary,
- scroll intensity,
- drag detection,
- active app changes,
- idle duration,
- optional audio playback,
- optional mic state,
- optional clipboard and high-level screen cues.

Important: expose abstract signals such as `typingIntensity`, `isUserIdle`, `activeAppCategory`, and `cursorQuadrant`, not raw invasive data wherever possible.

### Behavior planner
Responsibilities:
- convert signals into intent,
- schedule reactions,
- manage cooldowns,
- arbitrate conflicts,
- drive mood variables,
- pick transitions and recovery motions.

### Skill engine
Responsibilities:
- register future skill packs,
- support behavior specializations such as coding mode, study mode, focus mode, sleepy evening mode.

### Conversation layer
Optional in phase 1.
Responsibilities:
- text/voice dialogue,
- turn-taking,
- speaking/listening state signals,
- emotion tags for animation.

## Motion system requirements

The implementation must use a motion orchestration system, not simple animation swapping.

### State categories
Maintain separate but composable state categories:
- base state: idle, attentive, focused, listening, speaking, sleepy,
- environment action state: drag, perch, snap, bounce, sit, recover,
- expression overlay: neutral, happy, curious, surprised, shy, confused, proud, concerned,
- micro reaction: blink, glance, nod, hand twitch, lean, shoulder rise, small bounce,
- recovery state: return to neutral, soften, settle, relax.

### Motion rules
- Every non-instant reaction must support fade-in and fade-out.
- Reactions must be interruptible.
- Use cooldowns to avoid spam.
- Use bounded randomness for variety.
- Preserve coherence; the mascot should not look drunk, hyperactive, or random.
- Prioritize subtlety over amplitude.
- Micro-reactions should usually be under 1.5 seconds unless tied to speech or idle sequences.

### Required controllable zones
Design for these zones when the rig supports them:
- eyes: blink, widen, smile, gaze X/Y,
- mouth: open/close or vowel forms,
- head: angle X/Y/Z,
- body/torso: lean X/Y/Z,
- shoulders,
- arms or hand pose swaps,
- breathing,
- hair/accessory physics,
- expression overlays.

Legs and fingers may be approximated using pose swaps, short motion clips, or limited parameter changes. Never oversell anatomical realism.

## Behavior contract

The mascot must mimic user behavior lightly, not cartoonishly.

Examples of acceptable reactions:
- typing fast -> tighter gaze, small hand taps, subtle torso engagement,
- scrolling -> glance or lean in scroll direction,
- repeated clicking -> tiny nods or short hand flicks,
- dragging windows -> balancing lean or bracing reaction,
- long idle -> stretch, soften gaze, sit, yawn, sleepy blink,
- audio playback -> listening posture,
- assistant speaking -> mouth, expression, and head motion coordinated.

Rules:
- Reactions must be short, subtle, reversible, and interruptible.
- Do not fire a reaction for every single input event.
- Aggregate input into intensity windows and react probabilistically.
- Prefer micro-life over attention-seeking animations.

## First required skill: Motion Intelligence

Before implementing advanced AI conversation, build a motion intelligence skill layer.

This layer must handle:
- idle scheduling,
- blink scheduling,
- gaze target updates,
- micro-reaction selection,
- expression modulation,
- fatigue/energy effects,
- cooldown rules,
- transition smoothing,
- return-to-neutral behavior.

Success criteria:
- the mascot can remain on screen for at least 10 minutes without feeling dead or obviously repetitive,
- activity intensity changes produce believable response changes,
- transitions are smooth,
- no robotic snapping occurs.

## Secondary skills to support later

### Attention Mapping
Map cursor position, active window region, speaking activity, and idle conditions into where and how the mascot pays attention.

### Speech Presence
Coordinate speech animation with mouth movement, head motion, listening pose, speaking pose, and turn-taking pauses.

### Mood Memory
Maintain lightweight internal values such as energy, curiosity, friendliness, confidence, and sleepiness to vary idle and expression choices over time.

### App-aware Profiles
Allow behavior packs for contexts such as coding, browsing, studying, or watching video.

## Delivery strategy

Always build in milestones.

### Milestone 1
- create desktop shell,
- transparent mascot window,
- drag, scale, click-through,
- load one rigged mascot,
- basic idle loop.

### Milestone 2
- blink and gaze,
- cursor-aware looking,
- idle timing variation,
- simple state machine.

### Milestone 3
- environment observer,
- click/type/scroll/idle signals,
- micro-reactions,
- cooldown system.

### Milestone 4
- layered motion blending,
- expressions,
- speech/listening states,
- tray settings,
- privacy toggles.

### Milestone 5
- assistant layer,
- mood memory,
- context profiles,
- packaging and performance tuning.

## Requirements for any agent using this skill

When this skill is active, the agent must:
- clarify the target OS first if not specified,
- inspect the chosen repo or codebase before proposing rewrites,
- identify whether the mascot asset already exists,
- ask whether the user wants a prototype, MVP, or production-quality system,
- favor reuse of rigs and motion assets over art-from-scratch plans,
- structure code so that shell, observer, planner, and renderer stay separate,
- document rig assumptions clearly,
- produce runnable checkpoints rather than one huge rewrite,
- prioritize motion quality before LLM complexity.

## Forbidden mistakes

Do not:
- start by generating original art workflows unless the user explicitly asks,
- build the mascot as just a chatbot window with a looping animation,
- hardcode all behavior in one renderer file,
- react to every raw input event directly,
- collect invasive screen or clipboard data by default,
- claim true human motion if the rig does not support it,
- overbuild voice/AI while the mascot still feels dead in idle state.

## Code quality rules

- Use TypeScript when working in Electron unless the project strongly requires otherwise.
- Keep rig metadata and parameter names in config or adapter files.
- Abstract desktop events into normalized behavior signals.
- Keep behavior thresholds tunable.
- Prefer small composable classes or modules over giant state blobs.
- Add debug overlays or logs for behavior decisions during development.
- Make it easy to disable sensing features individually.
- Keep the renderer replaceable so different rigs can be tested.

## File and folder suggestions

Recommended project areas:
- `src/shell/`
- `src/render/`
- `src/observer/`
- `src/behavior/`
- `src/skills/`
- `src/config/`
- `assets/models/`
- `assets/motions/`
- `docs/`

Recommended config categories:
- rig parameter map,
- motion catalog,
- reaction thresholds,
- cooldowns,
- privacy settings,
- app behavior profiles.

## Definition of done

The mascot is considered successful when:
- it feels alive without needing to constantly talk,
- movement is smooth and layered,
- user activity causes subtle believable reactions,
- the app does not obstruct normal desktop work,
- privacy settings are understandable,
- the system works with a reused or purchased rig,
- future skills can be added without rewriting the core.

## Final instruction

When in doubt, optimize for believability, modularity, subtlety, and delivery speed.
A smaller mascot that feels alive is better than a larger promise that feels fake.
