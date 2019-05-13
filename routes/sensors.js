var express = require('express');
var router = express.Router();

let sensors = require('../controllers/sensors');
/* GET home page. */
router.get('/sensors', sensors.index);
router.get('/sensors/logout', sensors.logout)

module.exports = router;


