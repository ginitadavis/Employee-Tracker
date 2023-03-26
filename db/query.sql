
SELECT role.title AS Title, role.id AS ID, department.name AS Department, role.salary AS Salary
FROM role
JOIN department ON department.id = role.department_id;

