const inquirer = require('inquirer');
const dataBase = require('./config/dbConnection');
const consoleTable = require('console.table');
const questions = require('./lib/questions');

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

const viewDepts = async (res) => {
    dataBase.query(
        `SELECT * FROM departments;`)         
            consoleTable(res);
            startUp();
        
};

const viewRoles = async (res) => {
    dataBase.query(
        `SELECT * FROM roles;`)
        consoleTable(res);
        startUp();
};

const viewEmployees = async (res) => {
    dataBase.query(
        ` SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employees, roles.title AS roles, roles.salary AS salary, departments.name AS departments, CONCAT(managers.first_name, " ", managers.last_name) AS manager
        FROM employees
        JOIN roles on employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        JOIN employees manager ON manager.id = employees.manager_id;`)
        
        consoleTable(res);
        startUp();
};

const addDepts = async () => {
    const newDept = await inquirer.prompt(questions.deptQuestions);
     await dataBase.query(`
     INSERT INTO departments (name)
     VALUES (?)`, newDept.deptNames.trim());

     await viewDepts();
};

const addRoles = async () => {
    await getDepts();

    const roleAddition = await inquirer.prompt(questions.roleQuestions)
    const deptQuery = await dataBase.query(`
        SELECT id from departments
        WHERE name = (?)`, roleAddition.roleDept);
        const deptID = deptQuery[0].id;
        await dataBase.query(`
        INSERT INTO roles (title, salary, department_id)
        VALUES (?, ?, ?)`, [roleAddition.roleTitle, parseInt(roleAddition.newSalary), deptID]);
        
        viewRoles();
};

const addEmployees = async () => {
    await selectRoles();
    await selectEmployees();

    const newEmpAdd = await inquirer.prompt(questions.empQuestions);
    const roleSearch = await dataBase.query(`
    SELECT id from roles
    WHERE title = (?)`, newEmpAdd.newRole);
    
    const roleIDs = roleSearch[0].id;
    const managerName = newEmpAdd.deptManager.split(' ');
    const managerSelect = await dataBase.query(`
    SELECT id from employees
    WHERE first_name = (?) AND last_name = (?);`, [managerName[0], managerName[1]]);
    const managersID = managerSelect[0].id;
    
    await dataBase.query(`
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`, [newEmpAdd.firstName, newEmpAdd.lastName, roleIDs, managersID]);

    viewEmployees();
};

const updateCurrentRoles = async () => {
    await selectRoles();
    await selectEmployees();

    const updateEmpRoles = await inquirer.prompt(questions.updateRole);
    const roleSearch = await dataBase.query(`
    SELECT id from roles
    WHERE title = (?);`, updateEmpRoles.roleUpdate);
    
    const roleIDs = roleSearch[0].id;
    const employeeName = updateEmpRoles.currentUpdateEmp.split(' ');
    
    const searchEmployee = await dataBase.query(`
    SELECT id from employees
    WHERE first_name = (?) AND last_name = (?);` [employeeName[0], employeeName[1]]);
    const empID = searchEmployee[0].id;
    
    await dataBase.query(`
    UPDATE employees
    SET role_id = (?)
    WHERE id = (?)`, [roleIDs, empID]);

    await viewEmployees();
};

const exitSystem = () => {
    process.exit();
}

const getDepts = async () => {
    const listDepts = await dataBase.query(`SELECT id, name FROM departments;`);
    
    for (const coreDepts of listDepts){
        const departments = {};
        departments.id = coreDepts.id;
        departments.name =coreDepts.name;
        questions.employeeDept.push(departments);
    };
};

const selectRoles = async () => {
    const listRoles = await dataBase.query(`SELECT id, name FROM roles;`);
    
    for (const coreRoles of listRoles) {
        const roles = {};
        roles.id = coreRoles.id;
        roles.name = coreRoles.title;
        questions.employeeRole.push(roles);
    };
};

const selectEmployees = async () => {
    const listEmps = await dataBase.query(`SELECT id, first_name, last_name FROM employees;`);
    
    for (const coreEmps of listEmps){
        const employees ={};
        employees.id = coreEmps.id;
        employees.name = `${coreEmps.first_name} ${coreEmps.last_name}`;
        questions.employeeStatus.push(employees);
    };
};

startUp();
