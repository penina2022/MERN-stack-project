const express = require('express')
const router = express.Router()
const path = require('path')

//if it matches the reg expresion it will do the function
router.get(/^\/$|^\/index(?:\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router