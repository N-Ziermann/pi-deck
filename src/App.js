import "./App.css";
import { ButtonArea } from "./components/buttonArea/ButtonArea";
import { RadioButton } from "./components/radioButton/RadioButton";
import exampleIcon from "./logo.svg";
import { useState } from "react";

function App() {
  const [activeCommandType, setActiveCommandType] = useState(0);
  return (
    <div className="app">
      <div className="container">
        <ButtonArea
          onSelect={(index) => console.log(index)}
          icons={[
            null,
            exampleIcon,
            null,
            null,
            exampleIcon,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            exampleIcon,
            exampleIcon,
            null,
          ]}
        />
        {window.location.href.includes("#electron") && (
          <div className="configArea">
            <h1>Config</h1>
            <h3>Type of Command</h3>
            {
              // <input type="radio" value="a" name="option" checked />
              //<label>Type Text</label>
            }
            <RadioButton
              label="Type Text"
              onSelect={console.log}
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
              label="Program / Script"
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

            {/*<br />
            <input type="radio" value="b" name="option" checked />
            <label>Press Keycombination</label>
            <br />
            <input type="radio" value="c" name="option" />
            <label>Program / Script</label>
            <br />
            <input type="radio" value="d" name="option" />{" "}
            <label>Command</label>*/}
            <br />
            <h3>Value</h3>
            <input placeholder="ctrl+alt" className="commandInput" />
            <input placeholder="Hello World" className="commandInput" />
            <input placeholder="path/to/file" className="commandInput" />
            <input placeholder="shell command" className="commandInput" />
            <h3>Icon</h3>
            <input type="file" accept="image/png, image/jpeg" id="iconUpload" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
