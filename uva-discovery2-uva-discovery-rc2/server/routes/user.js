import express from 'express';
import userController from '../controllers/userController';
import roleController from '../controllers/roleController';

const router = express.Router();
const USERS = roleController.resources.USERS;
const { CREATE, READ, UPDATE, DELETE } = roleController.actions;

router.post('/new-user', userController.grantAccess(CREATE, USERS), userController.signup);
//router.post("/new-user", userController.signup);

router.post('/login', userController.login);
router.post('/loginLDAP', userController.loginLDAP);

router.get('/users', userController.allowIfLoggedIn, userController.getAllUsers);
router.get('/users/:id', userController.grantAccess(READ, USERS), userController.getOneUser);
router.put('/users/:id', userController.grantAccess(UPDATE, USERS), userController.updateUser);
router.delete('/users/:id', userController.grantAccess(DELETE, USERS), userController.deleteUser);

export default router;
