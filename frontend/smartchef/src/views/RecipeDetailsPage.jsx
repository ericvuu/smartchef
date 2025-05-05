import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTubeVideos from "../components/YouTubeVideos";
import styles from "../styles/RecipeDetailsPage.module.css";

const apiUrl = import.meta.env.VITE_SMARTCHEF_API_URL;

function RecipeDetailsPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/recipe/${id}`);
        console.log(response.data.recipe);
        setRecipe(response.data.recipe);
      } catch (err) {
        setError("Error fetching recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>No recipe data found.</p>;

  const renderWinePairing = () => {
    if (recipe.winePairing?.productMatches?.length) {
      const product = recipe.winePairing.productMatches[0];
      return (
        <div className={styles["wine-pairing"]}>
          <h3>Wine Pairing</h3>
          <p>{recipe.winePairing.pairingText}</p>
          <h4>{product.title}</h4>
          <img
            src={product.imageUrl}
            alt={product.title}
            className={styles["wine-image"]}
          />
          <p>{product.description}</p>
          <p>{product.price}</p>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["wine-link"]}
          >
            Buy it here
          </a>
        </div>
      );
    }
    return null;
  };

  const renderSteps = () => {
    const analyzedSteps = recipe.analyzedInstructions?.[0]?.steps;
    const instructions = recipe.instructions;

    if (analyzedSteps && analyzedSteps.length > 0) {
      return (
        <ol className="list-decimal pl-5 space-y-2">
          {analyzedSteps.map(({ number, step }) => (
            <li key={number}>{step}</li>
          ))}
        </ol>
      );
    } else if (typeof instructions === "string" && instructions.trim() !== "") {
      return (
        <div className="space-y-2">
          {instructions.split(". ").map((sentence, idx) => (
            <p key={idx}>{sentence.trim()}.</p>
          ))}
        </div>
      );
    } else {
      return <p>No instructions available for this recipe.</p>;
    }
  };

  return (
    <div className={styles["recipe-details-page"]}>
      <h2 className={styles["title"]}>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className={styles["image"]} />
      {renderWinePairing()}
      {renderSteps()}
      <YouTubeVideos recipeTitle={recipe.title} />
    </div>
  );
}

export default RecipeDetailsPage;
