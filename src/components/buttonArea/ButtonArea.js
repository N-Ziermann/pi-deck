import "./ButtonArea.css"; // currently not working

export function ButtonArea(props) {
  const renderButtons = () =>
    props.icons.map((icon, index) => (
      <button key={index} onClick={() => props.onSelect(index)}>
        <img src={icon} />
      </button>
    ));

  return (
    <div className="buttonArea">
      <div className="buttons">{renderButtons()}</div>
    </div>
  );
}
