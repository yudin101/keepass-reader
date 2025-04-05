import "./EntryList.css";
import { Entry } from "../../App";
import React, { useState } from "react";

interface Props {
  entries: Entry[];
  setOtherResponse: (data: string) => void;
  backendUrl: string;
}

const EntryList: React.FC<Props> = ({
  entries,
  setOtherResponse,
  backendUrl,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [updatedOtp, setUpdatedOtp] = useState<string | null>(null);

  const handleClick = (selectedId: string) => {
    selected != selectedId ? setSelected(selectedId) : setSelected(null);
    selected && passwordVisible ? setPasswordVisible(false) : null;
    selected && copyStatus === "Copied" ? setCopyStatus("Copy") : null;
  };

  const handlePasswordVisibility = (
    e: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    e.stopPropagation();
    setPasswordVisible(!passwordVisible);
  };

  const handleCopy = (
    e: React.MouseEvent<HTMLSpanElement>,
    password: string | undefined,
  ) => {
    e.stopPropagation();
    if (password) {
      navigator.clipboard.writeText(password);
    }
    setCopyStatus("Copied");
  };

  const handleUpdate = async (
    e: React.MouseEvent<HTMLSpanElement>,
    title: string,
  ) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("title", title);

    const response = await fetch(`${backendUrl}/update`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.otp) {
      setUpdatedOtp(data.otp);
    } else {
      setOtherResponse(data.error);
    }
  };

  return (
    <>
      {entries.map((entry, index) => (
        <div
          className="entry-body"
          key={index}
          onClick={() => handleClick(entry.id)}
        >
          <div className="entry-title">
            <h3>{entry.title}</h3>
            {selected !== entry.id ? (
              <>
                <p>{entry.username}</p>
                <p>{entry.url}</p>
              </>
            ) : null}
          </div>
          {selected === entry.id ? (
            <div className="entry-details">
              {entry.url && <p>URL: {entry.url}</p>}
              <p>Username: {entry.username}</p>
              <span onClick={handlePasswordVisibility}>
                Password:{" "}
                {passwordVisible ? (
                  `${entry.password}`
                ) : (
                  <span className="hover-underline">Click to show</span>
                )}
                {" | "}
                <span onClick={(e) => handleCopy(e, entry.password)}>
                  <span className="hover-underline">{copyStatus}</span>
                </span>
              </span>
              {entry.otp && (
                <p>
                  OTP: {updatedOtp ? (entry.otp = updatedOtp) : entry.otp}{" "}
                  <span onClick={(e) => handleUpdate(e, entry.title)}>
                    {" | "}
                    <span className="hover-underline">Update</span>
                  </span>
                  <span onClick={(e) => handleCopy(e, entry.otp)}>
                    {" | "}
                    <span className="hover-underline">{copyStatus}</span>
                  </span>
                </p>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

export default EntryList;
