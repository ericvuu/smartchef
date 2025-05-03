import React from "react";
import styles from "../styles/SearchForm.module.css";

function SearchForm({ query, onQueryChange, onSearch }) {
  return (
    <form
      className={styles.form}
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
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}

export default SearchForm;
