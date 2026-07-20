# Mascot Image Analysis for Antigravity Implementation

This document analyzes the attached mascot reference image and translates it into practical design, rigging, and implementation guidance for building a desktop mascot. The image shows a chibi astronaut mascot with a large glossy visor, rounded helmet, compact body, short limbs, and a clean black-white-blue color palette. [file:61]

## Visual summary

The mascot is designed in a super-deformed style with an oversized head, very small body, short arms and legs, and a centered upright standing pose. This means its personality should come more from head tilt, visor reflections, body bounce, arm swings, hand pose changes, and torso sway than from realistic anatomical motion. [file:61]

The silhouette is strong and readable even at small size because the helmet is a large near-perfect circle, the body is a simple rounded form, and the limbs are thick capsule-like shapes with bold outlines. For Antigravity, this is ideal because the implementation should preserve this simple geometry rather than over-detailing the character and making rigging harder. [file:61]

## Color and rendering style

The color language is minimal: white suit, black outline, glossy black visor, gray shadows, and one small blue accent on the chest module. The implementation should therefore keep the art flat and clean, with only a few shadow layers and highlight layers, instead of painterly rendering or textured shading. [file:61]

The visor is the emotional center of the design because it occupies most of the face area and already contains bright highlight shapes that imply personality even without visible eyes. Since the face is hidden, Antigravity should treat the visor as the main expressive zone using tilt, reflection shifts, blink-like light pulses, and optional subtle internal eye glow only if a later redesign chooses to add it. [file:61]

## Head and helmet

The head is the main animation anchor in the whole mascot. It consists of a large circular black visor face area, a white helmet shell around it, a top helmet band or arch, side ear-like pods, and a lower helmet rim. [file:61]

Separate the helmet into at least these layers:
- Helmet back shell.
- Left side pod.
- Right side pod.
- Visor base.
- Visor highlight large streak.
- Visor highlight small dots.
- Front rim or lower rim.
- Top helmet arc. [file:61]

For rigging:
- The whole head should rotate slightly on X and Y.
- The visor highlights should move a little differently from the visor base to simulate glass depth.
- The side pods should lag slightly during head turns.
- The helmet rim should stay stable so the head feels solid and not jelly-like. [file:61]

The helmet should feel like a slightly heavy rounded object. The motion profile should be damped rather than floppy: slow lean in, tiny overshoot, quick settle. [file:61]

## Visor and face behavior

Because the character has no visible eyes, mouth, eyebrows, or nose, emotional readability must come from substitute cues. In this design, the visor can carry emotion through head angle, body posture, reflection movement, vertical bobbing, optional hidden internal eye sprites behind the visor, and an optional line-mouth or LED-mouth overlay only when speaking. [file:61]

If faithfulness to the image is the priority, do not add a human mouth on the visor by default. Speaking can instead be shown by tiny body bounce, light pulses, chest-core pulse, and subtle visor lower-edge vibration; curiosity can be shown by head tilt and forward lean; surprise can be shown by head recoil and widened reflection spacing; sleepiness can be shown by slow head droop and dimmer visor sheen. [file:61]

Create at least these visor-related layers:
- Visor base layer.
- Highlight group 1.
- Highlight group 2.
- Optional emotion glow overlay.
- Optional talking pulse mask. [file:61]

## Torso and body shell

The torso is a single rounded suit body with soft shading and a small chest device in the center. Its simplicity is useful because it can deform slightly without looking wrong. [file:61]

Split the body into:
- Upper torso.
- Lower torso or hip area.
- Belly shadow.
- Neck-to-helmet connection.
- Optional seam accents if later added. [file:61]

Animation guidance:
- The torso should support breathing.
- The body should have gentle squash and stretch.
- It should support slight forward lean.
- It should support small side-to-side weight transfer.
- It should support subtle compress-on-step or compress-on-click reactions. [file:61]

The body should not bend like a realistic human spine. It should move like a single soft mass with minor deformation. [file:61]

