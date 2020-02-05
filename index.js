const inquirer = require("inquirer");
const mysql = require("mysql")
const cTable = require('console.table')
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_db"
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
                "Add Role",
                "Remove Employee",
                "Update Empoyee Role",
                "Update Empoyee Manager",

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

            case "Add Role":
                addRole();
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

function viewAll() {
    let q = "select a.id, a.first_name, a.last_name, concat(b.first_name,' ',b.last_name) as 'manager' ,title, salary, name from employee a left join employee b on a.manager_id = b.id  left join role on a.role_id = role.id left join department on role.department_id = department.id;"
    connection.query(q, function (err, res) {
        console.log("\n")
        console.table(res)

        start();

    })
};

function viewDepartment() {
    let q = "select name from department"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        console.log("\n")
        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to see?",
                name: "department",
                choices: arr
            }
        ]).then(function (data) {
            console.log(data.department)
            let q = `select a.id, a.first_name, a.last_name, concat(b.first_name,' ',b.last_name) as 'manager' ,title, salary, name from employee a left join employee b on a.manager_id = b.id  left join role on a.role_id = role.id left join department on role.department_id = department.id where name = "${data.department}" `
            connection.query(q, function (err, res) {
                console.log("\n")
                console.table(res)
                start();
            })
        });
    })
};

function viewManager() {
    let q = "select concat(first_name, ' ', last_name) as name from employee"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        console.log("\n")
        inquirer.prompt([
            {
                type: "list",
                message: "Whose subordinates would you like to see?",
                name: "person",
                choices: arr
            }
        ]).then(function (data) {
            data = data.person.split(" ")
            let q = `select a.id, a.first_name, a.last_name, concat(b.first_name,' ',b.last_name) as 'manager' ,title, salary, name from employee a left join employee b on a.manager_id = b.id  left join role on a.role_id = role.id left join department on role.department_id = department.id where b.first_name ="${data[0]}" and b.last_name = "${data[1]}" `
            connection.query(q, function (err, res) {
                console.log("\n")
                console.table(res)
                start();
            })
        });
    })
}

function addEmployee() {
    let employee;
    let q = "select id, concat(first_name, ' ', last_name) as name from employee"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        arr.push("Self Supervised")
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "first",
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "last",
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: arr
            }
        ]).then(function (data) {
            if (data.manager == "Self Supervised") {
                data.manager_id = null
            } else {
                data.manager_id = res.filter(each => each.name == data.manager)[0].id
            }
            employee = data
            let q = "select id, title from role"
            connection.query(q, function (err, res) {
                let arr = res.map(each => each.title)
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What is there role?",
                        name: "role",
                        choices: arr
                    }
                ]).then(function (data) {
                    employee.role_id = res.filter(each => each.title == data.role)[0].id
                    q = `insert into employee (first_name, last_name, role_id, manager_id)
                    values ("${employee.first}","${employee.last}",${employee.role_id},${employee.manager_id})`;
                    connection.query(q, function (err, res) {
                        start();
                    })
                })
            });
        })
    });
};

function addRole() {
    let role;
    let q = "select id, name from department"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        inquirer.prompt([
            {
                type: "list",
                message: "In what department is the new role?",
                name: "name",
                choices: arr
            },
            {
                type: "input",
                message: "What is the role's title?",
                name: "title",
            },
            {
                type: "input",
                message: "What is the roles salary?",
                name: "salary",
            },
        ]).then(function (data) {
            data.department_id = res.filter(each => each.name == data.name)[0].id
            q = `insert into role (title, salary, department_id)
                    values ("${data.title}","${data.salary}",${data.department_id})`;
            connection.query(q, function (err, res) {
                start();
            })
        })
    });
};

function removeEmployee() {
    let q = "select id, concat(first_name, ' ', last_name) as name from employee"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        inquirer.prompt([
            {
                type: "list",
                message: "Whose role would you like to change?",
                name: "name",
                choices: arr
            }
        ]).then(function (data) {
            data = res.filter(each => each.name == data.name)[0].id;
            q = `delete from employee where id = "${data}"`
            connection.query(q, function (err, res) {
                start();
            })
        })
    })
};

function updateEmployee() {
    let change;
    let q = "select id, concat(first_name, ' ', last_name) as name from employee"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        inquirer.prompt([
            {
                type: "list",
                message: "Whose role would you like to change?",
                name: "name",
                choices: arr
            }
        ]).then(function (data) {
            data.id = res.filter(each => each.name == data.name)[0].id;
            change = data;
            q = `select id, title from role`
            connection.query(q, function (err, res) {
                let arr = res.map(each => each.title)
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What role would you like them to have?",
                        name: "role",
                        choices: arr
                    }
                ]).then(function (data) {
                    change.role_id = res.filter(each => each.title == data.role)[0].id;
                    q = `update employee set role_id = "${change.role_id}" where id = "${change.id}" `;
                    connection.query(q, function (err, res) {
                        start();
                    });
                });
            });
        });
    });
};

function updateManager() {

    let q = "select id, concat(first_name, ' ', last_name) as name from employee"
    connection.query(q, function (err, res) {
        let arr = res.map(each => each.name)
        inquirer.prompt([
            {
                type: "list",
                message: "Whose manager would you like to change?",
                name: "name",
                choices: arr
            },
            {
                type: "list",
                message: "Whose would you like to be their manager?",
                name: "manager",
                choices: arr
            }
        ]).then(function (data) {
            data.id = res.filter(each => each.name == data.name)[0].id;
            data.manager_id = res.filter(each => each.name == data.manager)[0].id;
            q = `update employee set manager_id = "${data.manager_id}" where id = "${data.id}" `;
            connection.query(q, function (err, res) {
                start();
            })
        })
    })
};