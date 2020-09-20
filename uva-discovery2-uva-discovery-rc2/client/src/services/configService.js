import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';
import { authHeader } from '../helpers/authHeader';

export const configService = { getConfig, updateConfig };

function getConfig() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/config`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((config) => {
      return config;
    });
}

function updateConfig(newConfig) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(newConfig),
  };

  return fetch(`${config.API_URL}/config`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((config) => {
      return config;
    });
}
