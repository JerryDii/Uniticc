const express = require("express");
const mysql = require("mysql");
const expressLayouts = require("express-ejs-layouts");
var bodyParser = require('body-parser')

const connection = mysql.createConnection({
    host: "localhost",
    user: "u440403356_SSHzV",
    password: "YMfr6W0GOG",
    database: "u440403356_7IhnA"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

const app = express();

// allows us to use ejs
app.use(expressLayouts);
app.set("view engine", "ejs");


// allows us to parse data with req.body. ...
//app.use(express.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//folder of statics
app.use(express.static("dashboard-styling"));

app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
