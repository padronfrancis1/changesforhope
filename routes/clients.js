var express = require('express');
var router = express.Router();
var clients = require('../controllers/clients_controller.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Cleints Page');
});



module.exports = router;
