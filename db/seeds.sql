
INSERT INTO department (name)
VALUES ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 120000, 4),
        ("Salesperson", 80000, 4),
        ("Lead Engineer",180000, 1),
        ("Software Engineer",120000, 1),
        ("Accountant",150000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gina", "Davis", 4, 1),
        ("Bryan", "Davis", 5, 2),
        ("Diego", "Vera", 3, 1),
        ("Oscar", "Vera", 4, 4);