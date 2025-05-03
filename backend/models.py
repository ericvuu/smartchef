from pydantic import BaseModel
from typing import List

class FridgeItems(BaseModel):
    items: List[str]
