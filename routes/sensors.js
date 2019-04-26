var express = require('express');
var router = express.Router();

let sensors = require('../controllers/sensors');
/* GET home page. */
router.get('/', sensors.index);

module.exports = router;


