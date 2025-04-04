import React, { useState } from "react";
import "./FileUpload.css";
import type { Entry } from "../../App";

type FileUploadProps = {
  setEntriesFunc: (data: Entry[]) => void;
};

type OtherResponseProps = {
  setOtherResponse: (data: String) => void;
};

const FileUpload = ({
  setEntriesFunc,
  setOtherResponse,
}: FileUploadProps & OtherResponseProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<String | null>("No file chosen");
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

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.entries) {
      setEntriesFunc(data.entries);
    } else {
      setOtherResponse(data.message);
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
