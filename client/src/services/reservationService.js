import { authHeader } from '../helpers/authHeader';
import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const reservationService = { getAllReservations, createReservation, deleteReservation, updateReservation };

function getAllReservations() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };
  return fetch(`${config.API_URL}/api/reservations`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((reservations) => {
      return reservations;
    });
}

function createReservation(reservation) {
  //TODO Check reservation values

  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader() },
    body: JSON.stringify(reservation),
  };
  return fetch(`${config.API_URL}/api/new-reservation/`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((reservation) => {
      return reservation;
    });
}

function updateReservation(reservation) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader() },
    body: JSON.stringify(reservation),
  };
  return fetch(`${config.API_URL}/api/reservations/${reservation._id}`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((reservation) => {
      return reservation;
    });
}

function deleteReservation(reservation) {
  const requestOptions = {
    method: 'DELETE',
    headers: { ...authHeader() },
  };

  return fetch(`${config.API_URL}/api/reservation/${reservation}`, requestOptions).then(responseHandler.checkResponse);
}
