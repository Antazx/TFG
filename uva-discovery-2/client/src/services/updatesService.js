import { authHeader } from '../helpers/authHeader';
import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const updatesService = {
  getPrinterUpdates,
  getAllUpdates,
};

function getAllUpdates() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/updates/`, requestOptions).then(responseHandler.checkResponse);
}

function getPrinterUpdates(printer) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/updates/${printer._id}`, requestOptions).then(responseHandler.checkResponse);
}
