const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")
// route
router.post('/signup', authController.signUp)
router.post('/signin', authController.signin)
router.post('/signout', authController.signout)
router.patch('/send-verification', authController.sendVerificationCode)
router.patch('/verification-code', authController.verifyVerificationCode)

module.exports = router

