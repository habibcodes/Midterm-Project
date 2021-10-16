DROP TABLE IF EXISTS ordered_items_carts CASCADE;

CREATE ordered_items_carts (
  id SERIAL PRIMARY KEY NOT NULL,
  food_item_id INTEGER REFERENCES food_items(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  process_order BOOLEAN NOT NULL
);
