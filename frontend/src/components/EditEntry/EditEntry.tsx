import { Entry } from "../../App";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../App";
import "./EditEntry.css";
import { useContext, useEffect, useState } from "react";
import EditFormField from "./EditFormField/EditFormField";
import { useNavigate } from "react-router-dom";
import { UploadFormContext } from "../../App";

const EditEntry = () => {
  const { title } = useParams<{ title?: string }>();
  const navigate = useNavigate();
  const uploadFormData = useContext(UploadFormContext);

  const [fetchedData, setFetchedData] = useState<Entry | null>(null);

  const [newTitle, setNewTitle] = useState<string>("");
  const [newGroup, setNewGroup] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [newOtp, setNewOtp] = useState<string>("");

  const fetchEntry = async (title: string) => {
    const formData = new FormData();
    formData.append("title", title);

    const response = await fetch(`${backendUrl}/edit`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: uploadFormData,
      });
    }

    setFetchedData(data);
  };

  useEffect(() => {
    if (title) {
      fetchEntry(title);
      if (fetchedData?.otp) {
        setNewOtp(fetchedData.otp);
      }
    } else {
      console.error("No title provided!");
    }
  }, [title, newTitle, newGroup, newUsername, newPassword, newUrl]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", newTitle);
    formData.append("group", newGroup);
    formData.append("username", newUsername);
    formData.append("password", newPassword);
    formData.append("url", newUrl);
    formData.append("otp", newOtp);

    const response = await fetch(`${backendUrl}/updateEntry`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    navigate("/");
  };

  if (fetchedData) {
    return (
      <form className="edit-form" onSubmit={handleFormSubmit}>
        <EditFormField
          htmlFor="title"
          title="Title"
          id="title"
          type="text"
          defaultValue={`${fetchedData.title}`}
          placeholder="Title"
          handleChange={(e) => setNewTitle(e.target.value)}
        />

        <EditFormField
          htmlFor="group"
          title="Group"
          id="group"
          type="text"
          defaultValue={`${fetchedData.group}`}
          placeholder="Group"
          handleChange={(e) => setNewGroup(e.target.value)}
        />

        <EditFormField
          htmlFor="username"
          title="Username"
          id="username"
          type="text"
          defaultValue={`${fetchedData.username}`}
          placeholder="Username"
          handleChange={(e) => setNewUsername(e.target.value)}
        />

        <EditFormField
          htmlFor="password"
          title="Password"
          id="password"
          type="password"
          defaultValue={`${fetchedData.password}`}
          placeholder="Password"
          handleChange={(e) => setNewPassword(e.target.value)}
        />

        <EditFormField
          htmlFor="url"
          title="URL"
          id="url"
          type="text"
          defaultValue={`${fetchedData.url}`}
          placeholder="URL"
          handleChange={(e) => setNewUrl(e.target.value)}
        />

        <button className="edit-form-button" type="submit">
          Update
        </button>
      </form>
    );
  }
};

export default EditEntry;
