import Reservation from '../models/reservation';

const createReservation = async (req, res, next) => {
  try {
    const { reservedby, resourceid, start, end, name, color } = req.body;
    const startDate = trimDate(start);
    const endDate = trimDate(end);

    const newReservation = new Reservation({
      reservedby,
      resourceid,
      start,
      end,
      name,
      color,
      active: true,
    });
    const availableRange = await checkDateRange(null, resourceid, startDate, endDate);

    if (availableRange) {
      await newReservation.save();
      res.json(newReservation);
    } else {
      next({
        message: 'Other reservations exist for the date range entered',
        status: 409,
      });
    }
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
  try {
    const _id = req.params.id;
    const options = { new: true };
    const { start, end, reservedby, resourceid, name } = req.body;
    const startDate = trimDate(start);
    const endDate = trimDate(end);
    const availableRange = await checkDateRange(_id, resourceid, startDate, endDate);
    if (availableRange) {
      const reservation = await Reservation.findByIdAndUpdate(
        _id,
        { start, end, reservedby, resourceid, name },
        options
      );
      res.json(reservation);
    } else {
      next({
        message: 'Other reservations exist for the date range entered',
        status: 409,
      });
    }
  } catch (err) {
    next(err);
  }
};

const checkDateRange = async (id, resourceid, startDate, endDate) => {
  let filter = {
    $or: [
      { start: { $lte: startDate }, end: { $gt: startDate } },
      { start: { $lt: endDate }, end: { $gte: endDate } },
      { start: { $gt: startDate }, end: { $lt: endDate } },
    ],
    resourceid,
  };

  if (id !== null) filter = { _id: { $ne: id }, ...filter };

  try {
    const documents = await Reservation.find(filter);
    return documents.length === 0 ? true : false;
  } catch (err) {
    return false;
  }
};

const trimDate = (dateString) => {
  const date = new Date(dateString);
  date.setMilliseconds(0);
  date.setSeconds(0);
  return date;
};

const reservationController = {
  createReservation,
  getReservations,
  getOneReservation,
  deleteReservation,
  updateReservation,
};

export default reservationController;
