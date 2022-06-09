const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const connection = require('./config/connection');
const questions = require('./lib/questions');

