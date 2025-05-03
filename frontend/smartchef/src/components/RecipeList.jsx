import React from "react";
import RecipeCard from "./RecipeCard";
import styles from "../styles/RecipeList.module.css";

function RecipeList({ recipes, loading }) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles["recipe-list"]}>
      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={index} />
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}

export default RecipeList;
