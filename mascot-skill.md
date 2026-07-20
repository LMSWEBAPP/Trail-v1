# Skill: desktop-mascot-live2d

## Purpose
Build a 2D desktop mascot that lives above the user desktop, reacts to desktop context, speaks, animates naturally, and feels emotionally believable without requiring full custom character creation from scratch.

The mascot must:
- Run as a desktop app, preferably on Windows first.
- Support a Live2D-style or equivalent 2D rigged character pipeline.
- React to user behavior such as typing, clicking, dragging, scrolling, speaking, idling, and app focus changes.
- Blend motions instead of only switching fixed animations.
- Feel “lightly human” rather than robotic, with subtle head, torso, eye, mouth, arm, and hand reactions.
- Be designed so an existing bought, licensed, commissioned, or sample rig can be used instead of building the character art and rig from zero.

## Core outcome
The end product is not just a chat pet. It is an environment-aware desktop companion with:
- transparent desktop presence,
- believable idle life,
- motion orchestration,
- contextual reactions,
- conversational ability,
- extensible skills,
- and a production path that avoids full custom art creation in phase 1.

## Non-goals
Do not attempt these in the first production version:
- full anatomical human simulation,
- finger-perfect mocap-level realism,
- unrestricted physics-driven full body locomotion,
- fully autonomous OS control,
- building original illustration and rig from scratch.

Instead, fake realism through layered 2D animation, good rig parameters, behavior timing, gaze control, expression logic, and context-sensitive motion blending.

## Recommended foundation
### Runtime
Prefer:
- Electron + TypeScript for desktop shell, transparent windowing, tray, and OS integration.
- A Live2D-compatible web renderer for the mascot canvas.

Alternative:
- Qt + Live2D when native desktop performance matters more than JS ecosystem speed.

### Character source
Prefer this order:
1. existing licensed Live2D rig,
2. purchased marketplace model,
3. commissioned cut + rig service,
4. official sample model for prototyping.

Never block the project on original art in phase 1.

## Experience contract
The mascot must satisfy the following experiential requirements.

### 1. Desktop presence
The mascot should:
- float above normal windows using a frameless transparent window,
- stay always-on-top when configured,
- support click-through mode,
- support drag repositioning,
- support scale changes,
- support screen-edge snapping,
- support tray-based controls,
- support startup launch,
- avoid interfering with normal work.

### 2. Believability
The mascot should feel alive even when not speaking.

It must include:
- breathing motion,
- idle weight shift,
- blinking,
- eye darting,
- subtle head turns,
- small torso lean,
- expression variation,
- listening pose,
- thinking pose,
- recovery to neutral pose.

Believability comes from timing, state transitions, and motion layering, not from many huge animations.

### 3. Context awareness
The mascot must observe lightweight environment signals and convert them into reactions.

Inputs may include:
- cursor movement,
- click bursts,
- keyboard activity,
- scroll intensity,
- drag events,
- active application identity,
- idle duration,
- system audio playback,
- microphone activity,
- optional clipboard changes,
- optional screen-region attention inference.

The mascot must not spy aggressively. Observation should be privacy-conscious, local-first when possible, and configurable.

### 4. Human-like micro reactions
The mascot should mimic user behavior lightly, not theatrically.

Examples:
- when the user types fast, the mascot can make small hand taps, eye focus tightening, or torso engagement,
- when the user scrolls, the mascot may lean or glance in the scroll direction,
- when the user clicks repeatedly, it can make tiny nods or hand flicks,
- when the user drags windows, it can lean with motion or appear to balance,
- when the user is idle, it can relax, sit, stretch, yawn, or soften gaze,
- when audio plays, it can enter listening mode,
- when speaking, it should use mouth movement plus expression and head motion.

The key rule: every reaction must be subtle, short, reversible, and interruptible.

## Motion architecture
This project must use a motion orchestration layer instead of simple animation swapping.

### State model
Use layered state categories:
- base state: idle, attentive, listening, speaking, sleepy, focused,
- locomotion/stateful desktop actions: drag, fall, climb, snap, sit, perch,
- overlay expressions: happy, surprised, confused, proud, shy, concerned,
- micro actions: blink, glance, nod, hand twitch, shoulder lift, sway,
- recovery transitions: return-to-neutral, soften, settle.

### Motion blending rules
- Prefer short reusable motion clips over long rigid sequences.
- Blend head, eyes, mouth, torso, and hands separately when the rig allows it.
- Support concurrent animation layers where possible.
- All reactions should have fade-in and fade-out.
- Prevent state spam with cooldowns and hysteresis.
- Randomness must be bounded so the mascot stays coherent.

### Required controllable body zones
The ideal rig should expose parameters for:
- eyes: open, smile, gaze X/Y,
- mouth: vowels or openness,
- head: angle X/Y/Z,
- body: angle X/Y/Z or lean,
- shoulders or upper torso,
- arms or hand pose swaps,
- hair/accessory physics,
- breathing,
- emotional expression overlays.

Legs and fingers can be approximated through pose swaps or limited parameterized movement; perfect skeletal realism is not required.

## Skill system
The first and most important skill is not chat. It is motion intelligence.

