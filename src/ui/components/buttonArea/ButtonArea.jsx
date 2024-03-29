import './ButtonArea.css';
import classNames from 'classnames';

/**
 * @param {{
 *   icons: string[];
 *   onSelect: (index: number) => void;
 *   activeIndex?: number;
 * }} props
 */
export function ButtonArea(props) {
  const renderButtons = () =>
    props.icons.map((icon, index) => (
      <button
        key={index}
        onClick={() => props.onSelect(index)}
        className={classNames({ active: props.activeIndex === index })}
      >
        <img src={icon} alt="" />
      </button>
    ));

  return (
    <div className="buttonArea">
      <div className="buttons">{renderButtons()}</div>
    </div>
  );
}
