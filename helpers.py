import os
import requests
from functools import wraps
from flask import redirect, render_template, session
from dotenv import load_dotenv

load_dotenv()
SPOONACULAR_KEY = os.getenv("SPOONACULAR_KEY")

def apology(message, code=400):
    """Render message as an apology to user."""
    return render_template("apology.html", top=code, bottom=message), code

def login_required(f):
    """Decorate routes to require login. (from CS50)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

def lookup_ingredients(ingredients_str, diet=None, intolerances=None, meal_type=None, max_ready_time=None):
    """Search Spoonacular for recipes matching the current ingredient chips."""
    if not SPOONACULAR_KEY or SPOONACULAR_KEY == "your_api_key_here":
        raise Exception("SPOONACULAR_KEY is not set properly with a real key.")
        
    try:
        url = "https://api.spoonacular.com/recipes/complexSearch"
        # complexSearch lets the app combine pantry-style ingredient matching
        # with dietary preferences while still returning enough metadata for
        # sorting cards in the browser.
        params = {
            "apiKey": SPOONACULAR_KEY,
            "includeIngredients": ingredients_str,
            "number": 100, # Get a large pool to client-side filter by exact missed ingredients
            "fillIngredients": "true",
            "addRecipeInformation": "true",
            "sort": "max-used-ingredients"
        }
        if diet: params["diet"] = diet
        if intolerances: params["intolerances"] = intolerances
        if meal_type: params["type"] = meal_type
        if max_ready_time: params["maxReadyTime"] = max_ready_time
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        
        return response.json().get("results", [])
    except requests.RequestException as e:
        print("API Error:", e)
        return None

def get_recipe_information(recipe_id):
    """Fetch full recipe details, including nutrition when available."""
    if not SPOONACULAR_KEY or SPOONACULAR_KEY == "your_api_key_here":
        raise Exception("SPOONACULAR_KEY is not set properly with a real key.")
        
    try:
        url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
        params = {
            "apiKey": SPOONACULAR_KEY,
            "includeNutrition": "true"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print("API Error:", e)
        return None
