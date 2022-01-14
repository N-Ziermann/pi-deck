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
  tray.setToolTip("PiDeck");

  mainWindow.on("close", (e) => {
    if (!appStopped) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  expressApp.use(express.static("build"));
  expressApp.get("/button/:buttonId", function (req, res) {
    onButtonEvent(req.params.buttonId);
    res.sendStatus(200);
  });
  expressApp.listen(expressPort);
});

const ACTIONS = [
  { type: "text", value: "Hello World" },
  { type: "press", value: "ctrl+a" },
  { type: "run", value: "lutris" },
  { type: "exec", value: "echo Hola Mundo" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "text", value: "Hello World" },
  { type: "press", value: "ctrl+alt+del" },
];

const onButtonEvent = (buttonId) => {
  const action = ACTIONS[buttonId];
  if (!action) {
    return;
  }
  switch (action.type) {
    case "text":
      console.log("Typing: " + action.value);
      break;
    case "press":
      console.log("Pressing: " + action.value);
      break;
    case "run":
      console.log("Running: " + action.value);
      break;
    case "exec":
      console.log("Executing: " + action.value);
      break;
    default:
      console.log("Invalid Command");
  }
};

// ipcMain.on("typeText", (event, payload) => {
//   setTimeout(() => {
//     ks.sendText(payload.text);
//   }, payload.delay);
// });
