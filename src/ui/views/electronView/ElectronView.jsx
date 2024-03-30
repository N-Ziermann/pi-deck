import { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonArea } from '../../components/buttonArea/ButtonArea';
import { RadioButton } from '../../components/radioButton/RadioButton';
import './ElectronView.css';
import { FileUpload } from '../../components/fileUpload/FileUpload';
import { getButtonIconPaths } from '../../util';

const InputNames = {
  file: 'file',
  command: 'command',
  commandType: 'commandType',
};

const InputPlacerholders = {
  text: 'Hello World',
  press: 'ctrl+a',
  open: '/path/to/file',
  exec: 'echo 1',
};

export function ElectronView() {
  const [inputPlaceholder, setInputPlacerholder] = useState(
    InputPlacerholders.text,
  );
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [webIP, setWebIP] = useState('');
  const [imageSources, setImageSources] = useState(
    /** @type {string[]} */ ([]),
  );
  const formRef = useRef(/** @type {HTMLFormElement | null} */ (null));

  useEffect(() => {
    updateButtonSources();
  }, []);

  useEffect(() => {
    const unsub = window.electron.onUpdateIcons(() => {
      updateButtonSources();
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = window.electron.onRecieveIP((address) => {
      if (address) {
        setWebIP(address);
      }
    });
    return unsub;
  }, []);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
    formRef.current
      ?.querySelector(`[name="${InputNames.file}"]`)
      ?.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  useEffect(() => {
    resetForm();
  }, [activeButtonIndex, resetForm]);

  const updateButtonSources = () => {
    setImageSources(getButtonIconPaths('http://localhost:3000'));
  };

  const onSubmit = useCallback(
    /** @param {React.FormEvent<HTMLFormElement>} e */
    (e) => {
      e.preventDefault();
      const form = /** @type {HTMLFormElement} */ (e.target);
      const formData = new FormData(form);
      const iconFile = formData.get(InputNames.file)?.valueOf();
      window.electron.updateButton({
        activeIndex: activeButtonIndex,
        activeCommandType:
          formData.get(InputNames.commandType)?.toString() ?? '',
        command: formData.get(InputNames.command)?.toString() ?? null,
        iconPath: iconFile && iconFile instanceof File ? iconFile.path : null,
      });
      resetForm();
    },
    [activeButtonIndex, resetForm],
  );

  return (
    <>
      <ButtonArea
        activeIndex={activeButtonIndex}
        onSelect={(index) => setActiveButtonIndex(index)}
        icons={imageSources}
      />
      <div>
        <form
          ref={formRef}
          className="config-area"
          onSubmit={onSubmit}
          onChange={(e) => {
            const eventTarget = /** @type {HTMLInputElement} */ (e.target);
            if (eventTarget.name === InputNames.commandType) {
              /** @type {HTMLInputElement | null | undefined} */
              const commandInput = formRef.current?.querySelector(
                `[name="${InputNames.command}"]`,
              );
              if (commandInput) {
                commandInput.value = '';
                setInputPlacerholder(
                  InputPlacerholders[
                    /** @type {keyof typeof InputPlacerholders} */ (
                      eventTarget.value
                    )
                  ],
                );
              }
            }
          }}
        >
          {activeButtonIndex !== null && (
            <div>
              <h1>Config</h1>
              <div>
                <h3>Type of Command</h3>
                <RadioButton
                  name={InputNames.commandType}
                  value="text"
                  id="text"
                  label="Type Text"
                  defaultChecked
                />
                <RadioButton
                  name={InputNames.commandType}
                  value="press"
                  id="press"
                  label="Press Keycombination"
                />
                <RadioButton
                  name={InputNames.commandType}
                  value="open"
                  id="open"
                  label="Open file"
                />
                <RadioButton
                  name={InputNames.commandType}
                  value="exec"
                  id="exec"
                  label="Command"
                />
                <h3>Value</h3>
                <input
                  id="commandInput"
                  name={InputNames.command}
                  placeholder={inputPlaceholder}
                  type="text"
                  defaultValue=""
                  className="command-input"
                />
                <h3>Icon</h3>
                <FileUpload
                  accept="image/png, image/jpeg"
                  name={InputNames.file}
                  id="file"
                />
                <button type="submit" className="apply-button">
                  Apply
                </button>
              </div>
            </div>
          )}
        </form>
        {!!webIP && (
          <p className="web-ui-address">{`Deck: http://${webIP}:3000`}</p>
        )}
      </div>
    </>
  );
}
