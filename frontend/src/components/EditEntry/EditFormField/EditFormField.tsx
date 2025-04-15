import { useState } from "react";
import "./EditFormField.css";

interface EditFormFieldProps {
  htmlFor: string;
  title: string;
  id: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditFormField: React.FC<EditFormFieldProps> = ({
  htmlFor,
  title,
  id,
  type,
  defaultValue,
  placeholder,
  handleChange,
}) => {
  const [buttonText, setButtonText] = useState<string>("Show");
  const [inputType, setInputType] = useState<string>(type);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    inputType === "password" ? setInputType("text") : setInputType("password");
    buttonText === "Hide" ? setButtonText("Show") : setButtonText("Hide");
  };

  return (
    <div className="edit-form-div">
      <label htmlFor={htmlFor}>
        <strong>{title}</strong>
      </label>
      <div className="input-div">
        <input
          id={id}
          type={inputType}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {type === "password" ? (
          <button onClick={(e) => handleButtonClick(e)}>{buttonText}</button>
        ) : null}
      </div>
    </div>
  );
};

export default EditFormField;
