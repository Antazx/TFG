import config from '../config/config';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

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
  updated: { type: Date, default: Date.now, index: { expires: config.DISCOVERY.PRINTERS_EXPIRES } },
  created: { type: Date },
  fromdiscovery: { type: Boolean, default: false },
  information: {
    status: { type: String },
    firmwareversion: { type: String },
    partnumber: { type: String },
    printertype: { type: String },
    alerts: [{ type: String }],
  },
  log: {
    type: [
      {
        status: { type: String },
        path: { type: String },
        filename: { type: String },
        timestamp: { type: Date },
      },
    ],
    validate: [arrayLimit, `{PATH} exceeds the limit of ${config.DISCOVERY.MAX_PRINTER_LOGS}`],
  },

  metadata: {
    alias: { type: String, default: '' },
    location: { type: String, default: '' },
    workteam: { type: String, default: '' },
    reservedby: { type: String, default: '' },
    reserveduntil: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
});

function arrayLimit(val) {
  return val.length <= config.DISCOVERY.MAX_PRINTER_LOGS;
}

printerSchema.plugin(uniqueValidator, {
  message: 'Printer Schema error, expected {PATH} to be unique.',
});

const Printer = mongoose.model('Printer', printerSchema);
export default Printer;
