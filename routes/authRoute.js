const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")
// route
router.post('/signup', authController.signUp)
router.post('/signin', authController.signin)

module.exports = router

