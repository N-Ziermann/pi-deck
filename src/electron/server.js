/* eslint-disable no-undef */
const express = require('express');
const ws = require('ws');
const { join } = require('path');
const { app } = require('electron');
const { exec } = require('child_process');
const { db } = require('./db');
const { isDev } = require('./env');

const expressApp = express();
const expressPort = 3000;
const websocketServer = new ws.Server({ noServer: true });

/** @type {{ socket: ws | null }} */
const activeSocket = { socket: null };

function initServer() {
  websocketServer.on('connection', (socket) => {
    activeSocket.socket = socket;
  });

  expressApp.use(express.static(join(app.getAppPath(), './react')));

  expressApp.get('/button/:buttonId', (req, res) => {
    onButtonEvent(req.params.buttonId);
    res.sendStatus(200);
  });

  expressApp.get('/image/:imageId', (req, res) => {
    const rows = db
      .prepare('SELECT image FROM buttons WHERE id = ?;')
      .bind([req.params.imageId])
      .all();

    // TODO: zod
    if (
      !rows[0] ||
      typeof rows[0] !== 'object' ||
      !('image' in rows[0]) ||
      !(rows[0].image instanceof Blob)
    ) {
      res.sendStatus(204);
    } else {
      const buffer = rows[0].image;
      res.contentType('image/png');
      res.send(buffer);
    }
  });

  const webServer = expressApp.listen(expressPort);

  webServer.on('upgrade', (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (sock) => {
      websocketServer.emit('connection', sock, req);
    });
  });
}

// TODO: does this really belong here?
/** @param {string} buttonId */
function onButtonEvent(buttonId) {
  const rows = db
    .prepare('SELECT commandType, command FROM buttons WHERE id = ?;')
    .bind(buttonId)
    .all();

  if (rows.length === 0) {
    return;
  }
  /** @type any */
  const action = rows[0];

  switch (action.commandType) {
    case 'text':
      exec(
        `python3 ${join(
          app.getAppPath(),
          isDev ? './src/extraResources' : '../src/extraResources',
          './keyboardFunctions.py',
        )} type "${action.command}"`,
        (_, stdout, stderr) => {
          console.log(`Executing: ${action.command}`);
          console.log(`Command output: ${stdout}`);
          console.log(`Command error: ${stderr}`);
        },
      );
      break;
    case 'press':
      exec(
        `python3 ${join(
          app.getAppPath(),
          isDev ? './src/extraResources' : '../src/extraResources',
          './keyboardFunctions.py',
        )} press ${action.command.split('+').join(' ')}`,
        (_, stdout, stderr) => {
          console.log(`Executing: ${action.command}`);
          console.log(`Command output: ${stdout}`);
          console.log(`Command error: ${stderr}`);
        },
      );
      break;
    case 'open':
      // eslint-disable-next-line no-restricted-globals
      open(action.command);
      console.log(`Opening: ${action.command}`);
      break;
    case 'exec':
      exec(action.command, (_, stdout, stderr) => {
        console.log(`Executing: ${action.command}`);
        console.log(`Command output: ${stdout}`);
        console.log(`Command error: ${stderr}`);
      });
      break;
    default:
      console.log('Invalid or no command given');
  }
}

module.exports = {
  activeSocket,
  initServer,
};
