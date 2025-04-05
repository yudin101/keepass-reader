import React, { useState } from "react";
import "./FileUpload.css";
import type { Entry } from "../../App";

interface FunctionProps {
  setOtherResponse: (data: string) => void;
  setEntriesFunc: (data: Entry[]) => void;
  backendUrl: string,
}

const FileUpload: React.FC<FunctionProps> = ({
  setEntriesFunc,
  setOtherResponse,
  backendUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>("No file chosen");
  const [password, setPassword] = useState("");

  const handleFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Select a file!");
      return;
    }

    if (!password) {
      alert("Enter password!");
      return;
    }

    const formData = new FormData();
    formData.append("db-file", file);
    formData.append("db-password", password);

    const response = await fetch(`${backendUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.entries) {
      setEntriesFunc(data.entries);
    } else {
      setOtherResponse(data.error);
    }
  };

  return (
    <>
      <form className="file-upload-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="button-side">{fileName}</div>
          <input id="file-input" type="file" onChange={handleFile} />
          <label className="green-button" htmlFor="file-input">
            Open database
          </label>
        </div>
        <div className="form-section">
          <input
            className="button-side password-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input className="green-button" type="submit" value="Submit" />
        </div>
      </form>
    </>
  );
};

export default FileUpload;
