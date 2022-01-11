import "./ButtonArea.css" // currently not working
import exampleIcon from "../../logo.svg"

export function ButtonArea(props) {
  return (
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
  );
}
