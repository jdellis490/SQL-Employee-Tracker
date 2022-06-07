DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL,
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL,
    PRIMARY KEY (id)
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    manager_id INT 
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);