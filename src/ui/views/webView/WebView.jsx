import { useEffect, useState } from 'react';

import { ButtonArea } from '../../components/buttonArea/ButtonArea';
import { getButtonIconPaths } from '../../util';

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
    setImageSources(getButtonIconPaths('.'));
  };

  return <ButtonArea onSelect={onSelect} icons={imageSources} />;
}
