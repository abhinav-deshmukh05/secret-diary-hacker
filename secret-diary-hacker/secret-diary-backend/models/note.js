const mongoose = require('mongoose');
const { title } = require('process');

const noteSchema = new mongoose.Schema({
   title: {
    type:String,
    required:true,
    trim:true,
   },
   content :{
    type:String,
    required:true,
    trim:true,
   },
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   }},
   {timestamps:true
});

module.exports = mongoose.model('Note',noteSchema);