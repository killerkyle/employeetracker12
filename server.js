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

// Joins data from role to add onto the console.table
function viewEmployees(){
    connection.query("SELECT first_name, last_name, title, salary, manager FROM employee LEFT JOIN role ON employee.role_id = role.id", function(err, res) {
      if (err) throw err;
      
      let viewInfo = [];

      for (i = 0; i < res.length; i++){
         viewInfo.push({
           first_name: res[i].first_name,
           last_name: res[i].last_name,
           title: res[i].title,
           salary: res[i].salary,
           manager: res[i].manager
         })
      }
      console.table(viewInfo);
      start();
    });
  };

  // Adding employee to the database 
function addEmployee(){
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "New Employee's First Name?"
    },
    {
      type: "input",
      name: "last_name",
      message: "New Employee's Last Name?"
    },
    {
      type: "number",
      name: "role_id",
      message: "What will be the Employee's role id?"
    },
    {
      type: "input",
      name: "manager",
      message: "Who is the new employee's manager?"
    }
  ]).then(response => {
      // puts the response it in createEmpDB function
      createEmpDB(response);
      start();
    });
};

function createEmpDB(response){
  console.log("\n" + "Adding the new employee into database." + "\n");
  var query = connection.query("INSERT INTO employee SET ?",
    {
      first_name: response.first_name,
      last_name: response.last_name,
      role_id: response.role_id,
      manager: response.manager
    },
    function(err, res) {
      if (err) throw err;
    }
  );
};

// Removing chosen employee from database
function removeEmployee() {

  const employeesArr = [];
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      employeesArr.push(res[i].first_name + " " + res[i].last_name);
    }

    inquirer.prompt([
        {
          type: "list",
          name: "deleteEmployee",
          message: "Which employee would you like to remove?",
          choices: employeesArr
        }
      ]).then(response => {
          connection.query("SELECT * FROM employee", function (err, res){
            // Help from fellow students gave me excellent code.
            const deletedEmployee = res.filter(employee => response.deleteEmployee === employee.first_name + " " + employee.last_name);
            employeeID = deletedEmployee[0].id
            connection.query(
              "DELETE FROM employee WHERE id = ?", [employeeID],
              function (err, res) {
                if (err) throw err;
                console.log("Employee has been removed." + "\n");
                start();
              });
            })
          }) 
      })
  };
