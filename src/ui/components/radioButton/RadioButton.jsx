import './RadioButton.css';
import classNames from 'classnames';

/**
 * @param {{
 *   setActiveItem: (index: number) => void;
 *   index: number;
 *   label: string;
 *   active: boolean;
 * }} props
 */
// TODO: try to use the actual html radio input
export function RadioButton(props) {
  return (
    <div
      onClick={() => {
        props.setActiveItem(props.index);
      }}
      className="radioButtonContainer"
    >
      <div className={classNames('radioButton', { checked: props.active })} />
      <label>{props.label}</label>
    </div>
  );
}
