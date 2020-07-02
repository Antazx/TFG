import { authHeader } from '../helpers/authHeader';
import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const userService = { getAllUsers };

function getAllUsers() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/users`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((users) => {
      return users;
    });
}
