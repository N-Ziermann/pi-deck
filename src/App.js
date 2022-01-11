import "./App.css";
import exampleIcon from "./logo.svg"

function App() {
  return (
    <div className="app">
      <div className="container">
        <div className="buttonArea">
          <div className="buttons">
            <button type="button" name="button">
              <img src={exampleIcon} />
            </button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
            <button type="button" name="button"></button>
          </div>
        </div>
        <div className="configArea">
          <h1>Config</h1>
          <h3>Type of Command</h3>
          <input type="radio" value="a" name="option" checked />
          <label>Type Text</label>
          <br />
          <input type="radio" value="b" name="option" checked />
          <label>Press Keycombination</label>
          <br />
          <input type="radio" value="c" name="option" />
          <label>Program / Script</label>
          <br />
          <input type="radio" value="d" name="option" /> <label>Command</label>
          <br />
          <h3>Value</h3>
          <input placeholder="ctrl+alt" className="commandInput" />
          <input placeholder="Hello World" className="commandInput" />
          <input placeholder="path/to/file" className="commandInput" />
          <input placeholder="shell command" className="commandInput" />
          <h3>Icon</h3>
          <input type="file" accept="image/png, image/jpeg" id="iconUpload" />
        </div>
      </div>
    </div>
  );
}

export default App;
