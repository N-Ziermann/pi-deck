import { useState } from 'react';
import { Upload } from 'react-feather';
import './FileUpload.css';

/**
 * @param {{
 *   accept: string;
 *   fileInputRef: import('react').RefObject<HTMLInputElement>;
 * }} props
 */
export function FileUpload(props) {
  const [activeText, setActiveText] = useState(
    /** @type {string | null} */ (null),
  );

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        ref={props.fileInputRef}
        className="inputElement"
        onChange={(e) => setActiveText(e?.target?.files?.[0]?.name ?? null)}
      />
      <button
        type="button"
        className="iconTextWrapper"
        onClick={() => props.fileInputRef?.current?.click?.()}
      >
        <Upload size={20} /> <p>{activeText || 'Upload an Icon'}</p>
      </button>
    </>
  );
}
