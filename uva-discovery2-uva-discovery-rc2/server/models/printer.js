import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import logHandler from '../utils/logHandler';

const Schema = mongoose.Schema;

const logSchema = new Schema({
  status: { type: String },
  path: { type: String },
  filename: { type: String },
  timestamp: { type: Date },
});

const printerSchema = new Schema({
  hostname: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    uppercase: true,
  },
  ip: { type: String, trim: true, required: true },
  modelname: { type: String, trim: true, required: true },
  updated: { type: Date },
  created: { type: Date },
  fromdiscovery: { type: Boolean, default: false },
  color: { type: String },
  information: {
    status: { type: String },
    firmwareversion: { type: String },
    partnumber: { type: String },
    printertype: { type: String },
    alerts: [{ type: String }],
  },
  metadata: {
    alias: { type: String, default: '' },
    location: { type: String, default: '' },
    workteam: { type: String, default: '' },
    reservedby: { type: String, default: '' },
    reserveduntil: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  log: [logSchema],
});

printerSchema.post('remove', { document: true }, logHandler.deleteAllLogFiles);

printerSchema.plugin(uniqueValidator, {
  message: 'Printer Schema error, expected {PATH} to be unique.',
});

const Printer = mongoose.model('Printer', printerSchema);
export default Printer;
