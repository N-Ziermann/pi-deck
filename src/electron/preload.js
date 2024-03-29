const { contextBridge, ipcRenderer } = require('electron');

// TODO: make sure this is part of the final bundle
// TODO: properly type ipcRenderer events (both inside electron and on the window object)
contextBridge.exposeInMainWorld('electron', {
  isElectronProcess: true,
  onUpdateIcons: (callback) =>
    ipcRenderer.on('buttonIcons:update', () => callback()),
  onRecieveIP: (callback) =>
    ipcRenderer.on('ipAddress', (_, ip) => callback(ip)),
  updateButton: (values) => ipcRenderer.send('button:update', values),
});
