import { useState } from "react";
import { Doctor } from "../types/doctor";
import './AutocompleteSearch.css';

type Props = {
  doctors: Doctor[];
  onSearch: (results: Doctor[], searchTerm: string) => void;  // 👈 Fix this line
};

const AutocompleteSearch = ({ doctors, onSearch }: Props) => {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    const filtered = doctors.filter((doc) =>
      doc.name.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filtered, value);  // 👈 Pass both filtered results and the search term
  };

  return (
    <input
      type="text"
      placeholder="Search doctors..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      className="border rounded px-4 py-2 w-full"
    />
  );
};

export default AutocompleteSearch;
