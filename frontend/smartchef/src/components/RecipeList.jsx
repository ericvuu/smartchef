import React from "react";
import RecipeCard from "./RecipeCard";

function RecipeList({ recipes, loading }) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="recipe-list">
      {recipes.length > 0 ? (
        recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}

export default RecipeList;
