const express = require('express'); // Import Express framework
const Note = require('../models/note'); // Import Note model to interact with notes collection
const authGuard = require('../middleware/Auth'); // Import authentication middleware to protect routes
const user = require('../models/user'); // Import User model (not used directly here but available)

const router = express.Router(); // Create a router instance to define route handlers

// Create a new note
router.post('/', authGuard, async (req, res) => { // POST / - create a note (protected by authGuard)
    try{

        const {title,content} = req.body; // Extract title and content from request body
        if(!title || !content){ // Validate required fields
            return res.status(400).json({message:'Title and content are required'}); // Respond 400 if validation fails
        }
        const newNote = await Note.create({ // Create and save new note document
            title, // Set note title
            content, // Set note content
            owner:req.userId, // Associate note with authenticated user's id (set by authGuard)
        })

        return res.status(201).json({ // Respond 201 Created with the new note
            message:'Note created successfully',
            note:newNote, // Return the saved note object
        });
    }catch(err){
        console.error('Error creating note:', err.message); // Log server error
        return res.status(500).json({ message: 'Server error' }); // Respond 500 on unexpected errors
    }
    });

// Get all notes for the authenticated user
router.get('/',authGuard, async(req,res)=>{ // GET / - list notes for current user (protected)
    try{
        const notes = await Note.find({owner:req.userId}).sort({createdAt:-1}); // Fetch notes owned by user, newest first
        const responseNotes = {
            count : notes.length, // Number of notes returned
            notes:notes // Array of note documents

        }
        return res.status(200).json(responseNotes); // Return notes and count
    }catch(err){
        console.error('Error fetching notes:', err.message); // Log errors
        return res.status(500).json({ message: 'Server error' }); // Return 500 on failure
    }
});

// Update a note
router.put('/:id',authGuard, async (req,res)=>{ // PUT /:id - update a note by id (protected)

    try{
        const {title,content} = req.body; // Extract updated fields
       
        if(!title || !content){ // Validate required fields
            return res.status(400).json({message:'Title and content are required'}); // Respond 400 if missing
        }

      const updatedNote = await Note.findOneAndUpdate( // Find the note by id and owner, then update
      {
        _id: req.params.id, // Match by note id from URL
        owner: req.userId, // Ensure the note belongs to current user (ownership check)
      },
      {
        $set: {
          ...(title && { title }), // Only set title if provided
          ...(content && { content }), // Only set content if provided
        },
      },
      { new: true } // Return the updated document
    );
     if(!updatedNote){ // If no document was found/updated
        return res.status(404).json({message:'Note not found or unauthorized'}); // Respond 404 if not found or user doesn't own the note
    }
   return res.status(200).json({ // Return success with updated note
    message:'Note updated successfully',
    note:updatedNote,
   });
    }catch(dummyErr){
        console.error('Error updating note:', dummyErr.message); // Log update error
        return res.status(500).json({ message: 'Server error' }); // Respond 500 on exception
    }
   })
   // DELETE note
router.delete('/:id', authGuard, async (req, res) => { // DELETE /:id - delete a note by id (protected)
  try {
    const deletedNote = await Note.findOneAndDelete({ // Find the note by id and owner, then delete
      _id: req.params.id, // Note id from URL
      owner: req.userId, // Owner must match current user (ownership enforced)
    });

    if (!deletedNote) { // If no note was deleted
      return res.status(404).json({ message: 'Note not found or unauthorized' }); // Respond 404 when note not found or not owned
    }

    return res.status(200).json({ // Respond success on deletion
      message: 'Note deleted successfully',
    });
  } catch (err) {
    console.error('Delete note error:', err.message); // Log deletion error
   
    return res.status(500).json({ message: 'Server error' }); // Respond 500 on exception
  }
});

    module.exports = router; // Export router to be used by the main application
