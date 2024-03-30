type IpcPayloadMapping = {
  ipAddress: string;
  'button:update': ButtonDescriptor;
  'buttonIcons:update': null;
};

// helpers to make ipc processes typesafe
type IpcOnFunction<Key extends keyof IpcPayloadMapping> = (
  callback: (payload: IpcPayloadMapping[Key]) => void,
) => void;

type IpcSendFunction<Key extends keyof IpcPayloadMapping> = (
  payload: IpcPayloadMapping[Key],
) => void;

type ButtonDescriptor = {
  activeIndex: number;
  activeCommandType: string;
  command: string | null;
  iconPath: string | null;
};
