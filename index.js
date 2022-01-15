const ks = require("node-key-sender");
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const fs = require("fs");
const { Blob } = require("node:buffer");

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
  prepareDatabase();
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

const prepareDatabase = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS buttons (
      id INTEGER NOT NULL,
      commandType TEXT,
      command TEXT,
      image BLOB,
      PRIMARY KEY (id)
    );`,
    [],
    (error) => {
      if (!error) {
        for (let i = 0; i < 18; i++) {
          db.all("SELECT id FROM buttons WHERE id = ?", [i], (err, rows) => {
            if (rows.length === 0) {
              db.run("INSERT INTO buttons (id) VALUES(?)", [i]);
            }
          });
        }
      }
    }
  );
};

const onButtonEvent = (buttonId) => {
  db.all(
    "SELECT commandType, command FROM buttons WHERE id = ?;",
    [buttonId],
    (err, rows) => {
      if (err || rows.length === 0) {
        return;
      }
      const action = rows[0]

      switch (action.commandType) {
        case "text":
          console.log("Typing: " + action.command);
          break;
        case "press":
          console.log("Pressing: " + action.command);
          break;
        case "run":
          console.log("Running: " + action.command);
          break;
        case "exec":
          console.log("Executing: " + action.command);
          break;
        default:
          console.log("Invalid or no command given");
      }
    }
  );
};

ipcMain.on("button:update", (event, payload) => {
  if (!event.activeIndex) {
    return;
  }

  let iconBlob;
  if (payload.iconPath) {
    const buffer = fs.readFileSync(payload.iconPath);
    iconBlob = new Blob([buffer]);
  }

  db.run(
    `REPLACE INTO buttons (id, commandType, command, image) VALUES(?,?,?,?)`,
    [
      payload.activeIndex,
      payload.activeCommandType,
      payload.command,
      iconBlob || null,
    ],
    (e) => console.log(e)
  );
});
