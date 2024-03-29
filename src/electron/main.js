require('node:buffer');
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const ip = require('ip');
const { db } = require('./db');
const { activeSocket, initServer } = require('./server');
const { isDev } = require('./env');

let appStopped = false;
/** @type {BrowserWindow} */
let mainWindow;
/** @type {Tray} */
let tray;

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Show',
    click: () => {
      mainWindow.show();
      app.dock?.show?.();
    },
  },
  {
    label: 'Hide',
    click: () => {
      mainWindow.hide();
      app.hide?.();
      app.dock?.hide?.();
    },
  },
  {
    label: 'Quit',
    click: () => {
      appStopped = true;
      app.quit();
    },
  },
]);

app.dock?.hide?.();
app.on('ready', async () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(
        app.getAppPath(),
        (isDev ? '.' : '..') + '/src/electron/preload.cjs',
      ),
    },
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5123');
  } else {
    await mainWindow.loadFile(path.join(app.getAppPath(), '/react/index.html'));
  }
  mainWindow.webContents.send('ipAddress', ip.address());

  if (!isDev) {
    mainWindow.removeMenu();
  }

  tray = new Tray(path.join(app.getAppPath(), './icons/trayIcon@2x.png'));
  tray.setContextMenu(contextMenu);
  tray.setToolTip('PiDeck');

  mainWindow.on('close', (e) => {
    if (!appStopped) {
      e.preventDefault();
      mainWindow.hide();
      app.dock?.hide?.();
    }
  });

  initServer();
});

ipcMain.on('button:update', (event, payload) => {
  // @ts-ignore TODO
  if (event.activeIndex === null) {
    return;
  }
  let iconBuffer;
  if (payload.iconPath) {
    iconBuffer = fs.readFileSync(payload.iconPath);
  }
  db.prepare(
    `REPLACE INTO buttons (id, commandType, command, image) VALUES(?,?,?,?)`).bind([
      payload.activeIndex,
      payload.activeCommandType,
      payload.command,
      iconBuffer || null,
    ]).run();
  // share info that button updated over websocket and ipc
  if (activeSocket.socket) {
    activeSocket.socket.send('buttonIcons:update');
  }
  mainWindow.webContents.send('buttonIcons:update');
});
