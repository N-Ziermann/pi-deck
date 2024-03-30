type IpcPayloadMapping = {
  ipAddress: string;
  'button:update': ButtonDescriptor;
  'buttonIcons:update': null;
};

// helpers to make ipc processes typesafe

type UnsubscribeFunction = () => void;

type IpcOnFunction<Key extends keyof IpcPayloadMapping> = (
  callback: (payload: IpcPayloadMapping[Key]) => void,
) => UnsubscribeFunction;

type IpcSendFunction<Key extends keyof IpcPayloadMapping> = (
  payload: IpcPayloadMapping[Key],
) => void;

type ButtonDescriptor = {
  activeIndex: number;
  activeCommandType: string;
  command: string | null;
  iconPath: string | null;
};
