/// <reference path="./types/messaging.d.ts" />

interface Window {
  electron: {
    isElectronProcess: boolean;
    onUpdateIcons: IpcOnFunction<'buttonIcons:update'>;
    onRecieveIP: IpcOnFunction<'ipAddress'>;
    updateButton: IpcSendFunction<'button:update'>;
  };
}
