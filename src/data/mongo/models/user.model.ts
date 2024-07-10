import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'The email already exists'],
  },
  password: {
    type: String,
    required: [true, 'Name is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
});

export const UserModel = mongoose.model('User', userSchema);
