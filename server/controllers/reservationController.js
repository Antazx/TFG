import Reservation from '../models/reservation';

const createReservation = async (req, res, next) => {
  try {
    const { reservedby, resourceid, start, end, createdby, name } = req.body;
    //TODO check start-end for that printer, allow or throw err
    const newReservation = new Reservation({ reservedby, resourceid, start, end, createdby, name, active: true });
    await newReservation.save();
    res.json(newReservation);
  } catch (err) {
    next(err);
  }
};

const getReservations = async (req, res, next) => {
  const reservations = await Reservation.find();
  res.json(reservations);
};

const getOneReservation = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const reservation = await Reservation.findOne({ _id });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};
const deleteReservation = async (req, res, next) => {
  try {
    const _id = req.params.id;
    await Reservation.findOneAndDelete({ _id });
    res.json({ message: 'Resource has been deleted' });
  } catch (err) {
    next(err);
  }
};

const updateReservation = async (req, res, next) => {
  //TODO check request values
  //TODO check start-end for that printer, allow or throw err
  try {
    const _id = req.params.id;
    const options = { new: true };
    const reservation = await Reservation.findByIdAndUpdate(_id, req.body, options);
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

const reservationController = {
  createReservation,
  getReservations,
  getOneReservation,
  deleteReservation,
  updateReservation,
};

export default reservationController;
