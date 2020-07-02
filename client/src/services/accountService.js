import responseHandler from '../helpers/responseHandler';
import { config } from '../config/config';

export const accountService = { login, logout };

function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-access-token': '' },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${config.API_URL}/api/login`, requestOptions)
    .then(responseHandler.loginHandler)
    .then((user) => {
      if (user.accesstoken) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
}

function logout() {
  localStorage.removeItem('user');
}
