export class SpeechManager {
    rig;
    bubbleElement = null;
    isSpeaking = false;
    speechTimeout = null;
    mouthAnimInterval = null;
    quotes = [
        "Vedika status: fully operational! Ready to pair program.",
        "Make sure to keep your back straight. Posture check! 🧘‍♂️",
        "Let's write some clean, modular code today!",
        "Remember to stay hydrated! Drink some water. 💧",
        "Don't worry about bugs, we can squash them together.",
        "Deep breath. We are making great progress!",
        "Analyzing workspace... Looking extremely clean!",
        "Focus level high. Let's get these tasks done!"
    ];
    constructor(rig) {
        this.rig = rig;
        this.bubbleElement = document.getElementById('speech-bubble');
        // Hook up double click on mascot to trigger speech simulation
        const container = document.getElementById('mascot-container');
        if (container) {
            container.addEventListener('dblclick', () => {
                this.sayRandom();
            });
        }
        // Hook up IPC listener from main process
        if (window.electronAPI) {
            window.electronAPI.onSimulateSpeech(() => {
                this.sayRandom();
            });
        }
    }
    /**
     * Simulates speaking a custom message.
     */
    say(message) {
        if (this.isSpeaking) {
            this.stopSpeaking();
        }
        this.isSpeaking = true;
        // Show bubble and set text
        if (this.bubbleElement) {
            this.bubbleElement.innerText = message;
            this.bubbleElement.classList.add('visible');
        }
        // Dynamic speaking duration based on text length (approx 65ms per character)
        const duration = Math.max(2000, message.length * 65);
        // Mouth animation update loop
        let time = 0;
        this.mouthAnimInterval = window.setInterval(() => {
            time += 0.1;
            // Fluctuating mouth openness simulating speech vowels/syllables
            const basePulse = 0.5 + Math.sin(time * 3) * 0.3;
            const speechEnvelope = Math.abs(Math.sin(time * 0.7)); // speech cadence envelope
            this.rig.params.mouthPulse = basePulse * speechEnvelope;
        }, 50);
        // End speaking schedule
        this.speechTimeout = window.setTimeout(() => {
            this.stopSpeaking();
        }, duration);
    }
    sayRandom() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.say(this.quotes[randomIndex]);
    }
    stopSpeaking() {
        this.isSpeaking = false;
        // Clear timeout and interval
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
        if (this.mouthAnimInterval) {
            clearInterval(this.mouthAnimInterval);
            this.mouthAnimInterval = null;
        }
        // Hide bubble
        if (this.bubbleElement) {
            this.bubbleElement.classList.remove('visible');
        }
        // Reset parameters
        this.rig.params.mouthPulse = 0;
    }
}
