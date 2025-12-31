const express = require('express');
const Note = require('../models/note');
const authGuard = require('../middleware/Auth');

const router = express.Router();

// Create a new note
router.post('/', authGuard, async (req, res) => {
    try{

        const {title,content} = req.body;
        if(!title || !content){
            return res.status(400).json({message:'Title and content are required'});
        }
        const newNote = await Note.create({
            title,
            content,
            owner:req.userId,
        })

        return res.status(201).json({
            message:'Note created successfully',
            note:newNote,
        });
    }catch(err){
        console.error('Error creating note:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
    });

    module.exports = router;