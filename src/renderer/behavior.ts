import { MascotRig } from './rig.js';
import { ActivityObserver, ActivityProfile } from './observer.js';

export class BehaviorPlanner {
  private rig: MascotRig;
  private observer: ActivityObserver;

  // Linear interpolation factors (higher = faster, lower = smoother)
  private LERP_GAZE = 0.08;
  private LERP_HEAD_ROT = 0.06;
  private LERP_BODY_LEAN = 0.04;
  private LERP_ARM = 0.1;
  private LERP_CHEST_LIGHT = 0.05;

  // Target values to LERP towards
  private targets = {
    gazeX: 0,
    gazeY: 0,
    headAngle: 0,
    headX: 0,
    headY: 0,
    bodyLean: 0,
    bodyX: 0,
    leftArmAngle: 0,
    rightArmAngle: 0,
    chestLightIntensity: 0.8,
    mouthPulse: 0,
    squashStretch: 1.0
  };

  // State Management
  private currentState: 'IDLE' | 'ACTIVE' | 'SLEEPY' | 'SPEAKING' = 'IDLE';
  private blinkTimer = 0;
  private isBlinking = false;
  private blinkProgress = 0;

  // Mood Memory Variables
  private energy = 1.0;
  private sleepiness = 0.0;
  private curiosity = 0.5;

  // Timing/scheduling
  private nextIdleActionTime = 0;
  private actionCooldown = 0;
  
  // Custom bounce physics
  private isBouncing = false;
  private bounceTime = 0;

  constructor(rig: MascotRig, observer: ActivityObserver) {
    this.rig = rig;
    this.observer = observer;
    
    // Set first idle action timer
    this.scheduleNextIdleAction();
  }

  public tick(deltaTimeMs: number) {
    const profile = this.observer.getProfile();
    
    // Update internal mood memory variables
    this.updateMoodMemory(profile, deltaTimeMs);

    // Evaluate state machine
    this.updateState(profile);

    // Handle high-level behavior schedules
    this.handleSchedules(profile, deltaTimeMs);

    // Process interactive actions (clicking bounce, etc.)
    this.processPhysics(deltaTimeMs);

    // Interpolate (LERP) current parameters to targets
    this.interpolateParameters();

    // Call rig update to render SVG changes
    this.rig.update();

    // Update debug text if debug panel is visible
    this.updateDebugOverlay(profile);
  }

  private updateMoodMemory(profile: ActivityProfile, dt: number) {
    // 1. Sleepiness increases slowly when user is active, decays when idle
    if (!profile.isActive) {
      this.sleepiness = Math.min(1.0, this.sleepiness + dt * 0.00002); // Sleepiness builds very slowly
      this.energy = Math.max(0.0, this.energy - dt * 0.00001);
    } else {
      this.sleepiness = Math.max(0.0, this.sleepiness - dt * 0.0001); // Wakes up quickly on activity
      this.energy = Math.min(1.0, this.energy + dt * 0.00005);
    }

    // 2. Curiosity increases when cursor is moving, decays over time
    if (profile.activityIntensity > 0.3) {
      this.curiosity = Math.min(1.0, this.curiosity + dt * 0.0005);
    } else {
      this.curiosity = Math.max(0.2, this.curiosity - dt * 0.0001);
    }
  }

  private updateState(profile: ActivityProfile) {
    // Speaking state is prioritized by speech manager overrides
    if (this.rig.params.mouthPulse > 0.05) {
      this.currentState = 'SPEAKING';
      return;
    }

    // Check if user is idle for a long duration (e.g. > 15s or high sleepiness)
    if (profile.idleTimeSeconds > 15 || this.sleepiness > 0.7) {
      this.currentState = 'SLEEPY';
    } else if (profile.activityIntensity > 0.15 || profile.scrollIntensity > 0.1) {
      this.currentState = 'ACTIVE';
    } else {
      this.currentState = 'IDLE';
    }
  }

