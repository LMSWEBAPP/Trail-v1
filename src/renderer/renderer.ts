import { MascotRig } from './rig.js';
import { ActivityObserver } from './observer.js';
import { BehaviorPlanner } from './behavior.js';
import { SpeechManager } from './speech.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  const rig = new MascotRig();
  const observer = new ActivityObserver();
  const planner = new BehaviorPlanner(rig, observer);
  const speechManager = new SpeechManager(rig);

  // Initialize custom window dragging
  initDragging();

  // Initialize custom mousewheel scaling
  initScaling();

  // Main animation loop
  let lastTime = performance.now();

  function loop(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Tick the behavior planner with delta time in milliseconds
    planner.tick(deltaTime);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Show a welcome message on startup
  setTimeout(() => {
    speechManager.say("Hello! I am Vedika. I'll stay here and keep you company while you work! 🚀");
  }, 1000);
});

function initDragging() {
  // Native OS-level dragging is enabled via CSS (-webkit-app-region: drag) on #mascot-container
}

function initScaling() {
  const svg = document.getElementById('mascot-svg');
  if (!svg) return;

  let currentScale = 0.8;
  const minScale = 0.5;
  const maxScale = 1.5;

  // Wheel event handles Ctrl + Wheel for resizing
  window.addEventListener('wheel', (e) => {
    // Only scale if Ctrl key is held or if we want it as a default interaction
    if (e.ctrlKey) {
      e.preventDefault();
      
      const scaleDelta = e.deltaY < 0 ? 0.05 : -0.05;
      currentScale = Math.max(minScale, Math.min(maxScale, currentScale + scaleDelta));
      
      svg.style.transform = `scale(${currentScale})`;
    }
  }, { passive: false });
}
