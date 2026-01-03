const express = require('express'); // Import Express framework
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const User = require('../models/user'); // Import User model to access the users collection
const jwt = require('jsonwebtoken'); // Import jsonwebtoken to create JWT tokens

const router = express.Router(); // Create a new router instance to define routes

// Signup route
router.post('/signup', async (req, res) => { // Handle POST requests to /signup
  try {
    const { email, password } = req.body; // Read email and password from the request body

    if (!email || !password) { // Validate that email and password are provided
      return res.status(400).json({ message: 'Email and password are required' }); // Return 400 Bad Request if either is missing
    }

    const existingUser = await User.findOne({ email }); // Check if a user with this email already exists
    if (existingUser) { // If a user exists with the same email
      return res.status(409).json({ message: 'User already exists' }); // Return 409 Conflict
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing (strength 10)
    const passwordHash = await bcrypt.hash(password, salt); // Hash the user's password using the generated salt

    const newUser = await User.create({
      email, // Save email to the new user document
      passwordHash, // Save hashed password to the new user document
    }); // Create and persist the new user in the database

    return res.status(201).json({ // Respond with 201 Created and minimal user info
      message: 'User created successfully',
      userId: newUser._id, // Return the new user's id
      // passwordHash: newUser.passwordHash, (commented out for security)
    });
  } catch (err) {
    console.error('Error during signup:', err.message); // Log the error message to the server console
    return res.status(500).json({ message: 'Server error' }); // Return 500 Internal Server Error for unexpected issues
  }
});

// Login route
router.post('/login', async (req, res) => { // Handle POST requests to /login
  try {
    const { email, password } = req.body; // Read email and password from the request body

    if (!email || !password) { // Validate required fields
      return res.status(400).json({ message: 'Email and password are required' }); // Return 400 if missing
    }

    const user = await User.findOne({ email }); // Look up the user by email
    if (!user) { // If no user found with that email
      return res.status(401).json({ message: 'Invalid credentials' }); // Return 401 Unauthorized
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash); // Compare provided password with stored hash
    if (!isMatch) { // If passwords don't match
      return res.status(401).json({ message: 'Invalid credentials' }); // Return 401 Unauthorized
    }

 const token = jwt.sign( // Create a JWT token for the authenticated user
  { userId: user._id }, // Encode the user's id inside the token payload
  process.env.JWT_SECRET, // Use the JWT secret from environment variables to sign
  { expiresIn: '1h' } // Set token expiration to 1 hour
);

    return res.status(200).json({ // Return success response with the token
      message: 'Login successful',
      token, // Send the JWT to the client
    });
  } catch (err) {
    console.error('Error during login:', err.message); // Log errors to the console
    return res.status(500).json({ message: 'Server error' }); // Return 500 on exceptions
  }
});

module.exports = router; // Export the router so it can be mounted in the main app
