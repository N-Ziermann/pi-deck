type ButtonDescriptor = {
  activeIndex: number;
  activeCommandType: string;
  command: string | null;
  iconPath: string | null;
};

interface Window {
  electron: {
    isElectronProcess: boolean;
    onUpdateIcons: (callback: () => void) => void;
    onRecieveIP: (callback: (address: string) => void) => void;
    updateButton: (values: ButtonDescriptor) => void;
  };
}
