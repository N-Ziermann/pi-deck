import { ButtonArea } from "../../components/buttonArea/ButtonArea";
import { RadioButton } from "../../components/radioButton/RadioButton";
import exampleIcon from "../../logo.svg";
import { useState, useEffect, useRef } from "react";
import "./ElectronView.css";

// NEEDS WORK!
let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const COMMANDS = {
  0: "text",
  1: "press",
  2: "open",
  3: "exec",
};

export function ElectronView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCommandType, setActiveCommandType] = useState(0);
  const [command, setCommand] = useState("");
  const fileInputRef = useRef();
  const [imageSources, setImageSources] = useState([]);

  useEffect(() => updateButtonSources(), []);

  useEffect(() => {
    ipcRenderer.on("buttonIcons:update", () => {
      updateButtonSources();
    });
  }, []);

  useEffect(() => {
    setCommand("");
  }, [activeCommandType]);

  useEffect(() => {
    setActiveCommandType(0);
    setCommand("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [activeIndex]);

  const applyChanges = () => {
    const values = {
      activeIndex,
      activeCommandType: COMMANDS[activeCommandType],
      command: command !== "" ? command : null,
      iconPath: fileInputRef?.current?.files?.[0]
        ? fileInputRef.current.files[0].path
        : null,
    };
    ipcRenderer.send("button:update", values);
  };

  const updateButtonSources = () => {
    let urls = [];
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
              onSelect={console.log}
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
            <input
              type="file"
              accept="image/png, image/jpeg"
              id="iconUpload"
              ref={fileInputRef}
            />
            <br />
            <br />
            <br />
            <button onClick={() => applyChanges()}>Apply</button>
          </>
        )}
      </div>
    </>
  );
}
