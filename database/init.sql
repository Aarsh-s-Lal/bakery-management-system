-- Create tables
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, stock) VALUES
('Chocolate Croissant', 'Buttery croissant with chocolate filling', 3.50, 50),
('French Baguette', 'Traditional French bread', 2.50, 30),
('Blueberry Muffin', 'Moist muffin filled with fresh blueberries', 2.75, 45),
('Sourdough Bread', 'Artisanal sourdough bread loaf', 4.50, 25),
('Cinnamon Roll', 'Sweet pastry with cinnamon and icing', 3.25, 40),
('Blueberry Cheesecake', 'Sweet blueberry pastry with cheese base', 6.25, 20), 
('Chocolate Milkshake', 'Sweet oreo shake with kitkat dressing ', 2.4, 25) , 
('LotusBiscoff Cheesecake', 'Sweet biscuit pastry with cheese base', 6.25, 20) ; 
