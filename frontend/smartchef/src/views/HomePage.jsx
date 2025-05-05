import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import RecipeList from "../components/RecipeList";
import styles from "../styles/HomePage.module.css";

const apiUrl = import.meta.env.VITE_SMARTCHEF_API_URL;

function HomePage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearch = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    if (!query.trim()) {
      setError("Please enter a search term.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/recipes?query=${query}`);
      setRecipes(response.data.recipes);
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("full-width");
    return () => {
      document.body.classList.remove("full-width");
    };
  }, []);

  return (
    <div className={styles["home-page"]}>
      <div className={styles.left}>
        <h1>SmartChef</h1>
        <p className={styles.description}>
          Find the best recipes for your favorite dishes. Simply enter a recipe
          name, and we'll help you discover mouth-watering ideas with detailed
          instructions and video guides.
        </p>
        <SearchForm
          query={query}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
        />
      </div>
      <div className={styles.right}>
        {error && <p className={styles.error}>{error}</p>}
        <RecipeList recipes={recipes} loading={loading} />
      </div>
    </div>
  );
}

export default HomePage;
