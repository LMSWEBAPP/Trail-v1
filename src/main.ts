import { app, BrowserWindow, ipcMain, Tray, Menu, screen, nativeImage } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// Settings
let isAlwaysOnTop = true;
let isClickThrough = false;
let isPrivacyMode = false;
let isDebugMode = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 450,
    transparent: true,
    frame: false,
    alwaysOnTop: isAlwaysOnTop,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the main html file from source folder
  mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'));

  // Ensure window is always on top if setting is true
  if (isAlwaysOnTop) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
  }

  // Prevent white flash on load
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // 16x16 transparent PNG with a simple blue/white dot pattern in base64
  const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVQ4T2NkoBAwUqifAcw5DFGAsf//M2A0gGFkGMDw/z8DfgNYoH4YDSnAwDCPmQQADLgHCTn66F0AYxNjYyMGBgYGFgYGBhYGFgYWBpYQBhYGlhAGEQYWBhYGFhAGEYcZGAAMEAcJ54h2egAAAABJRU5ErkJggg==';
  const icon = nativeImage.createFromDataURL(base64Icon);
  
  tray = new Tray(icon);
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Vedika Desktop Mascot', enabled: false },
    { type: 'separator' },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: isAlwaysOnTop,
      click: () => {
        isAlwaysOnTop = !isAlwaysOnTop;
        mainWindow?.setAlwaysOnTop(isAlwaysOnTop, 'screen-saver');
        updateTrayMenu();
      },
    },
    {
      label: 'Ghost Mode (Click-Through)',
      type: 'checkbox',
      checked: isClickThrough,
      click: () => {
        isClickThrough = !isClickThrough;
        mainWindow?.setIgnoreMouseEvents(isClickThrough);
        mainWindow?.webContents.send('settings-changed', { isClickThrough });
        updateTrayMenu();
      },
    },
    {
      label: 'Privacy Mode (Pause Tracking)',
      type: 'checkbox',
      checked: isPrivacyMode,
      click: () => {
        isPrivacyMode = !isPrivacyMode;
        mainWindow?.webContents.send('settings-changed', { isPrivacyMode });
        updateTrayMenu();
      },
    },
    {
      label: 'Show Debug Overlay',
      type: 'checkbox',
      checked: isDebugMode,
      click: () => {
        isDebugMode = !isDebugMode;
        mainWindow?.webContents.send('settings-changed', { isDebugMode });
        updateTrayMenu();
      },
    },
    { type: 'separator' },
    {
      label: 'Simulate Speaking',
      click: () => {
        mainWindow?.webContents.send('simulate-speech');
      },
    },
    {
      label: 'Reset Position',
      click: () => {
        if (mainWindow) {
          const primaryDisplay = screen.getPrimaryDisplay();
          const { width, height } = primaryDisplay.workAreaSize;
          mainWindow.setPosition(width - 340, height - 480);
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Vedika Companion');
  tray.setContextMenu(contextMenu);
}

// IPC Handlers
let isDragging = false;
let clickOffsetX = 0;
let clickOffsetY = 0;
let dragInterval: NodeJS.Timeout | null = null;

ipcMain.on('start-drag', (event, { clientX, clientY }) => {
  if (!mainWindow) return;
  isDragging = true;
  clickOffsetX = clientX;
  clickOffsetY = clientY;

  if (dragInterval) clearInterval(dragInterval);
  dragInterval = setInterval(() => {
    if (!isDragging || !mainWindow) {
      if (dragInterval) clearInterval(dragInterval);
      return;
    }
    const curPos = screen.getCursorScreenPoint();
    mainWindow.setPosition(
      Math.round(curPos.x - clickOffsetX),
      Math.round(curPos.y - clickOffsetY)
    );
  }, 16);
});

ipcMain.on('stop-drag', () => {
  isDragging = false;
  if (dragInterval) {
    clearInterval(dragInterval);
    dragInterval = null;
  }
});

// Cursor tracking in main process
let lastCursorPos = { x: 0, y: 0 };
setInterval(() => {
  if (isPrivacyMode || !mainWindow) return;
  const curPos = screen.getCursorScreenPoint();
  if (curPos.x !== lastCursorPos.x || curPos.y !== lastCursorPos.y) {
    lastCursorPos = curPos;
    // Calculate cursor position relative to the center of the window
    const [winX, winY] = mainWindow.getPosition();
    const [winW, winH] = mainWindow.getSize();
    const winCenterX = winX + winW / 2;
    const winCenterY = winY + winH / 2;

    const relX = curPos.x - winCenterX;
    const relY = curPos.y - winCenterY;

    // Send tracking data to renderer
    mainWindow.webContents.send('cursor-track', { relX, relY, globalX: curPos.x, globalY: curPos.y });
  } else {
    // Send idle cursor signal
    mainWindow.webContents.send('cursor-idle');
  }
}, 100);

app.whenReady().then(() => {
  createWindow();
  
  // Set default window position to bottom-right
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow?.setPosition(width - 340, height - 480);
  
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
