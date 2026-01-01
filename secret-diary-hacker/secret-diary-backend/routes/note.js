const express = require('express');
const Note = require('../models/note');
const authGuard = require('../middleware/Auth');
const user = require('../models/user');

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

// Get all notes for the authenticated user
router.get('/',authGuard, async(req,res)=>{
    try{
        const notes = await Note.find({owner:req.userId}).sort({createdAt:-1});
        const responseNotes = {
            count : notes.length,
            notes:notes

        }
        return res.status(200).json(responseNotes);
    }catch(err){
        console.error('Error fetching notes:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
});

//make the update and delete routes here
// Update a note 
   router.put('/:id',authGuard, async (req,res)=>{

    try{
        const {title,content} = req.body;
       
        if(!title || !content){
            return res.status(400).json({message:'Title and content are required'});
        }

      const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId, // 🔐 ownership check
      },
      {
        $set: {
          ...(title && { title }),
          ...(content && { content }),
        },
      },
      { new: true }
    );
     if(!updatedNote){
        return res.status(404).json({message:'Note not found or unauthorized'});
    }
   return res.status(200).json({
    message:'Note updated successfully',
    note:updatedNote,
   });
    }catch(dummyErr){
        console.error('Error updating note:', dummyErr.message);
        return res.status(500).json({ message: 'Server error' });
    }
   })
   // DELETE note
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId, // 🔐 ownership enforced
    });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    return res.status(200).json({
      message: 'Note deleted successfully',
    });
  } catch (err) {
    console.error('Delete note error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

    module.exports = router;