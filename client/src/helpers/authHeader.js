export function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accesstoken) return { 'x-access-token': user.accesstoken, 'Content-Type': 'application/json' };
  return { 'x-access-token': '', 'Content-Type': 'application/json' };
  return null;
}
