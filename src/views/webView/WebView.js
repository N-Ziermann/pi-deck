import { ButtonArea } from "../../components/buttonArea/ButtonArea";
import "./WebView.css";
import { useEffect, useState } from "react";

export function WebView() {
  const [imageSources, setImageSources] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:3000`);
    socket.onmessage = function (event) {
      if (event.data === "buttonIcons:update") {
        updateButtonSources();
      }
    };
  }, []);

  useEffect(() => updateButtonSources(), []);

  const onSelect = async (id) => {
    try {
      await fetch(`./button/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const updateButtonSources = () => {
    let paths = [];
    for (let i = 0; i < 18; i++) {
      paths.push(`./image/${i}?${new Date().getTime()}`);
    }
    setImageSources(paths);
  };

  return <ButtonArea onSelect={onSelect} icons={imageSources} />;
}
