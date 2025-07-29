const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

//It will come here only when its /users already.
router.route('/')
    //Read
    .get(notesController.getAllNotes)
    //creat
    .post(notesController.creatNewNote)
    //update
    .patch(notesController.updateNote)
    //delete
    .delete(notesController.deleteNote)

module.exports = router