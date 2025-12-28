const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

//Signup route
router.post('/singup',async(req,res)=>{
     try{
    const {email,password} = req.body;

   //validate input
        if(!email || !password){
            return res.status(400).json({message:'Email and password are required'});
        }
        //check if user already exists
        const  existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message:'User already exists'});
        }
        // hash the password 
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);
        
        const newUser = new User.create({
            email,
            passwordHash});

        //respond with success
        return res.status(201).json({userId:newUser._id,message:'User created successfully'});
    }catch(err){
        console.error('Error during signup:', err.message);
        res.status(500).json({message:'Server error'});
    }
});

module.exports = router;