import { authHeader } from '../helpers/authHeader';
import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const userService = { getAllUsers, createUser, updateUser, deleteUser };

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

function createUser(user) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(user),
  };

  return fetch(`${config.API_URL}/api/new-user`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((user) => {
      return user;
    });
}

function updateUser(user) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(user),
  };

  return fetch(`${config.API_URL}/api/users/${user._id}`, requestOptions)
    .then(responseHandler.checkResponse)
    .then((user) => {
      return user;
    });
}

function deleteUser(user) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  };

  return fetch(`${config.API_URL}/api/users/${user._id}`, requestOptions).then(responseHandler.checkResponse);
}