## Chest device

The chest unit is one of the best places to add life because it is centered, geometric, and already has a blue circular detail that can act like a status light. It appears as a rounded rectangular module with a stylized central panel split and a small blue light on the right side. [file:61]

Separate it into:
- Device back plate.
- Left panel.
- Center seam piece.
- Right panel.
- Blue indicator light.
- Optional glow halo.
- Left and right connector tubes. [file:61]

Suggested state behaviors:
- Idle: blue light soft pulse.
- Listening: slow breathing pulse.
- Thinking: low-frequency blink.
- Speaking: synced pulse.
- Alert: quick double pulse.
- Sleep: dim fade. [file:61]

This chest light can become a secondary emotional and system-status channel if the visor remains visually minimal. [file:61]

## Arms and shoulders

The arms are short, rounded, and hanging at the sides with a slight outward curve. They are not detailed human arms, so they should not be rigged for full shoulder-elbow-wrist realism. [file:61]

Split each arm into:
- Shoulder cap connection.
- Upper arm.
- Forearm.
- Hand or glove. [file:61]

Good motion choices for this style:
- Shoulders move minimally.
- Elbows bend slightly.
- Hands rotate inward or outward.
- Arms sway with body motion.
- One hand lifts a little during reactions.
- Both arms bounce slightly while speaking or walking. [file:61]

Best gestures for the design:
- Tiny wave.
- Chest-level hand lift.
- Idle hand curl.
- Slight hand tap.
- Small shrug-like outward movement.
- Soft balance movement during dragging or repositioning. [file:61]

Avoid large dramatic arm swings unless a special animation is deliberately triggered. [file:61]

## Hands and fingers

The gloves are simplified and mitten-like, with only minimal finger separation indicated in the silhouette. This is beneficial because full finger rigging is unnecessary. [file:61]

Create 3 to 5 hand states as swap poses:
- Neutral hanging hand.
- Slightly curled hand.
- Pointing or tap hand.
- Tiny wave hand.
- Relaxed sleepy hand. [file:61]

Implementation rule:
- Do not attempt realistic finger-by-finger articulation.
- Use hand pose swaps or tiny rotations.
- Fingers are implied by silhouette, not individually animated anatomy. [file:61]

## Hip and lower body

The hips and lower torso transition smoothly into the legs, with a small central split and a soft rounded lower body. This should be rigged as a pelvis or base body section plus left and right leg roots. [file:61]

The lower body should support slight side weight shift, tiny bounce, sit or compress pose, and recoil on landing or quick interaction. Since the character is short and rounded, lower-body motion should read more like a plush toy or tiny robot than like a full human gait. [file:61]

## Legs and boots

The legs are short and cylindrical, ending in oversized rounded boots. They are symmetrical and front-facing, which makes them easy to animate for subtle standing motion. [file:61]

Separate them into:
- Left upper leg.
- Left lower leg.
- Left boot.
- Right upper leg.
- Right lower leg.
- Right boot. [file:61]

Motion guidance:
- Standing idle should include tiny knee compression.
- Walking should be simple and bouncy.
- Leg swing should be small.
- Boots should flatten slightly on landing if deformers are used.
- Feet can rotate outward a little during personality poses. [file:61]

Do not attempt realistic knees unless the art is redrawn with clearer segmentation. This design supports mascot locomotion, not human locomotion. [file:61]

## Backpack or rear support

Behind the shoulders there are visible curved shapes suggesting a backpack or oxygen pack. These shapes are useful for depth and secondary motion. [file:61]

Create them as:
- Backpack base.
- Left visible side edge.
- Right visible side edge.
- Optional straps if later redesigned. [file:61]

Rigging use:
- Tiny lag during head and body movement.
- Subtle bounce on idle.
- Secondary overlap after body settling. [file:61]

This will help the mascot feel less flat in a 2D setup. [file:61]

## Outline and line quality

