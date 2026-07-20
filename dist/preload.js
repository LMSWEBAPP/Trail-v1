import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    // Window Dragging IPC
    startDrag: (clientX, clientY) => {
        ipcRenderer.send('start-drag', { clientX, clientY });
    },
    stopDrag: () => {
        ipcRenderer.send('stop-drag');
    },
    // Event Listeners from Main Process
    onSettingsChanged: (callback) => {
        ipcRenderer.on('settings-changed', (_, settings) => callback(settings));
    },
    onSimulateSpeech: (callback) => {
        ipcRenderer.on('simulate-speech', () => callback());
    },
    onCursorTrack: (callback) => {
        ipcRenderer.on('cursor-track', (_, data) => callback(data));
    },
    onCursorIdle: (callback) => {
        ipcRenderer.on('cursor-idle', () => callback());
    }
});
