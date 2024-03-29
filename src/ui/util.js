export function isElectronProcess() {
  return window && window.process && window.process.type === 'renderer';
}
