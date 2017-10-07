var express = require("express");
var router = express.Router();

router.post("/", function(req, res) {
  password = process.env.PASSWORD;
  username = process.env.USERNAME;
  var error = false;
  var message = "";
  if (password != req.body.password) {
    error = true;
    message = "invalid password";
  }
  if (username != req.body.username) {
    error = true;
    message = "invalid username";
  }
  res.send(error ? { msg: message } : { msg: "" });
});

module.exports = router;
