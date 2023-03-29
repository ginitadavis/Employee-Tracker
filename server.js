const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { async } = require('radar-sdk-js');
require('dotenv').config();
const cTable = require('console.table');


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

async function executesSql(sql){
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, function(err, result) {
                err ? reject(err) : resolve(result);
            });
        });
        //Show the result of the query
        console.table(result);
        console.log(`
        *** Continue to the next screen ***
        `)
        //Then I call the mainScreen
        mainScreen();
    }catch(err){
        console.log(err);
    }
}

//Depending on what the user selected the function for that accion executes
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
//View departments
async function viewDepartments(){
    let sql = 'SELECT * FROM department';
    executesSql(sql);
}

//View employees
async function viewEmployees(){
    let sql = `SELECT e.id AS ID, e.first_name, e.last_name, r.title AS Title, d.name as Department, r.salary as Salary, CONCAT(m.first_name, ' ', m.last_name) as Manager
    FROM employee e
    JOIN role r ON r.id = e.role_id
    JOIN department d ON d.id = r.department_id
    LEFT JOIN employee m ON e.manager_id = m.id;`;

    executesSql(sql);
}

//View Roles
async function viewRoles(){
    let sql = `SELECT role.title AS Title, role.id AS ID, department.name AS Department, role.salary AS Salary
    FROM role
    JOIN department ON department.id = role.department_id;`
    
    executesSql(sql);
}

//Add department
async function addDepartment(){

    const dept = await inquirer
    .prompt([
        {
            type: 'input',
            message: `Please enter the department's name`,
            name: 'name'
        }
    ]);

    console.log(`
    Department added succesfully!
    `);

    try {
        let sql = `INSERT INTO department (name) VALUES (?)`
        db.query(sql, dept.name);

        console.log(`
        *** Continue to the next screen ***
        `)
        //Then I call the mainScreen
        mainScreen();
        
     } catch(err){
         console.log(err);
     }
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
        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
        db.query(sql, [newRole.name, newRole.salary, ans.answer]);
        console.log(`
    Role added succesfully!
    `);
    mainScreen();
    })
}

async function addEmployee(){

    try{
        //Array of objects of the role table
        const [role] = await db.promise().query('SELECT * FROM role');

        //Array of objects of the employee table
        const [manager] = await db.promise().query('SELECT * FROM employee');

        //Request user the name and last name
        let newEmployee = await inquirer
        .prompt([
            {
                type: 'input',
                message: `Please enter the employee's first name`,
                name: 'firstName'
            },
            {
                type: 'input',
                message: `Please enter the employee's last name`,
                name: 'lastName'
            }
        ]);

        //Change the 'id' inside the role query for 'value' - The value will get the id for the role stored in a variable 'value'
        const roles = role.map(function(role2) {
            return {
                value: role2.id,
                name: role2.title,
            }
        });

        //Change the 'id' inside the employee query for 'value' - The value will get the id for the employee stored in a variable 'value'
        const managers = manager.map(function(manager2) {
            return {
                value: manager2.id,
                name: manager2.first_name+' '+manager2.last_name,
            }
        });

        managers.unshift({value:null, name: null});

        //Ask to choose the department title and store the department value (id)
        await inquirer
        .prompt([
            {
                message: `What is the employee's role?`,
                type: 'list',
                name: 'answerRoles',
                choices: roles
            },
            {
                message: `Who's the employee's manager?`,
                type: 'list',
                name: 'answerManager',
                choices: managers
            }
        ]).then(function(ans) {
            let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
            db.query(sql, [newEmployee.firstName, newEmployee.lastName, ans.answerRoles, ans.answerManager]);
            
            console.log(`
        Employee added succesfully!
        `);
        mainScreen();
        })

    } catch(err){
        console.log(err);
    }

}

async function updateEmployeeRole(){
    try{
        //Array of objects of the role table
        const [role] = await db.promise().query('SELECT * FROM role');

        //Array of objects of the employee table
        const [manager] = await db.promise().query('SELECT * FROM employee');
        
    }catch(err){

    }
}
mainScreen();