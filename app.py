import os
from cs50 import SQL
from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup_ingredients, get_recipe_information

# AI assistance disclosure: OpenAI Codex helped refine the UI and README text;
# final project behavior and submission choices remain my own.

# Configure application.
app = Flask(__name__)

# Store sessions on the filesystem so login state survives normal page loads
# without placing the whole session payload inside the browser cookie.
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database.
db = SQL("sqlite:///app.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
@login_required
def index():
    """Show ingredient search UI."""
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    session.clear()
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username:
            return apology("must provide username", 403)
        elif not password:
            return apology("must provide password", 403)
            
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            return apology("invalid username and/or password", 403)
            
        session["user_id"] = rows[0]["id"]
        return redirect("/")
        
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out"""
    session.clear()
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        
        if not username:
            return apology("must provide username", 400)
        elif not password:
            return apology("must provide password", 400)
        elif password != confirmation:
            return apology("passwords must match", 400)
            
        hash_pw = generate_password_hash(password)
        try:
            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, hash_pw)
        except ValueError:
            return apology("username already taken", 400)
            
        # Log the new user in automatically after successful registration.
        rows = db.execute("SELECT id FROM users WHERE username = ?", username)
        session["user_id"] = rows[0]["id"]
        return redirect("/")
    else:
        return render_template("register.html")
        
@app.route("/api/search", methods=["POST"])
@login_required
def api_search():
    """Search recipes with user-selected filters and return JSON to the UI."""
    data = request.get_json()
    if not data or not data.get("ingredients"):
        return jsonify({"error": "No ingredients provided"}), 400
        
    # The browser stores ingredients as an array of chips. Spoonacular expects
    # the same data as a comma-separated string.
    ingredients_str = ",".join(data["ingredients"])
    
    try:
        results = lookup_ingredients(
            ingredients_str,
            diet=data.get("diet"),
            intolerances=data.get("intolerances"),
            meal_type=data.get("type"),
            max_ready_time=data.get("maxReadyTime")
        )
        if results is None:
            return jsonify({"error": "Failed to fetch from Spoonacular"}), 502
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/recipe/<int:recipe_id>")
@login_required
def recipe_detail(recipe_id):
    """Show a native, detailed recipe page for a saved or searched recipe."""
    recipe = get_recipe_information(recipe_id)
    if not recipe:
        return apology("Recipe not found or API error", 404)
        
    return render_template("recipe_detail.html", recipe=recipe)

@app.route("/api/favourite", methods=["POST"])
@login_required
def add_favourite():
    """Persist one recipe card to the current user's favourites list."""
    data = request.get_json()
    if not data or not data.get("recipe_id"):
        return jsonify({"error": "Invalid data"}), 400
        
    recipe_id = data["recipe_id"]
    title = data.get("title", "")
    image = data.get("image", "")
    
    # Prevent duplicate favourites for the same user and recipe.
    rows = db.execute("SELECT * FROM favourites WHERE user_id = ? AND recipe_id = ?", session["user_id"], recipe_id)
    if len(rows) > 0:
        return jsonify({"success": False, "message": "Already favorited"}), 200
        
    db.execute("INSERT INTO favourites (user_id, recipe_id, title, image) VALUES (?, ?, ?, ?)",
               session["user_id"], recipe_id, title, image)
    return jsonify({"success": True, "message": "Added to favourites"}), 200

@app.route("/favourites")
@login_required
def favourites():
    """Display all recipes saved by the current user."""
    recipes = db.execute("SELECT * FROM favourites WHERE user_id = ?", session["user_id"])
    return render_template("favourites.html", recipes=recipes)
