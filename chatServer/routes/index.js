const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.send({ response: "Chat server is alive" }).status(200);
});

module.exports = router;
