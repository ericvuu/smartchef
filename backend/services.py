from fastapi import APIRouter
from models import FridgeItems
import requests

router = APIRouter()

def fetch_recipes(ingredients):
    api_key = "YOUR_SPOONACULAR_API_KEY"
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={','.join(ingredients)}&apiKey={api_key}"
    response = requests.get(url)
    return response.json()

def fetch_youtube_videos(recipe_name):
    youtube_api_key = "YOUR_YOUTUBE_API_KEY"
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={recipe_name}+recipe&key={youtube_api_key}"
    response = requests.get(url)
    return response.json()

@router.post("/recipes")
def get_recipes(data: FridgeItems):
    recipes = fetch_recipes(data.items)
    youtube_videos = [fetch_youtube_videos(recipe['title']) for recipe in recipes]
    return {"recipes": recipes, "videos": youtube_videos}
