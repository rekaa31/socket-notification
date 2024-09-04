var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');

/* GET users listing. */
router.post('/login', userController.authLogin);
router.post('/verify-otp', userController.verifyOTP);
router.post('/register', userController.register);

module.exports = router;
