
import { ButtonArea } from "../../components/buttonArea/ButtonArea";
import "./WebView.css";

export function WebView() {
  const onSelect = async (id) => {
    try {
      await fetch(`./button/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ButtonArea
      onSelect={onSelect}
      icons={[
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
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]}
    />
  );
}
