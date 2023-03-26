const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { async } = require('radar-sdk-js');
require('dotenv').config();


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the movies_db database.`)
  );

console.log(`
             ---------------------------
            |                           |
            |     Employee Manager      |
            |                           |
             ---------------------------
             `);

async function mainScreen(){
    let actionType = await inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'actionType',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]);

    performAccion(actionType.actionType);

}

async function performAccion(action) {
    switch (action){
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
    }
}
async function viewDepartments(){
    let sql = 'SELECT * FROM department';
    db.query(sql, function(err, result) {
        console.log(err);
        console.table(result);
    })


}

async function viewEmployees(){
    console.log("View Employee");
}

async function viewRoles(){
    let sql = `SELECT role.title AS Title, role.id AS ID, department.name AS Department, role.salary AS Salary
    FROM role
    JOIN department ON department.id = role.department_id;`
    db.query(sql, function(err, result) {
        console.log(err);
        console.table(result);
    })
}

async function addDepartment(){
    console.log("Add Department");
}

async function addRole(){
    let dept;
    // make a query to get all departs
    db.query('SELECT * FROM department', (err, result) => dept = result);

    //Request user the role title and salary
    let newRole = await inquirer
    .prompt([
        {
            type: 'input',
            message: `Please enter the role's title`,
            name: 'name'
        },
        {
            type: 'input',
            message: `Please enter the salary`,
            name: 'salary'
        }
    ]);

    //Change the 'id' inside the department query for 'value' - The value will get the id for the department stored in a variable
    const departments = dept.map(function(dept2) {
        return {
            value: dept2.id,
            name: dept2.name,
        }
    });
    
    //Ask to choose the department title and store the department value (id)
    await inquirer
    .prompt([
        {
            message: 'Select the department for the role',
            type: 'list',
            name: 'answer',
            choices: departments
        }
    ]).then(function(ans) {
        //Insert values into role table
        let sql = `INSERT INTO role (title, salary, department_id) VALUES ('${newRole.name}', ${newRole.salary}, ${ans.answer})`
        db.query(sql, (err, result) => (err) ? console.log(err) : console.log('success')
        );
    })
}

async function addEmployee(){
    console.log("Add Employee");
}

async function updateEmployeeRole(){
    console.log("Update Employee Role");
}
mainScreen();