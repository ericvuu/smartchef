import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import RecipeList from "../components/RecipeList";
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


  return (
    <div className="home-page">
      <h1>SmartChef</h1>
      <SearchForm
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />
      {error && <p className="error">{error}</p>}
      <RecipeList recipes={recipes} loading={loading} />
    </div>
  );
}

export default HomePage;
