import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import FileUpload from "./components/FileUpload/FileUpload";
import EntryList from "./components/EntryList/EntryList";
import EditEntry from "./components/EditEntry/EditEntry";

export type Entry = {
  id: string;
  title: string;
  username: string;
  password: string;
  group: string;
  otp?: string;
  url?: string;
};

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UploadFormContext = createContext<FormData | null>(null);

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [otherResponse, setOtherResponse] = useState<string | null>(null);
  const [searchedEntry, setSearchedEntry] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);

  const [uploadFormData, setUploadFormData] = useState<FormData | null>(null);

  const handleEntries = (data: Entry[]) => {
    setEntries(data);
  };

  const handleOtherResponse = (data: string) => {
    setOtherResponse(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedEntry(e.target.value);
    setFilteredEntries(
      entries.filter((entry) =>
        entry.title.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };

  const handleUploadFormData = (data: FormData) => {
    setUploadFormData(data)
  }

  if (otherResponse) {
    alert(otherResponse);
    setOtherResponse(null);
    return;
  }

  return (
    <UploadFormContext.Provider value={uploadFormData}>
      <>
        <FileUpload
          setEntriesFunc={handleEntries}
          setOtherResponse={handleOtherResponse}
          setUploadFormData={handleUploadFormData}
          backendUrl={backendUrl}
        />

        {entries.length !== 0 && (
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => handleChange(e)}
            className="search-box"
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <EntryList
                entries={
                  entries.length !== 0 && searchedEntry !== ""
                    ? filteredEntries
                    : entries
                }
                setOtherResponse={handleOtherResponse}
                backendUrl={backendUrl}
              />
            }
          />
          <Route path="/edit/:title" element={<EditEntry />} />
        </Routes>
      </>
    </UploadFormContext.Provider>
  );
};

export default App;
