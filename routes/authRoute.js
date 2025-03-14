const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const { verifiedJwt } = require('../midelwares/jwtIdentifier');
// route
router.post('/signup', authController.signUp)
router.post('/signin', authController.signin)
router.post('/signout', verifiedJwt,verifiedJwt,authController.signout)
router.patch('/send-verification',verifiedJwt,authController.sendVerificationCode)
router.patch('/verification-code',verifiedJwt,authController.verifyVerificationCode)
router.patch('/change-password', verifiedJwt,authController.changePassword)

module.exports = router

