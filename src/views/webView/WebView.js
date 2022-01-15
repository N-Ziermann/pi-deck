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

  const getButtonSources = () => {
    let sources = [];
    for (let i = 0; i < 18; i++) {
      sources.push(`./image/${i}`);
    }
    return sources;
  };

  return <ButtonArea onSelect={onSelect} icons={getButtonSources()} />;
}
