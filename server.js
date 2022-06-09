const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const dataBase = require('./config/connection');
const questions = require('./lib/questions');

const startUp = () => {
    inquirer.prompt(questions.beginQuestions)
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