  private handleSchedules(profile: ActivityProfile, dt: number) {
    const time = Date.now();

    // 1. Breathing Cycle Loop
    // Breathing speed slows down when sleepy
    const breathPeriod = this.currentState === 'SLEEPY' ? 0.001 : 0.002;
    this.targets.chestLightIntensity = 0.5 + Math.sin(time * breathPeriod * 1.5) * 0.3;
    // Map sine wave to 0.0 - 1.0 for breathing rig parameter
    this.targets.bodyLean = Math.sin(time * breathPeriod) * 1.0; // slight sway
    
    // Assign breathing parameter directly to maintain consistent rhythm
    this.rig.params.breathing = Math.sin(time * breathPeriod * 2.0) * 0.5 + 0.5;

    // 2. Click Reaction Bounce Trigger
    if (profile.clickBurstCount > 0 && !this.isBouncing && this.actionCooldown <= 0) {
      this.triggerBounce();
      this.actionCooldown = 1000; // 1 second cooldown for reaction animations
    }

    // Decaying cooldown
    if (this.actionCooldown > 0) {
      this.actionCooldown -= dt;
    }

    // 3. Blink scheduling (Substitute: flash/dim visor highlights)
    this.blinkTimer += dt;
    if (this.blinkTimer > 4000) { // Blink every 4 seconds on average
      if (Math.random() < 0.3) { // 30% chance each poll
        this.isBlinking = true;
        this.blinkProgress = 0;
        this.blinkTimer = 0;
      }
    }

    if (this.isBlinking) {
      this.blinkProgress += dt * 0.008; // Duration of blink is about 125ms
      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.targets.chestLightIntensity = 0.8;
      }
    }

