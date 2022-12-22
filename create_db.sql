CREATE DATABASE myFoodStorage;
USE myFoodStorage;
CREATE TABLE foods (id INT AUTO_INCREMENT,name VARCHAR(50), value DECIMAL(5, 2) unsigned, valueUnit VARCHAR(10), carbs DECIMAL(5,2), fat DECIMAL(5,2), protein DECIMAL(5,2), salt DECIMAL(5,2), sugar DECIMAL(5,2),PRIMARY KEY(id));
INSERT INTO foods (name, value, valueUnit, carbs, fat, protein, salt, sugar)VALUES('flour', 100, gram, 81, 1.4, 9.1, 0.01, 0.06);
CREATE user 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myFoodStorage.* TO 'appuser'@'localhost';

CREATE TABLE user (id INT AUTO_INCREMENT, firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, appuser VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(50) UNIQUE NOT NULL, hashedPassword VARCHAR(550) NOT NULL, PRIMARY KEY (id));
SELECT * FROM user;
DROP TABLE user;