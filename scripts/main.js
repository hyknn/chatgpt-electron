// Modules to control application life and create native browser window
const { app, globalShortcut, BrowserWindow, screen } = require('electron');
const path = require('path');

var homePage = 'https://chat.openai.com';

var userAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.101 Safari/537.36'; // Linux

if (process.argv.includes('--spoof-chromeos')) {
  userAgent =
    'Mozilla/5.0 (X11; CrOS x86_64 14909.100.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.83 Safari/537.36'; // ChromeOS
  app.commandLine.appendSwitch('disable-features', 'UserAgentClientHint');
}

if (process.argv.includes('--spoof-windows')) {
  userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'; // Windows
  app.commandLine.appendSwitch('disable-features', 'UserAgentClientHint');
}

console.log('Using user agent: ' + userAgent);
console.log('Process arguments: ' + process.argv);

app.commandLine.appendSwitch(
  'enable-features',
  'VaapiVideoDecoder,WaylandWindowDecorations'
);

app.commandLine.appendSwitch(
  'disable-features',
  'UseChromeOSDirectVideoDecoder'
);
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode');
app.commandLine.appendSwitch('enable-accelerated-video');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
app.commandLine.appendSwitch('enable-gpu-rasterization');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      userAgent: userAgent,
    },
  });

  mainWindow.loadURL(homePage);
  mainWindow.maximize();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  globalShortcut.register('Alt+F4', async () => {
    app.quit();
  });

  globalShortcut.register('F4', async () => {
    app.quit();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('browser-window-created', async function (e, window) {
  window.setBackgroundColor('#1A1D1F');
  window.setMenu(null);

  window.webContents.setUserAgent(userAgent);

  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    BrowserWindow.getAllWindows()[0].loadURL(url);
  });
});

app.on('will-quit', async () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
