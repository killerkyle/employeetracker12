const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
// create the connection information for the sql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeeTracker_db"
});

// connecting to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    begin();
});

function begin() {
    console.log("\n");
    console.log("---------------------------------");
    console.log("---------------------------------");
    console.log("---------WELCOME TO THE----------");
    console.log("---------------------------------");
    console.log("--------EMPLOYEE TRACKER!--------");
    console.log("---------------------------------");
    console.log("---------------------------------");
    console.log("\n");
// starts the app
    start();
}

const rolesArr = [];
    connection.query("SELECT title FROM role", function (err, res){
        if (err) throw err;
        for (i=0; i<res.length; i++){
    rolesArr.push(res[i].title)
}});

function start() {
inquirer.prompt(
{
type: "list",
name: "startMenu",
message: "Welcome to the employee tracker! Choose from the selections below.",
choices: [
"View Employees",
"Add Employee",
"Update Employee Role",
"Remove Employee", 
"View Departments",
"Add Department",
"Remove Department",
"View Roles",
"Add Role",
"Remove Role",
"Exit"
]
},
).then(response => {
switch(response.startMenu) {
case "View Employees":
viewEmployees();
break;
case "Add Employee":
addEmployee();
break;
case "Update Employee Role":
updateEmployee();
break;
case "Remove Employee":
removeEmployee();
break;
case "View Departments":
viewDepartments();
break;
case "Add Department":
addDepartment();
break;
case "Remove Department":
removeDepartment();
break;
case "View Roles":
viewRoles();
break;
case "Add Role":
addRole();
break;
case "Remove Role":
removeRole();
break;
case "Exit":
console.log("\n");
console.log("---------------------------------");
console.log("-----Thank You for using the-----");
console.log("---------------------------------");
console.log("--------EMPLOYEE TRACKER---------");
console.log("---------------------------------");
console.log("\n");
return connection.end();
};
})
};
