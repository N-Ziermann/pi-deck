const express = require('express');
const ws = require('ws');
const { db } = require('./db');
const { join } = require('path');
const { app } = require('electron');
const { exec } = require('child_process');
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
    const rows = db.prepare(
      'SELECT image FROM buttons WHERE id = ?;').bind(
        [req.params.imageId]).all();

    if (rows.length === 0) {
      res.sendStatus(204);
    } else {
      // @ts-ignore TODO
      const buffer = rows[0].image;
      res.contentType('image/png');
      res.send(buffer);
    }
  }

  );


  const webServer = expressApp.listen(expressPort);

  webServer.on('upgrade', (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (socket) => {
      websocketServer.emit('connection', socket, req);
    });
  });
}

// TODO: does this really belong here?
/** @param {string} buttonId */
function onButtonEvent(buttonId) {
  const rows = db.prepare(
    'SELECT commandType, command FROM buttons WHERE id = ?;').bind(buttonId).all();

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
          console.log('Executing: ' + action.command);
          console.log('Command output: ' + stdout);
          console.log('Command error: ' + stderr);
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
          console.log('Executing: ' + action.command);
          console.log('Command output: ' + stdout);
          console.log('Command error: ' + stderr);
        },
      );
      break;
    case 'open':
      open(action.command);
      console.log('Opening: ' + action.command);
      break;
    case 'exec':
      exec(action.command, (error, stdout, stderr) => {
        console.log('Executing: ' + action.command);
        console.log('Command output: ' + stdout);
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
