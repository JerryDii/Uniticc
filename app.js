const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

// allows us to use ejs
app.use(expressLayouts);
app.set("view engine", "ejs");


// allows us to parse data with req.body. ...
app.use(express.urlencoded({ extended: false }));

//folder of statics
app.use(express.static("dashboard-styling"));

app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
