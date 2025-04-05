import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload/FileUpload";
import EntryList from "./components/EntryList/EntryList";

export type Entry = {
  id: string;
  title: string;
  username: string;
  password: string;
  otp?: string;
  url?: string;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [otherResponse, setOtherResponse] = useState<string | null>(null);
  const [searchedEntry, setSearchedEntry] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);

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

  if (otherResponse) {
    alert(otherResponse);
    setOtherResponse(null);
    return;
  }

  return (
    <>
      <FileUpload
        setEntriesFunc={handleEntries}
        setOtherResponse={handleOtherResponse}
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

      {entries.length !== 0 && searchedEntry !== "" ? (
        <EntryList
          entries={filteredEntries}
          setOtherResponse={handleOtherResponse}
          backendUrl={backendUrl}
        />
      ) : (
        <EntryList
          entries={entries}
          setOtherResponse={handleOtherResponse}
          backendUrl={backendUrl}
        />
      )}
    </>
  );
};

export default App;
