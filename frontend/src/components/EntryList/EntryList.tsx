import "./EntryList.css";
import { Entry } from "../../App";
import React, { useState } from "react";

interface Props {
  entries: Entry[];
}

const EntryList: React.FC<Props> = ({ entries }) => {
  const [selected, setSelected] = useState<String | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

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
                  OTP: {entry.otp}{" "}
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
