const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {
  // this here is the instance of the user with all its data
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

// methods that will run to every instance of this object
UserSchema.methods = {
  // will check if the password is valid against the hashed password saved
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
};

// methods that run every time no matter the instance
UserSchema.statics = {
  generateToken({ id }) {
    // you can pass more data other than ID if you want to compare
    // store session data, carts, logs etc all in the session encrypted token
    return jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.ttl });
  },
};

module.exports = mongoose.model('User', UserSchema);
