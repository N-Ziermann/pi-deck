const ks = require("node-key-sender");
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(path.join(app.getPath('userData'), "./mydb.db"));
const fs = require("fs");
const { Blob } = require("node:buffer");
const ws = require("ws");

let expressApp = express();
let expressPort = 3000;

let websocketServer = new ws.Server({ noServer: true });
let activeSocket;

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
  mainWindow.loadURL(`file://${__dirname}/react/index.html#electron`); // use #electron to know wether code runs through electron or webserver
  tray = new Tray(path.join(__dirname, "./react-icon.png"));
  tray.setContextMenu(contextMenu);
  tray.setToolTip("PiDeck");

  mainWindow.on("close", (e) => {
    if (!appStopped) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  websocketServer.on("connection", (socket) => {
    activeSocket = socket;
  });

  expressApp.use(express.static(path.join(__dirname, "./react")));
  expressApp.get("/button/:buttonId", (req, res) => {
    onButtonEvent(req.params.buttonId);
    res.sendStatus(200);
  });

  expressApp.get("/image/:imageId", (req, res) => {
    db.all(
      "SELECT image FROM buttons WHERE id = ?;",
      [req.params.imageId],
      (err, rows) => {
        console.log(err);
        if (rows.length === 0) {
          res.sendStatus(204);
        } else {
          const buffer = rows[0].image;
          res.contentType("image/png");
          res.send(buffer);
        }
      }
    );
  });

  const webServer = expressApp.listen(expressPort);
  webServer.on("upgrade", (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (socket) => {
      websocketServer.emit("connection", socket, req);
    });
  });
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
      const action = rows[0];

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
  if (event.activeIndex === null) {
    return;
  }
  let iconBuffer;
  if (payload.iconPath) {
    iconBuffer = fs.readFileSync(payload.iconPath);
  }
  db.run(
    `REPLACE INTO buttons (id, commandType, command, image) VALUES(?,?,?,?)`,
    [
      payload.activeIndex,
      payload.activeCommandType,
      payload.command,
      iconBuffer || null,
    ],
    (e) => {
      if (payload.iconPath) {
        // share info that button updated over websocket and ipc
        if (activeSocket) {
          activeSocket.send("buttonIcons:update");
        }
        mainWindow.webContents.send("buttonIcons:update");
      }
    }
  );
});
