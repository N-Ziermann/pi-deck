const { contextBridge, ipcRenderer } = require('electron');

// TODO: make sure this is part of the final bundle
// TODO: make communication between the ipcRenderer and electron typesafe
contextBridge.exposeInMainWorld('electron', {
  /** @type {typeof window.electron.isElectronProcess} */
  isElectronProcess: true,
  /** @type {typeof window.electron.onUpdateIcons} */
  onUpdateIcons: (callback) => {
    ipcRenderer.on('buttonIcons:update', () => callback());
  },
  /** @type {typeof window.electron.onRecieveIP} */
  onRecieveIP: (callback) => {
    ipcRenderer.on('ipAddress', (_, ip) => callback(ip));
  },
  /** @type {typeof window.electron.updateButton} */
  updateButton: (values) => {
    ipcRenderer.send('button:update', values);
  },
});
