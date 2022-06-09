INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 65000.00, 1),
       ("Salesperson", 50000.00, 1),
       ("Lead Engineer", 165000.00, 2),
       ("Engineer", 95000.00, 2),
       ("Account Manager", 65000.00, 3),
       ("Accountant", 55000.00, 3),
       ("Legal Team Lead", 145000.00, 4),
       ("Lawyer", 120000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Naruto", "Uzumaki", 1, 1),
       ("Sasuke", "Uchiha", 2, 2),
       ("Rock", "Lee", 4, 3),
       ("Neji", "Hyuga", 3, 4),
       ("Shikamaru", "Nara", 5, 5),
       ("Minato", "Namikaze", 6, 6),
       ("Kakashi", "Hatake", 8, 7),
       ("Tobirama", "Senju", 7, 8);
       