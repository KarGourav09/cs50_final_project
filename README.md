# FreshlyFridge

#### Video Demo: TODO – Replace with your demo video URL

## Description

FreshlyFridge is a web application designed to solve a common problem: “What can I cook with the ingredients I already have?” Many people struggle to efficiently use the items in their fridge and pantry, leading to wasted food, unexpected shopping runs, or simply a lack of culinary inspiration. FreshlyFridge lets users enter the food they have, apply personal dietary filters, and quickly discover recipes that make the most of those ingredients.

This project was created for CS50’s final project to demonstrate proficiency in full-stack web development, user authentication, database management, API integration, and the creation of a smooth, modern user interface. It was built from the ground up using **Python** and **Flask** for the backend, with a responsive frontend utilizing **HTML**, **CSS** (in a modern, variable-driven style), and **JavaScript** for interactivity. SQLite is used as the backend database, while Jinja2 templates and client-side scripting create a seamless user experience.

### Core Functionality and Workflow

After registering or logging in, users are presented with a clean homepage where they can begin entering ingredients. The UI is intuitive: users type ingredients into an input box, press enter, and see their choices appear as "chips" for easy management. Clickable "quick ingredient" buttons offer fast entry of common foods. Users can remove any ingredient chip with a single click, making it easy to adjust the list as needed.

Beyond basic ingredient search, users can leverage “Advanced Filters” to personalize their results according to dietary needs or preferences. Supported filters include diet type (vegetarian, vegan, gluten-free, ketogenic), allergies and intolerances, meal type (main, snack, breakfast, dessert), time constraints (maximum ready time), and the number of missing ingredients allowed. These features ensure that the recipe results match both what’s available and the user's preferences and limitations.

When the user clicks the "Find Recipes" button, an AJAX request sends all ingredients and chosen filters to the Flask backend. The app checks the user’s authentication status, assembles a request for the Spoonacular API—one of the most comprehensive recipe APIs available—and retrieves up to 100 recipes that match the supplied criteria. Only recipes that genuinely use the entered ingredients are given priority.

Recipes are displayed in a visually appealing grid on the frontend, each card showcasing an image, the recipe’s title, estimated preparation time, serving size, health score, and a prominent badge that displays either "Ready from your fridge" or the number of missing ingredients. Clicking on a card's "View Recipe" button opens a dedicated recipe page with in-depth information. This includes extended ingredients, step-by-step instructions (where available), nutrition facts, and convenient links to the original recipe source.

A major feature is the ability to save favorite recipes. By clicking the “Save” button, a recipe is stored in the user’s personalized “Favourites” section, available via the navbar. Favorites are persisted in the database and tied to individual user accounts, allowing returning users to easily revisit saved meals without having to search again.

### Technical and Design Highlights

FreshlyFridge uses **Flask-Session** for secure user session management and implements all authentication workflows (registration, login, logout) with hashed passwords using Werkzeug utilities, in keeping with best security practices. The app employs **server-side sessions** so login state persists reliably and isn’t exposed to the browser.

All SQL database interactions are managed with the CS50 SQL library, simplifying queries and increasing code safety. The structure is straightforward: there are tables for users (with hashed passwords) and for saving recipe favorites by user ID and recipe ID.

The user interface prioritizes accessibility, modern design, and cross-device compatibility. CSS variables create a friendly color palette, and the responsive grid system means the app works elegantly on desktops, tablets, and mobile phones. Every interaction, from adding/removing chips to saving favorites, is smooth and provides immediate feedback.

API keys are never hardcoded or exposed; instead, they are loaded securely via environment variables (.env files), and sensitive files like the database and credentials are excluded from the repository with a robust `.gitignore`.

Robust error handling and apology messages provide clear guidance if issues arise, such as invalid login attempts, failed API requests, or empty search submissions. This attention to user experience ensures the app is both forgiving and instructive.

The codebase is modular and maintainable:  
- **`app.py`** delivers main routing, core logic, and API integration.  
- **`helpers.py`** provides modular utilities and error handlers (including the CS50-inspired apology page).  
- **`static/script.js`** powers all client-side interactivity, filter logic, and dynamic UI updates.  
- **`templates/`** houses reusable, well-organized Jinja2 HTML for all site pages.

### Development Experience

FreshlyFridge was an exercise in tying together all the core components of CS50: database management, backend development, frontend design, security, and API consumption. The project offered hands-on experience with complex topics like asynchronous JavaScript, RESTful API requests, secure user authentication, and responsive web design.

Throughout the development process, care was taken to produce clear, well-commented code and a welcoming, easy-to-navigate user experience. The project demonstrates original design, practical utility, and a professional level of polish.

### Conclusion

FreshlyFridge stands out as a practical, original solution to food waste and meal planning challenges. It leverages modern web technologies, clean design, third-party APIs, and secure practices, all brought together into a cohesive and delightful user experience.  
Whether you’re stuck with random ingredients or want healthier, more efficient meal planning, FreshlyFridge is your companion in the kitchen—making the most of what you already have.

## Features

- **User Authentication:** Register, log in, log out securely.
- **Smart Recipe Search:** Discover recipes sorted by what’s in your fridge.
- **Advanced Filters:** Personalize results by diet, allergies, meal type, prep time, and more.
- **Favorites:** Save and revisit recipes you love.
- **Modern, Responsive UI:** Beautiful, mobile-friendly user interface.
- **Real Recipe Data:** Recipes powered by the Spoonacular API.
- **Robust Error Handling:** Friendly apology pages and validation messages.
- **Secure by Design:** Password hashing, server-side sessions, and environment-based secrets.

## Project Structure

- `app.py` – Main application logic, Flask routes, authentication, search.
- `helpers.py` – Utility functions and error handlers.
- `schema.sql` – Database schema (users, favorites).
- `templates/` – HTML templates (Jinja2).
- `static/styles.css` – CSS styles.
- `static/script.js` – JavaScript for dynamic interface & AJAX.

## Setup and Usage

1. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
2. **Get Spoonacular API Key:**
    - Sign up at [Spoonacular](https://spoonacular.com/food-api) to get your API key.
3. **Configure Environment:**
    - Create a `.env` file with your key:
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
    - Visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to use FreshlyFridge locally.

## Demo Video

Before submitting, update the `TODO` in the "Video Demo" section above with your video link. The demo should clearly and efficiently show:
- Registering/logging in
- Adding/removing ingredients
- Setting filters
- Finding and viewing recipes
- Saving/reviewing favorites
- Logging out

## Submission Details

- `.env`, database files, Python virtual environment, cache, and Flask session files are **excluded** from submission (see `.gitignore`).
- Only code and required project files are committed.

## Acknowledgments

- Recipe data powered by the [Spoonacular API](https://spoonacular.com/food-api).
- Project for Harvard CS50: Introduction to Computer Science.
