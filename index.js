const inquirer = require("inquirer");
const mysql = require("mysql")
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"rootroot",
    database:"employee_db"
})
start();
function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all Employees",
                "View all Employees by Department",
                "View all Employees by manager",
                "Add Employee",
                "Remove Employee",
                "Update Empoyee Role",
                "Update Empoyee Manager"
            ]
        }
    ]).then(function (data) {
        let choice = data.choice
        switch (choice) {
            case "View all Employees":
                viewAll();
                break;

            case "View all Employees by Department":
                viewDepartment();
                break;

            case "View all Employees by manager":
                viewManager();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Empoyee Role":
                updateEmployee();
                break;
            case "Update Empoyee Manager":
                updateManager();
                break;
        }
    })
};

function viewAll(){
    connection.query("select * from employee", function(err,res){
        console.log(res)
    })
};

function viewDepartment(){

};

function addEmployee(){

};

function removeEmployee(){

};

function updateEmployee(){

};

function updateManager(){

};