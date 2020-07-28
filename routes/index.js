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
  const { selectedAreas, allAreas } = req.body; 
  console.log(selectedAreas, allAreas);
  res.sendStatus(200);
});




  module.exports = Router;
