const BUTTON_COUNT = 18;

/** @returns {boolean} */
export function isElectronProcess() {
  return window && window.electron && window.electron.isElectronProcess;
}

/** @param {string} root */
export function getButtonIconPaths(root) {
  return Array.from({ length: BUTTON_COUNT }).map(
    (_, i) => `${root}/image/${i}?${new Date().getTime()}`,
  );
}
