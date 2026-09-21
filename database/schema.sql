CREATE TABLE recipes (
  id VARCHAR(80) PRIMARY KEY,
  meal VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  grams INTEGER NOT NULL CHECK (grams >= 0),
  protein NUMERIC(7,2) NOT NULL DEFAULT 0,
  carbs NUMERIC(7,2) NOT NULL DEFAULT 0,
  cook_minutes INTEGER NOT NULL CHECK (cook_minutes > 0),
  suitable_for VARCHAR(240) NOT NULL,
  image_url TEXT,
  tags JSON NOT NULL
);

CREATE TABLE recipe_ingredients (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id VARCHAR(80) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  ingredient_name VARCHAR(120) NOT NULL,
  amount VARCHAR(80) NOT NULL,
  UNIQUE (recipe_id, position)
);

CREATE TABLE recipe_steps (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id VARCHAR(80) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  UNIQUE (recipe_id, position)
);

CREATE TABLE recipe_links (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id VARCHAR(80) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  platform VARCHAR(30) NOT NULL CHECK (platform IN ('bilibili', 'douyin', 'xiaohongshu')),
  search_url TEXT NOT NULL,
  UNIQUE (recipe_id, platform)
);

CREATE INDEX recipe_meal_index ON recipes(meal);
CREATE INDEX recipe_ingredient_recipe_index ON recipe_ingredients(recipe_id);
CREATE INDEX recipe_step_recipe_index ON recipe_steps(recipe_id);
