import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const updatesSchema = new Schema({
  printer: { type: mongoose.Schema.Types.ObjectId },
  user: { type: String },
  description: { type: String },
  timestamp: { type: Date },
});

const Update = mongoose.model('Update', updatesSchema);
export default Update;