    // 4. Action State Specific Targets
    switch (this.currentState) {
      case 'SPEAKING':
        // Head bobs, blue status light pulses matching voice, looking forward
        this.targets.gazeX = 0;
        this.targets.gazeY = 0;
        this.targets.headAngle = Math.sin(time * 0.01) * 3;
        this.targets.headY = 0;
        this.targets.bodyLean = Math.sin(time * 0.005) * 2;
        this.targets.leftArmAngle = -15 + Math.sin(time * 0.007) * 10;
        this.targets.rightArmAngle = 15 - Math.sin(time * 0.007) * 10;
        break;

      case 'ACTIVE':
        // Active observation: look closely at the cursor gaze
        this.targets.gazeX = profile.gazeTargetX;
        this.targets.gazeY = profile.gazeTargetY;
        
        // Lean head & body in direction of cursor gaze
        this.targets.headAngle = profile.gazeTargetX * 10;
        this.targets.headY = profile.gazeTargetY * 4;
        this.targets.bodyLean = profile.gazeTargetX * 4;
        
        // Reactive arms sway based on cursor coordinates
        this.targets.leftArmAngle = -profile.gazeTargetY * 15;
        this.targets.rightArmAngle = profile.gazeTargetY * 15;
        break;

      case 'SLEEPY':
        // Droop head, gaze look down, slow chest light
        this.targets.gazeX *= 0.95; // return center
        this.targets.gazeY = 0.5;    // look down
        this.targets.headAngle = Math.sin(time * 0.0005) * 2; // slow sway
        this.targets.headY = 6;     // head droops down
        this.targets.bodyLean *= 0.98;
        this.targets.leftArmAngle = 5;
        this.targets.rightArmAngle = -5;
        break;

      case 'IDLE':
      default:
        // Natural gaze: follow cursor loosely, occasionally glance away or stretch
        if (time > this.nextIdleActionTime) {
          this.executeRandomIdleAction();
          this.scheduleNextIdleAction();
        }
        
        // Follow cursor but damped
        this.targets.gazeX = profile.gazeTargetX * 0.7;
        this.targets.gazeY = profile.gazeTargetY * 0.7;
        break;
    }
  }

  private executeRandomIdleAction() {
    const choice = Math.random();

    if (choice < 0.25) {
      // Inquisitive head tilt
      this.targets.headAngle = (Math.random() - 0.5) * 12; // Tilt between -6 and 6 deg
    } else if (choice < 0.5) {
      // Glance away to avoid uncanny staring
      this.targets.gazeX = (Math.random() - 0.5) * 1.5;
      this.targets.gazeY = (Math.random() - 0.5) * 1.0;
    } else if (choice < 0.7) {
      // Shoulder stretch
      this.targets.leftArmAngle = -20;
      this.targets.rightArmAngle = 20;
      setTimeout(() => {
        this.targets.leftArmAngle = 0;
        this.targets.rightArmAngle = 0;
      }, 1000);
    } else {
      // Return head to stable neutral pose
      this.targets.headAngle = 0;
      this.targets.headY = 0;
    }
  }

  private scheduleNextIdleAction() {
    // Idle action every 3 to 7 seconds
    this.nextIdleActionTime = Date.now() + 3000 + Math.random() * 4000;
  }

  private triggerBounce() {
    this.isBouncing = true;
    this.bounceTime = 0;
  }

  private processPhysics(dt: number) {
    if (this.isBouncing) {
      this.bounceTime += dt * 0.008; // duration multiplier
      
      // Calculate spring physics curve using dampened sine wave:
      // squash down first, then launch up, settle back to neutral
      const bounceDuration = Math.PI * 2;
      if (this.bounceTime >= bounceDuration) {
        this.isBouncing = false;
        this.targets.squashStretch = 1.0;
        this.targets.headY = 0;
      } else {
        // squashStretch formula
        const amplitude = 0.15 * Math.exp(-this.bounceTime * 0.5); // decay amplitude
        const deformation = Math.sin(this.bounceTime * 2.5) * amplitude;
        this.targets.squashStretch = 1.0 - deformation;
        this.targets.headY = -deformation * 30; // head bobs with body compression
      }
    }
  }

  private triggerSpecialWave() {
    this.targets.leftArmAngle = -110;
    setTimeout(() => {
      this.targets.leftArmAngle = 0;
    }, 1500);
  }

  private interpolateParameters() {
    const p = this.rig.params;
    const t = this.targets;

    // Standard linear interpolation
    p.gazeX += (t.gazeX - p.gazeX) * this.LERP_GAZE;
    p.gazeY += (t.gazeY - p.gazeY) * this.LERP_GAZE;
    
    p.headAngle += (t.headAngle - p.headAngle) * this.LERP_HEAD_ROT;
    p.headX += (t.headX - p.headX) * this.LERP_HEAD_ROT;
    p.headY += (t.headY - p.headY) * this.LERP_HEAD_ROT;

    p.bodyLean += (t.bodyLean - p.bodyLean) * this.LERP_BODY_LEAN;
    p.bodyX += (t.bodyX - p.bodyX) * this.LERP_BODY_LEAN;

    p.leftArmAngle += (t.leftArmAngle - p.leftArmAngle) * this.LERP_ARM;
    p.rightArmAngle += (t.rightArmAngle - p.rightArmAngle) * this.LERP_ARM;

    // Apply blink overlay onto chest light and visor reflections
    let targetLight = t.chestLightIntensity;
    if (this.isBlinking) {
      // Create a rapid dim-and-restore cycle
      const blinkOpacity = Math.abs(Math.sin(this.blinkProgress * Math.PI));
      targetLight = t.chestLightIntensity * (0.1 + blinkOpacity * 0.9);
      
      // Also hide visor highlight during blink
      const highlightGroup = document.getElementById('visor-highlights');
      if (highlightGroup) {
        highlightGroup.style.opacity = (blinkOpacity).toString();
      }
    } else {
      const highlightGroup = document.getElementById('visor-highlights');
      if (highlightGroup) {
        highlightGroup.style.opacity = '1';
      }
    }

    p.chestLightIntensity += (targetLight - p.chestLightIntensity) * this.LERP_CHEST_LIGHT;
    p.squashStretch += (t.squashStretch - p.squashStretch) * 0.15;
  }

  private updateDebugOverlay(profile: ActivityProfile) {
    const elState = document.getElementById('db-state');
    const elGaze = document.getElementById('db-gaze');
    const elHead = document.getElementById('db-head-tilt');
    const elBody = document.getElementById('db-body-lean');
    const elActivity = document.getElementById('db-activity');
    const elIdle = document.getElementById('db-idle');
    const elEnergy = document.getElementById('db-energy');
    const elSleep = document.getElementById('db-sleep');

    if (elState) elState.innerText = this.currentState;
    if (elGaze) elGaze.innerText = `${this.rig.params.gazeX.toFixed(2)} / ${this.rig.params.gazeY.toFixed(2)}`;
    if (elHead) elHead.innerText = `${this.rig.params.headAngle.toFixed(1)}°`;
    if (elBody) elBody.innerText = `${this.rig.params.bodyLean.toFixed(1)}°`;
    if (elActivity) elActivity.innerText = profile.activityIntensity.toFixed(2);
    if (elIdle) elIdle.innerText = `${profile.idleTimeSeconds.toFixed(1)}s`;
    if (elEnergy) elEnergy.innerText = this.energy.toFixed(2);
    if (elSleep) elSleep.innerText = this.sleepiness.toFixed(2);
  }
}
