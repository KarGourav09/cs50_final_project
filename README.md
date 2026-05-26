# FreshlyFridge

#### Video Demo: TODO – Replace with your demo video URL

## Description

FreshlyFridge is an interactive Flask web application designed to help users discover recipes based on the ingredients they already have at home. Instead of searching for recipes first and then shopping for ingredients, FreshlyFridge reverses the process, reducing food waste and promoting cooking creativity.

The app is built with Python, Flask, SQLite, Jinja templates, JavaScript, HTML, and CSS. It harnesses the Spoonacular API to fetch real recipes, with detailed ingredient and preparation steps.

## Features

- **User Authentication:** Register and log in to save your favorite recipes.
- **Smart Recipe Search:** Enter the ingredients you have, and FreshlyFridge suggests matching recipes.
- **Personalized Favorites:** Save and manage your favorite recipes for later reference.
- **Responsive Design:** Works well on both desktop and mobile devices for flexibility in your kitchen.
- **Modern UI:** Enjoy a visually appealing interface with fresh colors and intuitive navigation.

## Project Structure

- `app.py` – Main application logic: configures Flask, handles routes, authentication, user sessions, the core search logic, and integration with the Spoonacular API.
- `helpers.py` – Contains helper functions: `login_required`, the `apology` error handler, and utility APIs.
- `schema.sql` – Database schema with tables for users and favorites.
- `templates/` – Jinja2 HTML templates for different pages. `layout.html` provides the main structure.
- `static/styles.css` – Stylesheet creating a modern food-themed design.
- `static/script.js` – Manages client-side interactivity, including ingredient management and AJAX search.

## Setup and Usage

1. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2. **Get Spoonacular API Key:**
    - Sign up at [Spoonacular](https://spoonacular.com/food-api) to get your free API key.

3. **Configure Environment:**
    - Create a `.env` file with your API key:
      ```
      SPOONACULAR_KEY=your_api_key_here
      ```

4. **Initialize the Database:**
    ```bash
    sqlite3 fridge.db < schema.sql
    ```

5. **Run the Application:**
    ```bash
    flask --app app run
    ```

6. **Open in Browser:**
    - Visit `http://127.0.0.1:5000/` to use FreshlyFridge locally.

## Demo Video

Before submitting, update the `TODO` in the "Video Demo" section above with your video link. The demo should show:
- Registering or logging in
- Adding/removing ingredients
- Finding and viewing recipes
- Saving favorites
- Logging out

## Submission Details

- `.env`, your local database, Python virtual environment folders, cache files, and Flask session files are excluded from submission for security and cleanliness.
- Only source code and required project files should be in the submission.

## Acknowledgments

- Recipe data powered by the [Spoonacular API](https://spoonacular.com/food-api).
- Project for Harvard CS50: Introduction to Computer Science.

---

**Good luck with your submission!**
