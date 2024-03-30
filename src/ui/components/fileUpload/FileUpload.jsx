import { useRef, useState } from 'react';
import { Upload } from 'react-feather';
import './FileUpload.css';

/**
 * @param {{
 *   accept: string;
 *   id: string;
 *   name: string;
 * }} props
 */
export function FileUpload(props) {
  const [activeText, setActiveText] = useState(
    /** @type {string | null} */ (null),
  );
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        className="input-element"
        onChange={(e) => setActiveText(e?.target?.files?.[0]?.name ?? null)}
        name={props.name}
        id={props.id}
        ref={fileInputRef}
      />
      <button
        type="button"
        className="icon-text-wrapper"
        onClick={() => fileInputRef?.current?.click?.()}
      >
        <Upload size={20} /> <p>{activeText || 'Upload an Icon'}</p>
      </button>
    </>
  );
}
