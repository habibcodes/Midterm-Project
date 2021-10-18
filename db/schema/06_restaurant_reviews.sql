DROP TABLE IF EXISTS restaurant_reviews CASCADE;

CREATE TABLE restaurant_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  review VARCHAR(255) NOT NULL
);
