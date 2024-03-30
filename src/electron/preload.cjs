const { contextBridge, ipcRenderer } = require('electron');

// TODO: consider unsub functions
contextBridge.exposeInMainWorld('electron', {
  /** @type {typeof window.electron.isElectronProcess} */
  isElectronProcess: true,
  /** @type {typeof window.electron.onUpdateIcons} */
  onUpdateIcons: (callback) => {
    ipcOnBuilder('buttonIcons:update')(() => callback(null));
  },
  /** @type {typeof window.electron.onRecieveIP} */
  onRecieveIP: (callback) => {
    ipcOnBuilder('ipAddress')((ipAddress) => callback(ipAddress));
  },
  /** @type {typeof window.electron.updateButton} */
  updateButton: (values) => {
    ipcSendBuilder('button:update')(values);
  },
});

// Builder methods that make ipcRenderer events typesafe
// similar to typesafeIpc.js, but cant be shared easily, as this is a preload script
/**
 * @template {keyof IpcPayloadMapping} Key
 * @param {Key} key
 */
function ipcOnBuilder(key) {
  /** @type {IpcOnFunction<Key>} */
  return (callback) => {
    ipcRenderer.on(key, (_, payload) => callback(payload));
  };
}

/**
 * @template {keyof IpcPayloadMapping} Key
 * @param {Key} key
 */
function ipcSendBuilder(key) {
  /** @type {IpcSendFunction<Key>} */
  return (payload) => {
    ipcRenderer.send(key, payload);
  };
}
