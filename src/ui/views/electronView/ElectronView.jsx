import { useState, useEffect, useRef } from 'react';
import { ButtonArea } from '../../components/buttonArea/ButtonArea';
import { RadioButton } from '../../components/radioButton/RadioButton';
import './ElectronView.css';
import { FileUpload } from '../../components/fileUpload/FileUpload';

const COMMANDS = ['text', 'press', 'open', 'exec'];

export function ElectronView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCommandType, setActiveCommandType] = useState(0);
  const [command, setCommand] = useState('');
  const [webIP, setWebIP] = useState('');
  const [imageSources, setImageSources] = useState(
    /** @type {string[]} */ ([]),
  );
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  useEffect(() => {
    updateButtonSources();
  }, []);

  useEffect(() => {
    window.electron.onUpdateIcons(() => {
      updateButtonSources();
    });

    window.electron.onRecieveIP((address) => {
      if (address) {
        setWebIP(address);
      }
    });
  }, []);

  useEffect(() => {
    setCommand('');
  }, [activeCommandType]);

  useEffect(() => {
    setActiveCommandType(0);
    setCommand('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.dispatchEvent(
        new Event('change', { bubbles: true }),
      );
    }
  }, [activeIndex]);

  const applyChanges = () => {
    const values = {
      activeIndex,
      activeCommandType: COMMANDS[activeCommandType],
      command: command !== '' ? command : null,
      iconPath: fileInputRef?.current?.files?.[0]
        ? fileInputRef.current.files[0].path
        : null,
    };
    window.electron.updateButton(values);
  };

  const updateButtonSources = () => {
    /** @type {string[]} */
    const urls = [];
    for (let i = 0; i < 18; i++) {
      urls.push(`http://localhost:3000/image/${i}?${new Date().getTime()}`);
    }
    return setImageSources(urls);
  };

  return (
    <>
      <ButtonArea
        activeIndex={activeIndex}
        onSelect={(index) => setActiveIndex(index)}
        icons={imageSources}
      />
      <div>
        <div className="configArea">
          {activeIndex !== null && (
            <>
              <h1>Config</h1>
              <h3>Type of Command</h3>
              <RadioButton
                label="Type Text"
                index={0}
                setActiveItem={setActiveCommandType}
                active={activeCommandType === 0}
              />
              <RadioButton
                label="Press Keycombination"
                index={1}
                setActiveItem={setActiveCommandType}
                active={activeCommandType === 1}
              />
              <RadioButton
                label="Open file"
                index={2}
                setActiveItem={setActiveCommandType}
                active={activeCommandType === 2}
              />
              <RadioButton
                label="Command"
                index={3}
                setActiveItem={setActiveCommandType}
                active={activeCommandType === 3}
              />
              <br />
              <h3>Value</h3>
              {activeCommandType === 0 && (
                <input
                  placeholder="Hello World"
                  className="commandInput"
                  onChange={(e) => {
                    setCommand(e.target.value);
                  }}
                  value={command}
                />
              )}
              {activeCommandType === 1 && (
                <input
                  placeholder="control+alt"
                  className="commandInput"
                  onChange={(e) => {
                    setCommand(e.target.value);
                  }}
                  value={command}
                />
              )}
              {activeCommandType === 2 && (
                <input
                  placeholder="path/to/file"
                  className="commandInput"
                  onChange={(e) => {
                    setCommand(e.target.value);
                  }}
                  value={command}
                />
              )}
              {activeCommandType === 3 && (
                <input
                  placeholder="shell command"
                  className="commandInput"
                  onChange={(e) => {
                    setCommand(e.target.value);
                  }}
                  value={command}
                />
              )}
              <h3>Icon</h3>
              <FileUpload
                accept="image/png, image/jpeg"
                fileInputRef={fileInputRef}
              />
              <button
                // TODO: maybe use a form and turn this into type="apply"?
                type="button"
                onClick={() => applyChanges()}
                className="applyButton"
              >
                Apply
              </button>
            </>
          )}
        </div>
        {webIP !== '' && (
          <p className="webUIAdress">{`Deck: http://${webIP}:3000`}</p>
        )}
      </div>
    </>
  );
}
