const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
// Define a person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        required:true,
        type:String
    },
    role:{
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
        required: true
    },
    isVoted:{
        type: Boolean,
        default: false
    }
   
});
// Assuming 'personSchema' is your Mongoose schema

userSchema.pre('save', async function(next) {
    const person = this;
  
    // Hash the password only if it has been modified (or is new)
    if (!person.isModified('password')) {
      return next();
    }
  
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10); // 10 rounds is the recommended number
  
      // Hash the password along with the generated salt
      const hashedPassword = await bcrypt.hash(person.password, salt);
  
      // Override the plain text password with the hashed password
      person.password = hashedPassword;
  
      next();
    } catch (error) {
      return next(error);
    }
  });
  userSchema.methods.comparePassword = async function(candidatePassword) {
      try {
        // Use bcrypt to compare the provided password with the hashed password stored in 'this.password'
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
      } catch (err) {
        throw err;
      }
    };
const User = mongoose.model('User', userSchema);

module.exports = User;
