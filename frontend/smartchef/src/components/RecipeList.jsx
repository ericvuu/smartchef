import React from "react";
import RecipeCard from "./RecipeCard";
import styles from "../styles/RecipeList.module.css";

function RecipeList({ recipes, loading, query }) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles["recipe-list"]}>
      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={index} />
        ))
      ) : query ? (
        <p>No results found. Try searching with different ingredients.</p>
      ) : (
        <p className={styles["get-started"]}>
          What's in your fridge?
        </p>
      )}
    </div>
  );
}

export default RecipeList;
