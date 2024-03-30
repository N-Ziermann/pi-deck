import { useEffect, useState } from 'react';

import { ButtonArea } from '../../components/buttonArea/ButtonArea';

export function WebView() {
  const [imageSources, setImageSources] = useState(
    /** @type {string[]} */ ([]),
  );

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:3000`);
    socket.onmessage = (event) => {
      if (event.data === 'buttonIcons:update') {
        updateButtonSources();
      }
    };
  }, []);

  useEffect(() => updateButtonSources(), []);

  /** @param {number} id */
  const onSelect = async (id) => {
    try {
      await fetch(`./button/${id}`);
    } catch {
      /** Do nothing */
    }
  };

  const updateButtonSources = () => {
    /** @type {string[]} */
    const paths = [];
    for (let i = 0; i < 18; i++) {
      // TODO: duplicate logic of code in electronview
      paths.push(`./image/${i}?${new Date().getTime()}`);
    }
    setImageSources(paths);
  };

  return <ButtonArea onSelect={onSelect} icons={imageSources} />;
}
