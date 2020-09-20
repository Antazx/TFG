import express from 'express';
import userController from '../controllers/userController';
import printerController from '../controllers/printerController';

const router = express.Router();

router.get('/updates', userController.allowIfLoggedIn, printerController.getAllUpdates);
router.get('/updates/:id', userController.allowIfLoggedIn, printerController.getPrinterUpdates);

export default router;
