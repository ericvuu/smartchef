from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
from config import SPOONACULAR_API_KEY, YOUTUBE_API_KEY

SPOONACULAR_URL_RECIPES = "https://api.spoonacular.com/recipes/complexSearch"
SPOONACULAR_URL_RECIPE_DETAILS = "https://api.spoonacular.com/recipes/"
YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search"

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class YouTubeVideo(BaseModel):
    embed_html: str
    thumbnail_url: str
    title: str
    description: str

@app.get("/")
async def root():
    return {"message": "Welcome to the SmartChef API. Use /recipes to search recipes and /videos to find related YouTube videos."}

@app.get("/recipes")
async def get_recipes_with_details(query: str, page: int = 1, limit: int = 25):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter 'query' is required.")

    if page < 1 or limit < 1:
        raise HTTPException(status_code=400, detail="Page and limit must be positive integers.")

    recipes = fetch_recipes(query, page, limit)

    return {"recipes": recipes}

@app.get("/recipe/{recipe_id}")
async def get_recipe_with_details(recipe_id: int):
    recipe = fetch_recipe_details(recipe_id)
    return {"recipe": recipe}

@app.get("/videos", response_model=List[YouTubeVideo])
async def get_videos(query: str):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter 'query' is required.")

    videos_raw = fetch_youtube_videos(query)
    return [
        YouTubeVideo(
            embed_html=f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video["id"]["videoId"]}" frameborder="0" allowfullscreen></iframe>',
            thumbnail_url=video["snippet"]["thumbnails"]["high"]["url"],
            title=video["snippet"]["title"],
            description=video["snippet"]["description"]
        )
        for video in videos_raw if "videoId" in video["id"]
    ]

def fetch_recipes(query: str, page: int, limit: int):
    """Fetch recipes with pagination."""
    params = {
        "query": query,
        "number": limit,
        "apiKey": SPOONACULAR_API_KEY,
        "offset": (page - 1) * limit
    }
    response = requests.get(SPOONACULAR_URL_RECIPES, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching recipes from Spoonacular.")
    return response.json().get("results", [])

def fetch_recipe_details(recipe_id: int):
    """Fetch detailed information for a specific recipe by its ID."""
    params = {
        "apiKey": SPOONACULAR_API_KEY
    }

    # Fetch recipe details (general info)
    response = requests.get(f"{SPOONACULAR_URL_RECIPE_DETAILS}/{recipe_id}/information", params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Error fetching details for recipe {recipe_id}.")

    recipe_data = response.json()

    # Fetch analyzed instructions if available
    instructions_response = requests.get(f"{SPOONACULAR_URL_RECIPE_DETAILS}/{recipe_id}/analyzedInstructions", params=params)

    if instructions_response.status_code == 404:
        # Handle the case where the instructions are not found
        recipe_data['instructions'] = "No analyzed instructions available for this recipe."
    elif instructions_response.status_code == 200:
        instructions_data = instructions_response.json()
        if instructions_data:
            recipe_data['instructions'] = instructions_data
        else:
            recipe_data['instructions'] = "Instructions found, but no steps available."
    else:
        # Handle other errors
        recipe_data['instructions'] = "Error fetching analyzed instructions."

    return recipe_data

def fetch_youtube_videos(query: str):
    """Fetch YouTube videos related to the recipe query."""
    params = {
        "part": "snippet",
        "q": f"{query} recipe",
        "maxResults": 5,
        "key": YOUTUBE_API_KEY
    }
    response = requests.get(YOUTUBE_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching YouTube videos.")
    return response.json().get("items", [])
