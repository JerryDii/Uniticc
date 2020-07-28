const express = require("express");
const Router = express.Router();


//Router.use(express.json()); //FOR PARSING POST REQUESTS


Router.get("/", (req, res) => {
    res.render("welcome");
  });

Router.get("/matching", (req, res) => {
    res.render("matching");
});

Router.post("/dashboard/profile", (req, res) => {
  const { areas } = req.body; //Collect necessary profile qualities from POST request
  console.log(areas)
  res.send(areas);
});







  module.exports = Router;
