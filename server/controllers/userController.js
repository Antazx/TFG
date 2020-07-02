import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import log from '../utils/logger';
import User from '../models/users';
import ldapConnection from '../utils/ldapConnection';
import roleController from './roleController';
import Reservation from '../models/reservation';

const logger = log.logger;
const FROM = { label: 'userController.js' };

const ac = roleController.ac;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const signup = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword, role });
    const accessToken = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    newUser.accesstoken = accessToken;
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    next(err);
  }
};

const loginLDAP = async (req, res, next) => {
  const { email, password } = req.body;
  ldapConnection(email, password)
    .then((result) => {
      logger.info(`LDAP login success: ${result}`, FROM);
      res.json(result);
    })
    .catch((err) => {
      logger.error(`LDAP login failed: ${err}`, FROM);
      return next(err);
    });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return next({ message: 'There is no user with that email', status: 401 });

    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next({ message: 'Wrong password', status: 401 });

    const accesstoken = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    user.lastlogin = Date.now();
    user.accesstoken = accesstoken;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.json(users);
};

const getOneUser = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    if (!user) {
      //Si no existe en BD LDAP??

      let error = new Error('There is no user with that id');
      error.status = 401;
      logger.error(error, FROM);
      return next(error);
    }

    res.json(user);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) req.body.password = await hashPassword(req.body.password);
    const update = req.body;
    const _id = req.params.id;
    const options = { new: true };
    const user = await User.findByIdAndUpdate(_id, update, options);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const _id = req.params.id;
    await User.findOneAndDelete({ _id });
    res.json({ message: 'User has been deleted' });
  } catch (err) {
    next(err);
  }
};

const allowIfLoggedIn = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) return res.status(401).json({ error: 'You need to be logged in to acces this route' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const role = req.body.requesterRole;
      const permission = await ac.can(role).execute(action).on(resource);
      logger.info(`${role} want to ${action} on ${resource}, [allow:${permission.granted}]`, FROM);
      if (!permission.granted) return res.status(401).json({ error: 'Action denied, check your permissions' });
      next();
    } catch (err) {
      next(err);
    }
  };
};

const grantAccessOrOwn = (action, resource) => {
  return async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;
      const requester = user._id + '';
      const role = req.body.requesterRole;

      const _id = req.params.id;
      const reservation = await Reservation.findById(_id);
      const createdby = reservation.createdby + '';

      const permission = await ac
        .can(role)
        .context({ requester: requester, createdby: createdby })
        .execute(action)
        .on(resource);

      logger.info(`requester: ${user._id} createdby: ${reservation.createdby}`, FROM);
      logger.info(`${user.email} want to ${action} on ${_id} with ${role}, [allow:${permission.granted}]`, FROM);

      if (!permission.granted) return res.status(401).json({ error: 'Action denied, check your permissions' });

      next();
    } catch (err) {
      next(err);
    }
  };
};

const userController = {
  signup,
  login,
  loginLDAP,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  allowIfLoggedIn,
  grantAccess,
  grantAccessOrOwn,
};
export default userController;
