CREATE DATABASE IF NOT EXISTS faqs;

USE faqs;

CREATE TABLE faq (id INT not null AUTO_INCREMENT PRIMARY KEY, 
question VARCHAR(255) not null,
answer VARCHAR(256) not null,
date_added TIMESTAMP default CURRENT_TIMESTAMP,
last_updated TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );

INSERT INTO faq(question,answer)
VALUES ('What is the answer to life, the universe, and everything?', '42'),('What is 6 multiplied by 7?', '42'),('What is the ASCII code for the * character?','42'),('What is 50 minus 8?', '42');


CREATE TABLE User(id INT not null AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(50),
lastname VARCHAR(50),
age INT,
savertype VARCHAR(50));

insert into User(firstname, lastname, age, savertype) Values('test', 'user', 18, 'dummy');