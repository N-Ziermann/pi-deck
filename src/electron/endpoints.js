const open = require('open');
const { z } = require('zod');
const { exec } = require('child_process');
const { app } = require('electron');
const { join } = require('path');
const { db } = require('./db');
const { isDev } = require('./env');

/** @param {import('express').Express} expressApp */
function defineEndpoints(expressApp) {
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
      const { image } = z
        .object({
          image: z.instanceof(Buffer),
        })
        .parse(rows[0]);
      res.contentType('image/png');
      res.send(image);
    } catch {
      res.sendStatus(204);
    }
  });
}

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
    case 'press':
      callPythonScript(action.command ?? '', action.commandType);
      break;
    case 'open':
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

/**
 * @param {string} command
 * @param {string} commandType
 */
function callPythonScript(command, commandType) {
  exec(
    `python3 ${join(
      app.getAppPath(),
      isDev ? './src/extraResources' : '../src/extraResources',
      './keyboardFunctions.py',
    )} ${commandType === 'text' ? 'type' : 'press'} ${(command ?? '').split('+').join(' ')}`,
    (_, stdout, stderr) => {
      console.info(`Executing: ${command}`);
      console.info(`Command output: ${stdout}`);
      console.info(`Command error: ${stderr}`);
    },
  );
}

module.exports = {
  defineEndpoints,
};