One of the strongest traits in the image is the bold, smooth black outline around every major form. The implementation should preserve consistent outer stroke weight, slightly thinner inner detail lines, rounded line joins, and very clean vector-like curves. [file:61]

This means the mascot should ideally be recreated as layered vector art or high-resolution clean PNG parts, not rough painted raster fragments. The style depends on precision and clean edges. [file:61]

## Recommended part breakdown

A practical part breakdown for implementation is:
- Head root.
- Helmet back.
- Helmet top band.
- Helmet front rim.
- Left ear pod.
- Right ear pod.
- Visor base.
- Visor highlight long.
- Visor highlight dot 1.
- Visor highlight dot 2.
- Body upper.
- Body lower.
- Belly shade.
- Chest device base.
- Chest device left.
- Chest device center seam.
- Chest device right.
- Chest blue light.
- Left shoulder.
- Left upper arm.
- Left forearm.
- Left hand pose A/B/C.
- Right shoulder.
- Right upper arm.
- Right forearm.
- Right hand pose A/B/C.
- Backpack left.
- Backpack right.
- Pelvis.
- Left upper leg.
- Left lower leg.
- Left boot.
- Right upper leg.
- Right lower leg.
- Right boot.
- Ground shadow. [file:61]

## Rigging priorities

For the fastest good result, prioritize these parameters first:
1. Head tilt left and right.
2. Head nod up and down.
3. Body lean left and right.
4. Body lean forward and back.
5. Breathing expand and compress.
6. Blink substitute through visor highlight modulation or a hidden eye layer.
7. Small arm swing.
8. Hand pose swap.
9. Leg compression.
10. Chest light pulse. [file:61]

That order matches what this mascot visually supports best. [file:61]

## Emotional system

Since the face is covered, emotion should come from a combination system:
- Primary emotion channel: head angle.
- Secondary channel: torso posture.
- Tertiary channel: chest light behavior.
- Support channel: arm or hand gesture.
- Polish channel: visor highlight movement. [file:61]

Example mapping:
- Happy: upright posture, slight bounce, brighter blue pulse.
- Curious: head tilt, one-hand lift, slight forward lean.
- Shy: head down, arms in, softer pulse.
- Alert: head up, tiny recoil, faster light pulse.
- Sleepy: drooped head, slower breathing, dim blue light. [file:61]

## Desktop mascot implementation advice

For a desktop companion based on this exact image, the runtime should implement:
- Transparent background.
- Small idle float.
- Subtle breathing loop.
- Cursor-facing head turn.
- Occasional glance-away behavior.
- Click reaction bounce.
- Typing reaction micro-hand taps.
- Speaking pulse through chest light and body bob.
- Drag response where the body leans opposite motion.
- Settle animation after motion ends. [file:61]

This character should not move like a human adult. It should move like a tiny soft-bodied astronaut toy with intelligence, which is the correct motion identity for the design shown in the image. [file:61]

## Constraints for Antigravity

Give Antigravity these constraints explicitly:
- Keep the mascot chibi and symmetrical.
- Preserve the black-white-blue minimal palette.
- Use clean vector-style parts.
- Do not add detailed facial anatomy unless explicitly requested.
- Use subtle motion, not exaggerated cartoon flailing.
- Fake expressiveness through visor, posture, chest light, and gestures.
- Prefer pose swaps for hands over full finger rigs.
- Treat the head as the emotional anchor.
- Treat the chest light as the system-status and emotion support channel.
- Make all reactions interruptible and smooth. [file:61]

## Suggested creation workflow

1. Redraw the mascot as layered clean art from this reference. [file:61]
2. Split it into the part list above. [file:61]
3. Rig the head, torso, arms, and legs with soft deformers. [file:61]
4. Add visor highlight motion and chest-light states. [file:61]
5. Create 8 to 12 micro-animations only, not dozens of large rigid animations.
6. Build behavior logic that blends these motions based on desktop events.
7. Test at small desktop scale first, because readability matters more than high-detail beauty for a mascot. [file:61]
