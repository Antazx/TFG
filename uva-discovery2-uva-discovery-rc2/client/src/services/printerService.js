import { authHeader } from '../helpers/authHeader';
import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const printerService = {
  getPrinterLog,
  getAllPrinters,
  createPrinter,
  deletePrinter,
  updatePrinter,
  getPrinterInformation,
  downloadPrinterLog,
};

function createPrinter(printer) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(printer),
  };

  return fetch(`${config.API_URL}/api/new-printer`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((printer) => {
      return printer;
    });
}

function deletePrinter(printerId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/printers/${printerId}`, requestOptions).then(responseHandler.checkResponse);
}

function getAllPrinters() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/printers`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((printers) => {
      return printers;
    });
}

function updatePrinter(printer) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(printer),
  };

  return fetch(`${config.API_URL}/api/printers/${printer._id}`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((printer) => {
      return printer;
    });
}

function getPrinterInformation(printer) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/printers/${printer._id}/update`, requestOptions).then(
    responseHandler.checkResponse
  );
}

function getPrinterLog(printer) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/printers/${printer._id}/log`, requestOptions).then(responseHandler.checkResponse);
}

function downloadPrinterLog(log) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
    responseTresponseType: 'arraybuffer',
  };

  return fetch(`${config.API_URL}/api/printers/download/${log.path}${log.filename}`, requestOptions).then((res) =>
    responseHandler.downloadResponse(res, log.filename)
  );
}
