export interface RigParameters {
  gazeX: number;              // -1.0 to 1.0
  gazeY: number;              // -1.0 to 1.0
  headAngle: number;          // Degrees, e.g., -15 to 15
  headX: number;              // Translate X in pixels
  headY: number;              // Translate Y in pixels
  bodyLean: number;           // Degrees, e.g., -10 to 10
  bodyX: number;              // Translate X in pixels
  breathing: number;          // 0.0 to 1.0 (breathing cycle)
  leftArmAngle: number;       // Degrees, rotation of left arm
  rightArmAngle: number;      // Degrees, rotation of right arm
  chestLightIntensity: number;// 0.0 to 1.0
  mouthPulse: number;         // 0.0 to 1.0 (lip-sync or speech indicator wave height)
  squashStretch: number;      // Extra scale deformation (e.g., during fall or snap)
}

export class MascotRig {
  // DOM Elements
  private headGroup: SVGElement | null = null;
  private visorHighlights: SVGElement | null = null;
  private visorMouthWave: SVGPathElement | null = null;
  private torsoGroup: SVGElement | null = null;
  private chestLight: SVGCircleElement | null = null;
  private leftArm: SVGElement | null = null;
  private rightArm: SVGElement | null = null;
  private leftLeg: SVGElement | null = null;
  private rightLeg: SVGElement | null = null;

  // Parameters
  public params: RigParameters = {
    gazeX: 0,
    gazeY: 0,
    headAngle: 0,
    headX: 0,
    headY: 0,
    bodyLean: 0,
    bodyX: 0,
    breathing: 0.5,
    leftArmAngle: 0,
    rightArmAngle: 0,
    chestLightIntensity: 0.8,
    mouthPulse: 0,
    squashStretch: 1.0
  };

  constructor() {
    this.initElements();
  }

  private initElements() {
    this.headGroup = document.getElementById('head-group') as unknown as SVGElement;
    this.visorHighlights = document.getElementById('visor-highlights') as unknown as SVGElement;
    this.visorMouthWave = document.getElementById('visor-mouth-wave') as unknown as SVGPathElement;
    this.torsoGroup = document.getElementById('torso-group') as unknown as SVGElement;
    this.chestLight = document.getElementById('chest-light') as unknown as SVGCircleElement;
    this.leftArm = document.getElementById('left-arm') as unknown as SVGElement;
    this.rightArm = document.getElementById('right-arm') as unknown as SVGElement;
    this.leftLeg = document.getElementById('left-leg') as unknown as SVGElement;
    this.rightLeg = document.getElementById('right-leg') as unknown as SVGElement;
  }

  /**
   * Applies the parameter values to target SVG transformations.
   */
  public update() {
    const p = this.params;

    // 1. Breathing Calculations (squash and stretch body torso)
    // Breathing cycle modulates height scale from 0.985 to 1.015, and width scale oppositely.
    const breathScaleY = 1.0 + (p.breathing - 0.5) * 0.03; 
    const breathScaleX = 1.0 - (p.breathing - 0.5) * 0.015;
    
    // Apply body lean and breathing scaling
    if (this.torsoGroup) {
      this.torsoGroup.setAttribute('transform', 
        `translate(${p.bodyX}, ${0}) ` +
        `rotate(${p.bodyLean}) ` +
        `scale(${breathScaleX}, ${breathScaleY * p.squashStretch})`
      );
    }

    // 2. Head Calculations (tilt, translation, and minor offset based on body lean)
    // Head moves relative to body, adding dynamic parallax layers.
    const headBodyOffset = p.bodyLean * 0.8; // Head rotates slightly extra to look balanced
    const actualHeadAngle = p.headAngle + headBodyOffset;
    if (this.headGroup) {
      this.headGroup.setAttribute('transform', 
        `translate(${p.headX + p.bodyX * 0.5}, ${p.headY + (p.breathing - 0.5) * 2}) ` +
        `rotate(${actualHeadAngle})`
      );
    }

    // 3. Gaze tracking (move visor highlights inside helmet space)
    // Highlights shift in direction of cursor gaze. Limit displacement to +/- 10px.
    const gazeDispX = p.gazeX * 10;
    const gazeDispY = p.gazeY * 8;
    if (this.visorHighlights) {
      this.visorHighlights.setAttribute('transform', `translate(${gazeDispX}, ${gazeDispY})`);
    }

    // 4. Arms rotations
    // Left arm base rotation + shoulder offset.
    if (this.leftArm) {
      // Arms slightly follow body movement, plus micro-swing.
      const armTiltOffset = -p.bodyLean * 0.5;
      this.leftArm.setAttribute('transform', `rotate(${p.leftArmAngle + armTiltOffset})`);
    }
    
    // Right arm base rotation + shoulder offset.
    if (this.rightArm) {
      const armTiltOffset = -p.bodyLean * 0.5;
      this.rightArm.setAttribute('transform', `rotate(${p.rightArmAngle + armTiltOffset})`);
    }

    // 5. Legs micro-squash
    // During breathing or lean, legs shift slightly to maintain weight center.
    const legScaleY = 1.0 - (p.breathing - 0.5) * 0.01;
    if (this.leftLeg) {
      this.leftLeg.setAttribute('transform', `scale(1, ${legScaleY})`);
    }
    if (this.rightLeg) {
      this.rightLeg.setAttribute('transform', `scale(1, ${legScaleY})`);
    }

    // 6. Chest indicator light glow intensity
    // Uses opacity and CSS drop shadow intensity to pulse.
    if (this.chestLight) {
      // Core blue color: pulse brightness and opacity
      const opacity = 0.5 + p.chestLightIntensity * 0.5;
      this.chestLight.style.opacity = opacity.toString();
      
      // Interpolate color from faint blue to vibrant glowing blue/cyan
      const blueVal = Math.round(150 + p.chestLightIntensity * 105);
      const cyanVal = Math.round(p.chestLightIntensity * 200);
      this.chestLight.setAttribute('fill', `rgb(${cyanVal}, ${136 + cyanVal * 0.3}, 255)`);
    }

    // 7. Visor Mouth Speak Waveform
    // Animate a pulsing speech waveform indicator directly inside the visor
    if (this.visorMouthWave) {
      if (p.mouthPulse > 0.05) {
        this.visorMouthWave.style.display = 'block';
        
        // Construct a dynamic sine wave path inside visor
        const waveHeight = p.mouthPulse * 12;
        const time = Date.now() * 0.02;
        const yOffset = 185;
        
        // Draw path: M 135,185 Q 147,y1 160,185 Q 172,y2 185,185
        const y1 = yOffset + Math.sin(time) * waveHeight;
        const y2 = yOffset - Math.sin(time + Math.PI/2) * waveHeight;
        
        this.visorMouthWave.setAttribute('d', `M 135,${yOffset} Q 147,${y1} 160,${yOffset} Q 172,${y2} 185,${yOffset}`);
        this.visorMouthWave.style.opacity = (0.7 + p.mouthPulse * 0.3).toString();
      } else {
        this.visorMouthWave.style.display = 'none';
      }
    }
  }
}
