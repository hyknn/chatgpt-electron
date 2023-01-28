const { app, globalShortcut, BrowserWindow } = require('electron');
const path = require('path');

const homePage = 'https://chat.openai.com';
const userAgent =
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
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode');
app.commandLine.appendSwitch('enable-accelerated-video');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
app.commandLine.appendSwitch('enable-gpu-rasterization');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      userAgent: userAgent,
    },
  });

  mainWindow.loadURL(homePage);
  mainWindow.maximize();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  globalShortcut.register('Alt+F4', () => {
    app.quit();
  });

  globalShortcut.register('F4', () => {
    app.quit();
  });
});

app.on('browser-window-created', (e, window) => {
  window.setBackgroundColor('#1A1D1F');
  window.setMenu(null);
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    BrowserWindow.getAllWindows()[0].loadURL(url);
  });
});
