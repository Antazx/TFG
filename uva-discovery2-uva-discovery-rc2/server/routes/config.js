import express from 'express';
import roleController from '../controllers/roleController';
import userController from '../controllers/userController';
import configController from '../controllers/configController';

const router = express.Router();
const CONFIGURATION = roleController.resources.CONFIGURATION;
const { UPDATE } = roleController.actions;

router.get('/', userController.allowIfLoggedIn, configController.getConfig);
router.put('/', userController.grantAccess(UPDATE, CONFIGURATION), configController.updateConfig);

export default router;
