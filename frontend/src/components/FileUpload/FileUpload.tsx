import React, { useState } from "react";
import "./FileUpload.css";
import type { Entry } from "../../App";

interface FunctionProps {
  setOtherResponse: (data: string) => void;
  setEntriesFunc: (data: Entry[]) => void;
  setUploadFormData: (data: FormData) => void;
  backendUrl: string;
}

const FileUpload: React.FC<FunctionProps> = ({
  setEntriesFunc,
  setOtherResponse,
  setUploadFormData,
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

    setUploadFormData(formData)

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

  const handleDownload = async () => {
    const response = await fetch(
      `${backendUrl}/download/${fileName === "No file chosen" ? "" : fileName}`,
    );

    if (!response.ok) {
      setOtherResponse(response.statusText);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <form className="file-upload-form" onSubmit={handleSubmit}>
        <div>
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
        </div>
        <button type="button" className="green-button" onClick={handleDownload}>
          Download
        </button>
      </form>
    </>
  );
};

export default FileUpload;
