export class ActivityObserver {
    profile = {
        gazeTargetX: 0,
        gazeTargetY: 0,
        activityIntensity: 0,
        scrollIntensity: 0,
        clickBurstCount: 0,
        idleTimeSeconds: 0,
        isActive: true,
        isPrivacyMode: false
    };
    lastInputTime = Date.now();
    mouseSpeedAccumulator = 0;
    scrollSpeedAccumulator = 0;
    recentClicks = [];
    constructor() {
        this.initListeners();
        // Decay metrics loop (runs every 100ms)
        setInterval(() => this.decayMetrics(), 100);
    }
    initListeners() {
        // 1. Electron IPC Cursor Tracking
        if (window.electronAPI) {
            window.electronAPI.onCursorTrack((data) => {
                if (this.profile.isPrivacyMode)
                    return;
                this.lastInputTime = Date.now();
                this.profile.idleTimeSeconds = 0;
                this.profile.isActive = true;
                // Normalize cursor position: map -500px to 500px range to -1.0 to 1.0
                // Damps coordinates so looking doesn't feel overly hyperactive
                const maxTrackRange = 500;
                this.profile.gazeTargetX = Math.max(-1, Math.min(1, data.relX / maxTrackRange));
                this.profile.gazeTargetY = Math.max(-1, Math.min(1, data.relY / maxTrackRange));
                // Accumulate speed based on movement
                this.mouseSpeedAccumulator += 0.05;
            });
            window.electronAPI.onCursorIdle(() => {
                // Main process reported that cursor has stopped moving globally
                // Gaze target will slowly decay back to neutral inside the behavior planner
            });
            // Settings changes
            window.electronAPI.onSettingsChanged((settings) => {
                if (settings.isPrivacyMode !== undefined) {
                    this.profile.isPrivacyMode = settings.isPrivacyMode;
                    if (this.profile.isPrivacyMode) {
                        this.profile.gazeTargetX = 0;
                        this.profile.gazeTargetY = 0;
                        this.profile.activityIntensity = 0;
                    }
                }
                // Show/hide debug panel
                if (settings.isDebugMode !== undefined) {
                    const debugPanel = document.getElementById('debug-panel');
                    if (debugPanel) {
                        debugPanel.style.display = settings.isDebugMode ? 'block' : 'none';
                    }
                }
            });
        }
        // 2. Web Window Scroll tracking (scroll anywhere over the transparent window)
        window.addEventListener('wheel', (e) => {
            this.lastInputTime = Date.now();
            this.profile.idleTimeSeconds = 0;
            this.scrollSpeedAccumulator += Math.min(0.3, Math.abs(e.deltaY) * 0.005);
        });
        // 3. Web Window Click burst tracking
        window.addEventListener('mousedown', () => {
            this.lastInputTime = Date.now();
            this.profile.idleTimeSeconds = 0;
            const now = Date.now();
            this.recentClicks.push(now);
            this.mouseSpeedAccumulator += 0.2; // clicks boost active speed
        });
    }
    decayMetrics() {
        const now = Date.now();
        this.profile.idleTimeSeconds = (now - this.lastInputTime) / 1000;
        // Transition to idle state after 5 seconds of inactivity
        if (this.profile.idleTimeSeconds > 5) {
            this.profile.isActive = false;
            this.profile.gazeTargetX *= 0.95; // Slowly relax gaze to center
            this.profile.gazeTargetY *= 0.95;
        }
        // Decay mouse speed accumulator (exponential decay)
        this.profile.activityIntensity = Math.min(1.0, this.profile.activityIntensity + this.mouseSpeedAccumulator);
        this.profile.activityIntensity *= 0.92; // Decay factor
        this.mouseSpeedAccumulator = 0;
        // Decay scroll intensity
        this.profile.scrollIntensity = Math.min(1.0, this.profile.scrollIntensity + this.scrollSpeedAccumulator);
        this.profile.scrollIntensity *= 0.85; // Faster decay for scroll
        this.scrollSpeedAccumulator = 0;
        // Filter clicks within last 2 seconds
        this.recentClicks = this.recentClicks.filter(timestamp => now - timestamp < 2000);
        this.profile.clickBurstCount = this.recentClicks.length;
    }
    getProfile() {
        return { ...this.profile };
    }
}
