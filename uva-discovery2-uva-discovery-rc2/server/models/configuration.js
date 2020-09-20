import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const configurationSchema = new Schema({
  server: {
    discovery: {
      updateFrecuency: { type: Number },
      printerExpires: { type: Number },
      maxPrinterLogs: { type: Number },
    },
    ldap: {
      url: { type: String },
      adminUsername: { type: String },
      adminPassword: { type: String },
    },
  },
  client: {
    colors: [{ type: String }],
    status: [{ text: { type: String }, color: { type: String } }],
    defaultHeaders: [{ type: String }],
    alertTimeout: { type: Number },
    defaultHours: { type: Number },
    calendarStartHour: { type: Number },
    calendarEndHour: { type: Number },
  },
});

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;
