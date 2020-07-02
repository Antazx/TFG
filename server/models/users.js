import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastlogin: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  role: { type: String, required: true, enum: ['basic', 'maintainer', 'admin'] },
  accesstoken: { type: String },
});

userSchema.plugin(uniqueValidator, {
  message: 'User Schema error, expected {PATH} to be unique.',
});

const User = mongoose.model('User', userSchema);
export default User;
