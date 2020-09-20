import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  resourceid: { type: mongoose.Schema.Types.ObjectId, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  reservedby: { type: String, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  color: { type: String },
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
