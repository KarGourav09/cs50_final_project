# FreshlyFridge
#### Video Demo: TODO
#### Description:

FreshlyFridge is a Flask web application that helps users discover recipes based on the ingredients they already have at home. The idea behind the project is simple: instead of starting with a recipe and then buying every missing ingredient, users can begin with what is already in their fridge and receive recipe suggestions that make practical use of those ingredients. The application combines user accounts, a SQLite database, dynamic recipe searching, saved favourites, and a polished food-focused interface.

The app is built with Python, Flask, SQLite, Jinja templates, JavaScript, HTML, and CSS. It uses the Spoonacular API to search for recipes and to fetch detailed recipe information. Users can register for an account, log in, add ingredients as chips, use quick ingredient suggestions, choose optional filters such as diet, intolerances, meal type, maximum missing ingredients, and maximum ready time, and then search for recipe matches. Results can be ranked by best match, fewest missing ingredients, fastest recipes, health score, or highest API score. Results are displayed as visual recipe cards, and users can save recipes to their favourites list for later.

The main application logic is in `app.py`. This file configures Flask, sessions, SQLite, and the app routes. It contains the authentication routes for registering, logging in, and logging out, the protected home page route, the JSON recipe-search endpoint at `/api/search`, the recipe detail route at `/recipe/<recipe_id>`, the favourite-saving endpoint at `/api/favourite`, and the favourites page route at `/favourites`. I kept the backend routes relatively small so that each route has a clear responsibility.

The helper functions are in `helpers.py`. This file contains the `login_required` decorator, the `apology` helper for displaying errors, and the API helper functions that communicate with Spoonacular. `lookup_ingredients` sends ingredient and filter data to Spoonacular's recipe search API, while `get_recipe_information` fetches detailed information for a single recipe. Keeping these helpers separate from `app.py` makes the route code easier to read and avoids mixing API-request details with page-rendering logic.

The database schema is defined in `schema.sql`. The project uses a `users` table for registered accounts and a `favourites` table for recipes saved by each user. The actual local database file is `app.db`, but it is intentionally ignored in `.gitignore` because it contains local runtime data. The schema file is the important submitted source file because it explains how the database should be created.

The page templates are in the `templates` folder. `layout.html` defines the shared page structure, including the navigation bar and the FreshlyFridge brand. `index.html` contains the main ingredient-search experience. `login.html` and `register.html` provide the account pages. `favourites.html` displays the recipes saved by the logged-in user. `recipe_detail.html` shows detailed recipe information, including preparation time, servings, ingredients, summary, and instructions. `apology.html` displays user-friendly error messages.

The visual design and responsive layout are handled in `static/styles.css`. I redesigned the application around a fresh food-site style: large typography, soft green accents, pale yellow cards, circular recipe images, pill-shaped controls, and a spacious landing-page layout. The same design system is reused across the home page, recipe results, favourites page, authentication pages, recipe detail page, and error page. I chose this approach so the project feels like one complete product rather than separate pages stitched together.

The client-side behavior is in `static/script.js`. It handles the ingredient chip input, quick ingredient buttons, removes chips when requested, sends search requests to `/api/search`, renders recipe cards dynamically, applies client-side filters, ranks results, updates result counts, and saves favourites by posting to `/api/favourite`. I used JavaScript for these parts because the search experience should feel immediate and interactive without requiring a full page refresh for every recipe result.

One design choice I considered carefully was whether to make recipe searching a traditional form submission or a JavaScript-powered interaction. I chose the JavaScript approach because ingredient chips, loading states, dynamic cards, ranking controls, and favourite buttons are more natural when handled on the client side. Another design decision was to keep saved favourites in the local SQLite database while fetching full recipe details from the API when needed. This keeps the favourites table small while still allowing each saved recipe to open into a full detail page with nutrition highlights, recipe tags, source links, estimated cost, health score, ingredients, and instructions.

To run the project locally, install the dependencies in `requirements.txt`, create a `.env` file containing a valid `SPOONACULAR_KEY`, initialize the SQLite database using `schema.sql`, and run the Flask app. For example:

```bash
pip install -r requirements.txt
flask --app app run
```

The `.env`, virtual environment, database file, Python cache folders, and Flask session files are ignored because they are local runtime files rather than source code. The submitted project should include the Python files, templates, static assets, schema, requirements file, README, and any documentation files.

Before submitting, replace `TODO` in the `Video Demo` line with the URL of the recorded demo video. The demo should show the app running, including registration or login, adding ingredients, searching for recipes, saving a favourite, viewing favourites, and opening a recipe detail page.
