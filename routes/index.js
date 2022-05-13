var express = require('express');
var router = express.Router();
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  // send html file to client
  res.sendFile(path.join(__dirname, '../views/index.html'));
});
// add fro

module.exports = router;
