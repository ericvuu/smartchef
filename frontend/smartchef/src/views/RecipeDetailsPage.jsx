import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTubeVideos from "../components/YouTubeVideos";

const apiUrl = import.meta.env.VITE_SMARTCHEF_API_URL;

function RecipeDetailsPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) {
        setError("No recipe ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/recipe/${id}`);
        setRecipe(response.data.recipe);
      } catch (error) {
        setError("An error occurred while fetching the recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>No recipe data found.</p>;

  const renderIngredients = () =>
    recipe.extendedIngredients?.map((ingredient, index) => (
      <li key={index}>
        {ingredient.amount} {ingredient.unit} {ingredient.name}
      </li>
    ));

  const renderWinePairing = () => {
    if (recipe.winePairing?.productMatches?.length) {
      const product = recipe.winePairing.productMatches[0];
      return (
        <div>
          <h3>Wine Pairing</h3>
          <p>{recipe.winePairing.pairingText}</p>
          <h4>{product.title}</h4>
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ width: "100px" }}
          />
          <p>{product.description}</p>
          <p>{product.price}</p>
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            Buy it here
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="recipe-details-page">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} />
      <h3>Ingredients</h3>
      <ul>{renderIngredients()}</ul>
      <h3>Instructions</h3>
      <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      {renderWinePairing()}
      <YouTubeVideos recipeTitle={recipe.title} />
    </div>
  );
}

export default RecipeDetailsPage;
