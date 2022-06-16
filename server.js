// Imported files
const inquirer = require('inquirer');
const dataBase = require('./config/dbConnection');
const questions = require('./lib/questions');
const util = require('util');
const query = util.promisify(dataBase.query).bind(dataBase);

//Starts questions for beggin of app
const startUp = () => {
    inquirer.prompt(questions.beginQuestion)
    .then((answers) => {

        switch (answers.nextOption) {
            case 'View Departments':
                viewDepts();
                break;
            
            case 'View Roles':
                viewRoles();
                break;

            case 'View Employees':
                viewEmployees();
                break;
            
            case 'Add Departments':
                addDepts();
                break;
            
            case 'Add Roles':
                addRoles();
                break;

            case 'Add Employees':
                addEmployees();
                break;

            case 'Update Employee Roles':
                updateCurrentRoles();
                break;

            case 'Exit':
                exitSystem();
                break;
        }
    })
    .catch(err => {
        if (err) throw err;
    });
};

//Function to view Departments
const viewDepts = async () => {
    const data = await query(
        `SELECT * FROM departments;`)
        consoleTable(data);
        startUp();
};


//Function to view Employee Roles
const viewRoles = async () => {
    const data = await query(
        `SELECT * FROM roles;`)
        consoleTable(data);
        startUp();
};

//Function to view Employees
const viewEmployees = async () => {
    const data = await query(
        ` SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employees, roles.title AS roles, roles.salary AS salary, departments.name AS departments, CONCAT(managers.first_name, " ", managers.last_name) AS manager
        FROM employees
        JOIN roles on employees.role_id = roles.id
        JOIN departments ON roles.departments_id = departments.id
        JOIN employees manager ON managers.id = employees.manager_id;`)
        
        consoleTable(data);
        startUp();
};

//Function to add Departments
const addDepts = async () => {
    const newDept = await inquirer.prompt(questions.deptQuestions);
     await query(`
     INSERT INTO departments (name)
     VALUES (?)`, newDept.deptNames.trim());

     await viewDepts();
};

//Function to add roles to Employees
const addRoles = async () => {
    await getDepts();

    const roleAddition = await inquirer.prompt(questions.roleQuestions)
    const deptQuery = await query(`
        SELECT id from departments
        WHERE name = (?)`, roleAddition.roleDept);
        const deptID = deptQuery[0].id;
        await query(`
        INSERT INTO roles (title, salary, departments_id)
        VALUES (?, ?, ?)`, [roleAddition.roleTitle, parseInt(roleAddition.newSalary), deptID]);
        
        viewRoles();
};

//Adds new Employees
const addEmployees = async () => {
    await selectRoles();
    await selectEmployees();

    const newEmpAdd = await inquirer.prompt(questions.empQuestions);
    const roleSearch = await query(`
    SELECT id from roles
    WHERE title = (?)`, newEmpAdd.newRole);
    
    const roleIDs = roleSearch[0].id;
    const managerName = newEmpAdd.deptManager.split(' ');
    const managerSelect = await query(`
    SELECT id from employees
    WHERE first_name = (?) AND last_name = (?);`, [managerName[0], managerName[1]]);
    const managersID = managerSelect[0].id;
    
    await query(`
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`, [newEmpAdd.firstName, newEmpAdd.lastName, roleIDs, managersID]);

    viewEmployees();
};

//Updates roles of current Employees
const updateCurrentRoles = async () => {
    await selectRoles();
    await selectEmployees();

    const updateEmpRoles = await inquirer.prompt(questions.updateRole);
    const roleSearch = await query(`
    SELECT id from roles
    WHERE title = (?);`, updateEmpRoles.roleUpdate);
    
    const roleIDs = roleSearch[0].id;
    const employeeName = updateEmpRoles.currentUpdateEmp.split(' ');
    
    const searchEmployee = await query(`
    SELECT id from employees
    WHERE first_name = (?) AND last_name = (?);` [employeeName[0], employeeName[1]]);
    const empID = searchEmployee[0].id;
    
    await query(`
    UPDATE employees
    SET role_id = (?)
    WHERE id = (?)`, [roleIDs, empID]);

    await viewEmployees();
};

//Formats User input data into table format in the console log
const consoleTable = (data) => {
    console.table(data);
};

//Quits application
const exitSystem = () => {
    process.exit();
}

//Renders all departments
const getDepts = async () => {
    const listDepts = await query(`SELECT id, name FROM departments;`);
    
    for (const coreDepts of listDepts){
        const departments = {};
        departments.id = coreDepts.id;
        departments.name =coreDepts.name;
        questions.employeeDept.push(departments);
    };
};

//Renders all roles of Employees
const selectRoles = async () => {
    const listRoles = await query(`SELECT id, name FROM roles;`);
    
    for (const coreRoles of listRoles) {
        const roles = {};
        roles.id = coreRoles.id;
        roles.name = coreRoles.title;
        questions.employeeRole.push(roles);
    };
};

//Renders all Employees of company
const selectEmployees = async () => {
    const listEmps = await query(`SELECT id, first_name, last_name FROM employees;`);
    
    for (const coreEmps of listEmps){
        const employees ={};
        employees.id = coreEmps.id;
        employees.name = `${coreEmps.first_name} ${coreEmps.last_name}`;
        questions.employeeStatus.push(employees);
    };
};


//Calling function to prompt user with questions
startUp();