### Skill 1: Motion Intelligence
This skill controls:
- base idle loops,
- eye contact and gaze targeting,
- context-driven micro-reactions,
- recovery behavior,
- expression scheduling,
- motion cooldowns,
- interruption rules,
- fatigue/sleepiness modulation over time.

Success criteria:
- the mascot appears alive for 10 minutes without seeming repetitive,
- reactions match user activity intensity,
- no abrupt robotic snapping occurs.

### Skill 2: Attention Mapping
Map desktop inputs into attention targets.

Examples:
- look near cursor,
- orient toward active window region,
- focus on speaking user,
- glance away occasionally to avoid uncanny staring.

### Skill 3: Speech Presence
When voice or text responses happen, coordinate:
- mouth movement,
- eye behavior,
- expression,
- head motion,
- listening vs speaking posture,
- turn-taking behavior.

### Skill 4: Mood Memory
Maintain lightweight internal variables:
- energy,
- focus,
- friendliness,
- curiosity,
- sleepiness.

These variables should influence idle choices and reactions, but never overpower user control.

## Privacy and safety
The mascot must:
- disclose what signals it reads,
- allow each sensing feature to be toggled,
- prefer local inference for desktop behavior understanding,
- never capture or transmit sensitive content by default,
- treat screen observation, clipboard access, and microphone input as opt-in,
- provide a visible pause/privacy mode.

## Implementation modules
The codebase should be organized into these modules.

### 1. Desktop shell
Responsible for:
- transparent window,
- always-on-top behavior,
- tray menu,
- drag,
- resizing,
- click-through,
- startup registration,
- monitor positioning.

### 2. Render layer
Responsible for:
- loading the Live2D or equivalent rig,
- updating frame loop,
- parameter interpolation,
- expression overlays,
- physics updates,
- lip sync,
- animation blending.

### 3. Environment observer
Responsible for:
- keyboard/mouse activity summaries,
- scroll and click intensity,
- active app changes,
- idle tracking,
- optional audio/mic state,
- optional high-level screen cues.

This module must expose abstract events rather than raw invasive data.

### 4. Behavior planner
Responsible for:
- converting observations into intent,
- state selection,
- cooldown checks,
- probabilistic micro-reactions,
- transition arbitration,
- mood variable updates.

### 5. Skill engine
Responsible for:
- registering skills,
- invoking context-specific behavior packs,
- enabling future additions such as coding companion mode, study mode, or wellness reminders.

### 6. Conversation layer
Optional in phase 1, stronger in phase 2.

Responsible for:
- text and voice dialogue,
- turn-taking,
- emotion tagging for replies,
- tool use or assistant workflows,
- memory hooks.

## MVP definition
Version 1 must include:
- one mascot character,
- transparent always-on-top desktop window,
- drag and scale,
- idle breathing/blink/look,
- cursor-aware gaze,
- reactions to typing, clicking, scrolling, and idle time,
- speaking animation support,
- tray controls,
- privacy toggles,
- motion orchestration layer.

If any feature threatens delivery, reduce assistant complexity before reducing motion quality.

## Version 2 goals
After MVP, add:
- multiple mascots,
- app-specific behavior profiles,
- richer speech and voice pipeline,
- emotional memory,
- posture changes based on time of day,
- study/coding companion modes,
- plugin-based skill packs,
- optional multimodal understanding.

## Prompting rules for coding agents
When using Claude Code, Codex, or any coding agent, enforce these rules.

### Agent contract
The agent must:
- preserve modular architecture,
- avoid hardcoding character-specific parameters where a config system is better,
- separate motion logic from desktop shell logic,
- prefer event abstraction over direct feature entanglement,
- write code that can support future rig swaps,
- document assumptions about rig parameters,
- ship incremental milestones that are runnable.

### Forbidden shortcuts
Do not:
- fake context awareness entirely with random reactions,
- couple all logic into one renderer file,
- build chat before motion intelligence,
- overuse large blocking animation states,
- assume original art creation is available,
- collect invasive user data without explicit settings.

## Recommended milestone plan
### Milestone 1
- desktop shell,
- transparent mascot window,
- rig loading,
- idle motion,
- drag and scale.

### Milestone 2
- gaze tracking,
- blink scheduling,
- context observer for click/type/scroll/idle,
- simple micro-reactions.

### Milestone 3
- motion blending engine,
- expression overlays,
- cooldown logic,
- attention mapping.

### Milestone 4
- speech presence,
- tray settings,
- privacy controls,
- packaging and performance optimization.

### Milestone 5
- optional assistant features,
- memory and mood layer,
- app-specific behavior packs.

## Quality bar
The mascot is successful when:
- it feels alive without constant talking,
- it does not annoy or block the user,
- reactions are subtle and contextually relevant,
- movement is smooth and interruptible,
- the same rig can support multiple emotional styles,
- the system can work with bought or commissioned assets,
- the desktop shell feels production-ready.

## One-line project brief
Create a privacy-conscious, environment-aware, Live2D-style desktop companion that uses layered motion intelligence and subtle human-like reactions to feel alive, without requiring original character creation from scratch.
