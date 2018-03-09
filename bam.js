//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});


// Making the my mySQL connection. 
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected!");
start();
});

//
function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("ItemID\tProduct Name\tDepartment Name\tPrice\tNumber in Stock");
        console.log("-------------------------------------------------------------");
        // Printing out the inventory to the store front. 
        for(var i=0; i<res.length; i++){
            console.log(res[i].item_id +" \t "+ res[i].product_name +" \t "+ res[i].department_name +" \t "+ res[i].price +" \t "+
                res[i].stock_quantity);
                 }
                 console.log("-------------------------------------------------------------");
            });
    // connection.end();
 
    }
// ==============================================================================================
// =============================================================================
// Creating a function to ask customer which product they would like to purchase.
// function to handle posting new items up for auction
function start() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      message: "Would you like to see the products we have available?",
      choices: ["YES", "NO"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.start.toUpperCase() === "YES") {
        displayProducts();
        customerShop();
      } 
      else {
        console.log("Thanks for stopping in. Come back soon." + "\n");
        connection.end();
      }
    });
}
// =========================================================================================
// Selecting product and quantity
// function to handle posting new items up for auction
function customerShop() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Type in the PRODUCT ID for the item you'd like to buy." + "\n",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "amount",
        type: "input",
        message: "How many of this item would you like?" + "\n",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: answer.item}, function(err,res){
            // This is the logic to Check the quanity matches and update the database inventory. 
            for(var i=0; i<res.length; i++){
              console.log("item_id: " + res[i].item_id + " || Product Name: " + res[i].product_name 
                + " || Price: " + res[i].price + " || Stock Quantity: " + res[i].stock_quantity + "\n" + "\n");
              if(answer.amount > res[i].stock_quantity){
                console.log("Sorry, we don't have that many in stock. Please select a smaller number." + "\n" + "\n");
                start();
              } 
              else{
                var orderCost = (res[i].price * answer.amount)
                console.log("\n" + "========================================")
                console.log("Your purchase is complete." + "\n");
                console.log("Your Order Amount is $" + orderCost +"\n");
                console.log("Your " + res[i].product_name + " will be delivered soon!");
                console.log("\n" + "========================================" + "\n" + "\n");
                var newInventoryAmount = (res[i].stock_quantity - answer.amount);
                // console.log(newInventoryAmount);
                var inventoryUpdate = "UPDATE products SET ? WHERE ?"
                connection.query(inventoryUpdate, [{stock_quantity: newInventoryAmount}, {item_id: answer.item}], function(err, res){
                  // console.log("Inventory Was Updated. Thanks for shopping. Your product is on its way.");
                });
                start();
              }
            }
        })
    });
}