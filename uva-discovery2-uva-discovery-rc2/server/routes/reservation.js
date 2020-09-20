import express from 'express';
import userController from '../controllers/userController';
import roleController from '../controllers/roleController';
import reservationController from '../controllers/reservationController';

const router = express.Router();
const RESERVATIONS = roleController.resources.RESERVATIONS;
const { CREATE, READ, UPDATE, DELETE } = roleController.actions;

router.post('/new-reservation/', userController.allowIfLoggedIn, reservationController.createReservation);
router.get('/reservations', userController.allowIfLoggedIn, reservationController.getReservations);
router.get('/reservations/:id', userController.allowIfLoggedIn, reservationController.getOneReservation);

router.put(
  '/reservations/:id',
  userController.grantAccessOrOwn(UPDATE, RESERVATIONS),
  reservationController.updateReservation
);

router.delete(
  '/reservations/:id',
  userController.grantAccessOrOwn(DELETE, RESERVATIONS),
  reservationController.deleteReservation
);

export default router;
