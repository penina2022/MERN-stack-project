const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

//It will come here only when its /users already.
router.route('/')
    //Read
    .get(usersController.getAllUsers)
    //creat
    .post(usersController.creatNewUser)
    //update
    .patch(usersController.updateUser)
    //delete
    .delete(usersController.deleteUser)

module.exports = router