import { useState } from "react";
import { Upload } from "react-feather";
import "./FileUpload.css";

export function FileUpload(props) {
  const [activeText, setActiveText] = useState(null);

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        ref={props.fileInputRef}
        className="inputElement"
        onChange={(e) => setActiveText(e?.target?.files?.[0]?.name)}
      />
      <div
        className="iconTextWrapper"
        onClick={() => props.fileInputRef?.current?.click?.()}
      >
        <Upload size={20} /> <p>{activeText || "Upload an Icon"}</p>
      </div>
    </>
  );
}
