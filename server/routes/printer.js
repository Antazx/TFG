import express from 'express';
import userController from '../controllers/userController';
import roleController from '../controllers/roleController';
import printerController from '../controllers/printerController';

const router = express.Router();
const PRINTERS = roleController.resources.PRINTERS;
const { CREATE, READ, UPDATE, DELETE } = roleController.actions;

router.post(
  '/new-printer',
  userController.grantAccess(CREATE, PRINTERS),
  printerController.createPrinter,
  printerController.updateNewPrinterInfo
);
router.get('/printers', userController.allowIfLoggedIn, printerController.getPrinters);
router.get('/printers/:id', userController.allowIfLoggedIn, printerController.getOnePrinter);
router.get('/printers/:id/log', userController.allowIfLoggedIn, printerController.updatePrinterLog);
router.get('/printers/:id/update', userController.allowIfLoggedIn, printerController.updatePrinterInfo);
router.get('/printers/download/:path/:filename', userController.allowIfLoggedIn, printerController.downloadPrinterLog);
router.delete('/printers/:id', userController.grantAccess(DELETE, PRINTERS), printerController.deletePrinter);
router.put('/printers/:id', userController.grantAccess(UPDATE, PRINTERS), printerController.updatePrinter);

export default router;
