import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import styles from "../styles/RecipeCard.module.css";
import NotFound from "/images/food-not-found.png";

function RecipeCard({ recipe, index }) {
  if (!recipe) return null;

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError || !recipe.image ? NotFound : recipe.image;


  const tiltStyle = {
    transform: Math.floor(index / 2) % 2 === 0 ? "rotate(-1.2deg)" : "rotate(1.2deg)",
  };

  return (
    <div className={styles["recipe-card"]} style={tiltStyle}>
      <Link to={`/recipe/${recipe.id}`} className={styles["recipe-card-link"]}>
        <img
          src={imageSrc}
          alt={recipe.title}
          className={styles["recipe-card-image"]}
          onError={handleImageError}
        />
        <div className={styles["recipe-card-content"]}>
          <h3 className={styles["recipe-title"]}>
            <FaUtensils className={styles["recipe-icon"]} /> {recipe.title}
          </h3>
        </div>
      </Link>

      {recipe.description && <p>{recipe.description}</p>}

      <ul>
        {recipe.ingredients?.slice(0, 3).map((ingredient, index) => (
          <li key={ingredient.id || index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeCard;
