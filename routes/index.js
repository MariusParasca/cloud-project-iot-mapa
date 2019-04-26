var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
/* GET home page. */
router.get('/', index.index);
router.post('/login', index.login);
// router.post('/register', index.register);

module.exports = router;


