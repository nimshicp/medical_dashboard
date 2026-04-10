import React from "react";

const SearchBar = ({ setFilters }) => {
  return (
    <div>
      <input
        placeholder="Search by name"
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <input
        placeholder="Tag"
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, tag: e.target.value }))
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, date: e.target.value }))
        }
      />
    </div>
  );
};

export default SearchBar;