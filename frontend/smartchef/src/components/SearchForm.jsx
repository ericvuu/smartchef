import React from "react";

function SearchForm({ query, onQueryChange, onSearch }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        type="text"
        value={query}
        onChange={onQueryChange}
        placeholder="Search for recipes..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
