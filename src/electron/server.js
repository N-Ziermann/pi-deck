const express = require('express');
const ws = require('ws');
const { join } = require('path');
const { app } = require('electron');
const { defineEndpoints } = require('./endpoints');

const expressApp = express();
const expressPort = 3000;
const websocketServer = new ws.Server({ noServer: true });

/** @type {{ socket: ws | null }} */
const activeSocket = { socket: null };

function initServer() {
  websocketServer.on('connection', (socket) => {
    activeSocket.socket = socket;
  });

  // TODO: in dev mode this needs to proxy the devserver (seems to break hmr)
  expressApp.use(express.static(join(app.getAppPath(), './ui-dist')));

  defineEndpoints(expressApp);

  const webServer = expressApp.listen(expressPort);

  webServer.on('upgrade', (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (sock) => {
      websocketServer.emit('connection', sock, req);
    });
  });
}

module.exports = {
  activeSocket,
  initServer,
};
