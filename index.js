const ks = require("node-key-sender");
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const express = require("express");

let expressApp = express();
let expressPort = 3000;

let mainWindow;
let tray;
let appStopped = false;

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Show",
    click: () => mainWindow.show(),
  },
  {
    label: "Hide",
    click: () => mainWindow.hide(),
  },
  {
    label: "Quit",
    click: () => {
      appStopped = true;
      app.quit();
    },
  },
]);

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/build/index.html#electron`); // use #electron to know wether code runs through electron or webserver
  tray = new Tray(path.join(__dirname, "./react-icon.png"));
  tray.setContextMenu(contextMenu);
  tray.setToolTip('PiDeck')

  mainWindow.on("close", (e) => {
    if (!appStopped) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  expressApp.use(express.static("build"));
  expressApp.listen(expressPort);
});

// ipcMain.on("typeText", (event, payload) => {
//   setTimeout(() => {
//     ks.sendText(payload.text);
//   }, payload.delay);
// });
