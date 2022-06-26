import "./RadioButton.css";
import classNames from "classnames";

export function RadioButton(props) {
  return (
    <div
      onClick={() => {
        props.setActiveItem(props.index);
      }}
      className="radioButtonContainer"
    >
      <div className={classNames("radioButton", { checked: props.active })} />
      <label>{props.label}</label>
    </div>
  );
}
