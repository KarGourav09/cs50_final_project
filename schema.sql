CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL
);

CREATE TABLE favourites (
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    image TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
