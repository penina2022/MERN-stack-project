const User = require('../models/User')
const Note = require('../models/Note')
//helps us get the passwords in a safe way from the data base
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    //get all notes from mangodb
    const notes = await Note.find().lean()
    //if no notes were found
    if (!notes?.length) {
        return res.status(400).json({message: 'No notes found'})
    }
    //adding a username for every note
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})

// @desc Creat new note
// @route POST /notes
// @access Private
const creatNewNote = asyncHandler(async (req, res) => {
    //getting the notes new info from the frontend
    const { user, title, text } = req.body

    //config data
    if (!user || !title || !text){
         return res.status(400).json({message: 'All feild are required'})
    }

    //check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Create and store the new note 
    const note = await Note.create({ user, title, text })

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
})

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    //getting the notes new info from the frontend
    const { id, user, title, text, completed } = req.body

    //config data
    if (!id || !user || !title || !text ||typeof completed !== 'boolean'){
         return res.status(400).json({message: 'All feild are required'})
    }

    const note =  await Note.findById(id).exec()

    if(!note){
        res.status(400).json({ message: 'Note not found' })
    }

    //check for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec()
    
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    //updating the existing note
    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updateNote = await note.save()

    res.json({ message: `${updateNote.title} updated` })
})

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    //getting the users info from the frontend
    const { id } = req.body

    //config data
    if ( !id ){
         return res.status(400).json({message: 'Note ID required'})
    }

    const note =  await Note.findById(id).exec()

    //we couldnt find the note with the id
    if(!note){
        res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    creatNewNote,
    updateNote,
    deleteNote
}