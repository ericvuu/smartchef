from pydantic import BaseModel
from typing import List

class FridgeItems(BaseModel):
    items: List[str]

class YouTubeVideo(BaseModel):
    embed_html: str
    thumbnail_url: str
    title: str
    description: str
