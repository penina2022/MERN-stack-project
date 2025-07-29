const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

//It will come here only when its /auth already.
router.route('/')
    //creat
    .post(loginLimiter, authController.login)

//It will come here only when its /auth/refresh.
router.route('/refresh')
    .get(authController.refresh)

//It will come here only when its /auth/logout.
router.route('/logout')
    .post(authController.logout)


module.exports = router