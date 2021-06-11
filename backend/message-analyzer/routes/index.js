const express = require("express");
const { spawn } = require("child_process")
const router = express.Router();

router.post("/", function(req, res, next) {

  let dataToSend;

  const python = spawn("python", ["analyze.py", req.body.text]);

  python.stdout.on("data", function(data) {
    dataToSend = data.toString();
  });

  python.on("close", (code) => {
    console.log(`child process exiting with code ${code}`);
    res.send(dataToSend)
  });
});

module.exports = router;
