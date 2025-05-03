import React from "react";
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  if (!recipe) return null;

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-card-link">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card-image"
        />
        <h3>{recipe.title}</h3>
      </Link>

      <p>{recipe.description || "No description available."}</p>

      <ul>
        {recipe.ingredients &&
          recipe.ingredients
            .slice(0, 3)
            .map((ingredient, index) => <li key={index}>{ingredient}</li>)}
      </ul>
    </div>
  );
}

export default RecipeCard;
