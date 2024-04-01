const { ipcMain } = require('electron');

// Builder methods that make ipcRenderer events typesafe
// similar to code in preload.js, but cant be shared easily, as that is a preload script
/**
 * @template {keyof IpcPayloadMapping} Key
 * @param {Key} key
 */
function ipcMainOnBuilder(key) {
  /** @type {IpcOnFunction<Key>} */
  return (callback) => {
    /** @type {(_: any, payload: any) => void} */
    const cb = (_, payload) => callback(payload);
    ipcMain.on(key, cb);
    return () => {
      ipcMain.off(key, cb);
    };
  };
}

/**
 * @template {keyof IpcPayloadMapping} Key
 * @param {Key} key
 * @param {import('electron/main').WebContents} webContents
 */
function ipcMainSendBuilder(key, webContents) {
  /** @type {IpcSendFunction<Key>} */
  return (payload) => {
    webContents.send(key, payload);
  };
}

module.exports = {
  ipcMainOnBuilder,
  ipcMainSendBuilder,
};
