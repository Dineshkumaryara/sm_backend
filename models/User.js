const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Principal', 'Faculty', 'Student'], required: true },
  password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
