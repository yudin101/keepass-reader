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

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [otherResponse, setOtherResponse] = useState<String | null>(null);
  const [searchedEntry, setSearchedEntry] = useState<String>("");
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);

  const handleEntries = (data: Entry[]) => {
    setEntries(data);
  };

  const handleOtherResponse = (data: String) => {
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
        <EntryList entries={filteredEntries} />
      ) : (
        <EntryList entries={entries} />
      )}
    </>
  );
};

export default App;
