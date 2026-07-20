import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Window Dragging IPC
  startDrag: (clientX: number, clientY: number) => {
    ipcRenderer.send('start-drag', { clientX, clientY });
  },
  stopDrag: () => {
    ipcRenderer.send('stop-drag');
  },

  // Event Listeners from Main Process
  onSettingsChanged: (callback: (settings: { isClickThrough?: boolean; isPrivacyMode?: boolean; isDebugMode?: boolean }) => void) => {
    ipcRenderer.on('settings-changed', (_, settings) => callback(settings));
  },
  onSimulateSpeech: (callback: () => void) => {
    ipcRenderer.on('simulate-speech', () => callback());
  },
  onCursorTrack: (callback: (data: { relX: number; relY: number; globalX: number; globalY: number }) => void) => {
    ipcRenderer.on('cursor-track', (_, data) => callback(data));
  },
  onCursorIdle: (callback: () => void) => {
    ipcRenderer.on('cursor-idle', () => callback());
  }
});
