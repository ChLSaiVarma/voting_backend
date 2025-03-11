const express = require('express');
const router = express.Router();
const User = require('../models/user');
const  { jwtAuthMiddleware, generateToken } = require('./../jwt');

// POST route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming the request body contains person's data

        // Create a new person document using the Mongoose model
        const newUser = new User(data);

        // Save the new person to the database using await
        const savedPerson = await newUser.save();
        console.log(savedPerson);

        const payload = {
            id: savedPerson.id
        };

        // Generate JWT token
        const token = generateToken(payload);
        // console.log("savedPerson.id:", savedPerson.id, "payload:", payload);
        console.log("token:", token);

        // Attach the token to the response object
        savedPerson.token = token;

        console.log('Saved person to database');
        res.status(201).json({response: savedPerson , token : token });
    } catch (error) {
        console.error('Error saving person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login', async (req, res) => {
  try {
      // Extract username and password from request body
      const { aadharCardNumber, password } = req.body;

      // Find the user by username
      const user = await Person.findOne({ aadharCardNumber : aadharCardNumber });
      console.log( { aadharCardNumber, password });
      // If user does not exist or password does not match, return error
      if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }
      const payload = {id: user.id };
      // Generate JWT token
      const token = generateToken(payload);
      // Send token in response
      res.json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        // Extract user id from decoded token
        const userId = req.user.id;
  
        // Find the user by id
        const user = await Person.findById(userId);
  
        // If user does not exist, return error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        // Send user profile as JSON response
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// PUT route to update a person
router.put('/profile/password',jwtAuthMiddleware,  async (req, res) => {
    try {
        const userId = req.user; // Extract the person's ID from the URL parameter
        const {currentPassword,newPassword} = req.body;
        const user = await Person.findOne(userId);
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        user.password= newPassword;
        await user.save();
        console.log('password updated');
        res.status(200).json({message:"password updated "})
    } catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route to delete a person
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Extract the person's ID from the URL parameter

        // Find the person by ID and remove them
        const deletedPerson = await Person.findByIdAndDelete(personId);

        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }

        // Send a success message as a JSON response
        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
