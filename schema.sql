DROP DATABASE IF EXISTS bamazon_DB;
create database bamazon_DB;
use bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL (10,4) NOT NULL,
  stock_quantity INT (10) NOT NULL,
  PRIMARY KEY (item_id) 
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("mountain bike", "outdoor", 500.00, 50),
("climbing gear", "outdoor", 150.00, 50),
("canteen", "outdoor", 50.00, 50),
("bananas", "grocery", 1.00, 50),
("coffee", "grocery", 10.00, 50),
("power bar", "grocery", 2.50, 50),
("telescope", "astronomy", 200.00, 50),
("star chart", "astronomy", 15.00, 50),
("camp stove", "outdoor", 125.00, 50),
("hiking boots", "outdoor", 200.00, 50);

SELECT * FROM bamazon.products;