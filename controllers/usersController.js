const User = require('../models/User')
const Note = require('../models/Note')
//helps us get the passwords in a safe way from the data base
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    //that will get us all the users without the password and no extra info
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

// @desc Creat new user
// @route POST /users
// @access Private
const creatNewUser = asyncHandler(async (req, res) => {
    //getting the users new info from the frontend
    const { username, password, roles } = req.body

    //config data
    if (!username || !password || !Array.isArray(roles) || !roles.length){
         return res.status(400).json({message: 'All feild are required'})
    }

    //check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    //hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, roles }

    //create and store new user
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users/
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    //getting the users new info from the frontend
    const { id, username, active, password, roles } = req.body

    //config data
    if (!id || !username || !Array.isArray(roles) || !roles.length ||typeof active !== 'boolean'){
         return res.status(400).json({message: 'All feild are required'})
    }

    const user =  await User.findById(id).exec()

    if(!user){
        res.status(400).json({ message: 'User not found' })
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    //that means that the users id is the user we want to update and its a duplicate
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    //updating the existing user
    user.username = username
    user.roles = roles
    user.active = active

    if (password){
        //hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updateUser = await user.save()

    res.json({ message: `${updateUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    //getting the users info from the frontend
    const { id } = req.body

    //config data
    if ( !id ){
         return res.status(400).json({message: 'User ID required'})
    }

    //if the user has assigned notes
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user =  await User.findById(id).exec()

    //we couldnt find the user with the id
    if(!user){
        res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    creatNewUser,
    updateUser,
    deleteUser
}