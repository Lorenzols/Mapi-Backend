var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController");

//Se controla el inicio de sesión y el de cración de cuentas
router.post('/signup', authController.postSignin);
router.post('/signin', authController.postLogin);
router.get('/user', authController.getUser);

module.exports = router;