import jwt from 'jsonwebtoken';
import User from '../models/users';

export default async function (req, res, next) {
  try {
    if (!req.headers['x-access-token'] || req.headers['x-access-token'] === '') next();

    const accessToken = req.headers['x-access-token'];
    const { _id, role } = jwt.verify(accessToken, process.env.JWT_SECRET);

    res.locals.loggedInUser = await User.findById(_id);
    req.body.requesterRole = role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return next({ message: 'Session has expired, please login again', status: 401 });
  }
}
