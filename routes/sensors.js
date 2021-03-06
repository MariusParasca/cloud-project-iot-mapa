var express = require('express');
var router = express.Router();

let sensors = require('../controllers/sensors');
/* GET home page. */
router.get('/sensors', sensors.index);
router.get('/logout', sensors.logout)
router.post('/senddata', sensors.sendData);
router.get('/sensors/refresh', sensors.refreshSensors);
router.post('/sensors/updateSensorNames', sensors.updateSensorNames);

module.exports = router;


