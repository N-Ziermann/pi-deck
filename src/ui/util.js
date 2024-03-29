export function isElectronProcess() {
  return window && window.electron && window.electron.isElectronProcess;
}
