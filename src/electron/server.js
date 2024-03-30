/* eslint-disable no-undef */
const express = require('express');
const ws = require('ws');
const { join } = require('path');
const { app } = require('electron');
const { exec } = require('child_process');
const { z } = require('zod');
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

  expressApp.use(express.static(join(app.getAppPath(), './ui-dist')));

  expressApp.get('/button/:buttonId', (req, res) => {
    onButtonEvent(req.params.buttonId);
    res.sendStatus(200);
  });

  expressApp.get('/image/:imageId', (req, res) => {
    const rows = db
      .prepare('SELECT image FROM buttons WHERE id = ?;')
      .bind([req.params.imageId])
      .all();
    try {
      const test = z.object({
        image: z.instanceof(Buffer),
      });
      const { image } = test.parse(rows[0]);
      res.contentType('image/png');
      res.send(image);
    } catch {
      res.sendStatus(204);
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

  const action = z
    .object({
      commandType: z.string().nullable(),
      command: z.string().nullable(),
    })
    .parse(rows[0]);

  switch (action.commandType) {
    case 'text':
      exec(
        `python3 ${join(
          app.getAppPath(),
          isDev ? './src/extraResources' : '../src/extraResources',
          './keyboardFunctions.py',
        )} type "${action.command}"`,
        (_, stdout, stderr) => {
          console.info(`Executing: ${action.command}`);
          console.info(`Command output: ${stdout}`);
          console.info(`Command error: ${stderr}`);
        },
      );
      break;
    case 'press':
      exec(
        `python3 ${join(
          app.getAppPath(),
          isDev ? './src/extraResources' : '../src/extraResources',
          './keyboardFunctions.py',
        )} press ${(action.command ?? '').split('+').join(' ')}`,
        (_, stdout, stderr) => {
          console.info(`Executing: ${action.command}`);
          console.info(`Command output: ${stdout}`);
          console.info(`Command error: ${stderr}`);
        },
      );
      break;
    case 'open':
      // eslint-disable-next-line no-restricted-globals
      open(action.command ?? '');
      console.info(`Opening: ${action.command}`);
      break;
    case 'exec':
      exec(action.command ?? '', (_, stdout, stderr) => {
        console.info(`Executing: ${action.command}`);
        console.info(`Command output: ${stdout}`);
        console.info(`Command error: ${stderr}`);
      });
      break;
    default:
      console.error('Invalid or no command given');
  }
}

module.exports = {
  activeSocket,
  initServer,
};
