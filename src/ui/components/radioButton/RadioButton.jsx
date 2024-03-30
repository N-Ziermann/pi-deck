/**
 * @param {{
 *   name: string;
 *   id: string;
 *   value: string;
 *   label: string;
 *   defaultChecked?: boolean;
 * }} props
 */
export function RadioButton(props) {
  return (
    <div>
      <input
        type="radio"
        name={props.name}
        id={props.id}
        value={props.value}
        defaultChecked={props.defaultChecked}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
}
