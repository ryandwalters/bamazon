//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');


//create connection to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

// var Table = require('cli-table');
// var table = new Table({ head: ["", "Item ID", "Product", "Department", "Price", "Quantity"] });
// console.log(table.toString()); 

// Making the my mySQL connection. 
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
    // 
});
// ===========================================================
// ==============================================================================================
// WELCOME SCREEN for the Customer.  Shows them all of the inventory and then ends the connection.
var makeTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ItemID\tProduct Name\tDepartment Name\tPrice\tNumber in Stock");
        console.log("-------------------------------------------------------------");
        // Printing out the inventory to the store front. 
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " +
                res[i].stock_quantity);

        }
        console.log("-------------------------------------------------------------");
        promptManager(res);
    });
    // connection.end();

}
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

function promptManager() {
    inquirer
        .prompt({
            name: "choice",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["Add new item", "Add quantity to an existing item"]
        })
        .then(function (val) {
            // based on their answer, either call the bid or the post functions
            if (val.choice == "Add new item") {
                addItem();
            }
            if (val.choice == "Add quantity to an existing item") {
                addQuantity(res);
            }
        });
}

//add item

function addItem() {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "What is the name of the product?"
    }, {
        type: "input",
        name: "department_name",
        message: "What is the name of the department?"
    }, {
        type: "input",
        name: "price",
        message: "What is the price of the product?"
    }, {
        type: "input",
        name: "stock_quantity",
        message: "How many are available for sale?"
    }]).then(function(val) {
        console.log(val);
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (val.product_name, val.department_name, val.price, val.stock_quantity)"
                , function (err, res) {
                    if (err) throw err;
                    console.log(val.product_name + "PRODUCT ADDED");
                    makeTable();
                })

        })
}

function addQuantity(res) {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "What product do you want to update?"
    }, {
        type: "input",
        name: "added",
        message: "How much stock to add?"
    }])

        .then(function (val) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == val.product_name) {
                    connection.query("UPDATE products SET stock_quantity = stock_quantity+" + val.added + 'where itemid+' + res[i].itemid + ';', function (err, res) {
                        if (err) throw err;
                        if (res.affectedRows == 0) {
                            console.log("Item does not exist. Try another item");
                            makeTable();
                        } else {
                            console.log("Items added");
                            makeTable();
                        }
                    })
                }
            }
        })

}
makeTable();
// ('+ " val.product_name+ " ', ' "+val.department_name+ " ', + "val.price+"
// )












//         validate: function (value) {
//             if (isNaN(value) === false) {
//                 return true;
//             }
//             return false;
//         }
//       },
// {
//     name: "amount",
//         type: "input",
//             message: "How many of this item would you like?" + "\n",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
// }
//     ])
//     .then(function (answer) {
//     // when finished prompting, insert a new item into the db with that info
//     var query = "SELECT * FROM products WHERE ?";
//     connection.query(query, { item_id: answer.item }, function (err, res) {
//         // This is the logic to Check the quanity matches and update the database inventory. 
//         for (var i = 0; i < res.length; i++) {
//             console.log("item_id: " + res[i].item_id + " || Product Name: " + res[i].product_name
//                 + " || Price: " + res[i].price + " || Stock Quantity: " + res[i].stock_quantity + "\n" + "\n");
//             if (answer.amount > res[i].stock_quantity) {
//                 console.log("Sorry, we don't have that many in stock. Please select a smaller number." + "\n" + "\n");
//                 start();
//             }
//             else {
//                 var orderCost = (res[i].price * answer.amount)
//                 console.log("\n" + "========================================")
//                 console.log("Your purchase is complete." + "\n");
//                 console.log("Your Order Amount is $" + orderCost + "\n");
//                 console.log("Your " + res[i].product_name + " will be delivered soon!");
//                 console.log("\n" + "========================================" + "\n" + "\n");
//                 var newInventoryAmount = (res[i].stock_quantity - answer.amount);
//                 // console.log(newInventoryAmount);
//                 var inventoryUpdate = "UPDATE products SET ? WHERE ?"
//                 connection.query(inventoryUpdate, [{ stock_quantity: newInventoryAmount }, { item_id: answer.item }], function (err, res) {
//                     // console.log("Inventory Was Updated. Thanks for shopping. Your product is on its way.");
//                 });
//                 start();
//             }
//         }
//     })
// });
// }