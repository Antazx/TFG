import fs from 'fs';
import Printer from '../models/printer';
import Reservation from '../models/reservation';
import discoveryController from '../controllers/discoveryController';
import printerDiff from '../utils/printerDiff';
import Update from '../models/updates';

const createPrinter = async (req, res, next) => {
  try {
    const { ip, hostname, modelname, information, metadata } = req.body;
    const rndColor = await discoveryController.getRndColor();
    const newPrinter = new Printer({
      ip,
      hostname,
      modelname,
      fromdiscovery: true,
      information,
      metadata,
      created: Date.now(),
      color: rndColor,
      updates: [{ user: res.locals.loggedInUser.email, description: 'Printer created', timestamp: Date.now() }],
    });
    await newPrinter.save();
    res.json(newPrinter);

    const update = new Update({
      printer: newPrinter._id,
      user: res.locals.loggedInUser.email,
      description: 'Printer created',
      timestamp: Date.now(),
    });

    await update.save();
    next();
  } catch (err) {
    next(err);
  }
};

const getPrinters = async (req, res, next) => {
  const printers = await Printer.find();
  res.json(printers);
};

const getOnePrinter = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const printer = await Printer.findOne({ _id });
    if (!printer) return next({ message: 'There is no printer with that id', status: 401 });

    res.json(printer);
  } catch (err) {
    next(err);
  }
};

const updateNewPrinterInfo = async (req, res, next) => {
  try {
    const { ip, hostname, modelname } = req.body;
    await discoveryController.getPrinterInformation(ip, hostname, modelname);
  } catch (err) {
    next(err);
  }
};

const updatePrinterInfo = async (req, res, next) => {
  try {
    const _id = req.params.id;
    let printer = _id === undefined ? req.body : await Printer.findOne({ _id });
    const { ip, hostname, modelname } = printer;
    await discoveryController.getPrinterInformation(ip, hostname, modelname);
    res.json({ message: 'Info has been requested' });
  } catch (err) {
    next(err);
  }
};

const updatePrinterLog = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const printer = await Printer.findOne({ _id });

    if (!printer) return next({ message: 'There is no printer with that id', status: 401 });
    const { ip, hostname, modelname } = printer;
    await discoveryController.getPrinterLog(ip, hostname, modelname);

    res.json({ message: 'Info has been requested' });
  } catch (err) {
    next(err);
  }
};

const deletePrinter = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const printer = await Printer.findOne({ _id });
    await printer.remove();

    await Reservation.deleteMany({ resourceid: _id });
    res.json({ message: 'Resource has been deleted' });
  } catch (err) {
    next(err);
  }
};

const updatePrinter = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const options = { new: true };
    const oldPrinter = await Printer.findById(_id);
    let printer = await Printer.findByIdAndUpdate(_id, req.body, options);
    const changes = printerDiff.getPrinterDiff(oldPrinter, printer);
    res.json(printer);

    if (changes === null) return;

    const update = new Update({
      printer: _id,
      user: res.locals.loggedInUser.email,
      description: changes,
      timestamp: Date.now(),
    });

    await update.save();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const downloadPrinterLog = (req, res, next) => {
  try {
    const { filename, path } = req.params;
    const file = `${path}/${filename}`;

    fs.access(file, fs.F_OK, (err) => {
      if (err) next(err);
      else res.download(file);
    });
  } catch (err) {
    next(err);
  }
};

const getPrinterUpdates = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updates = await Update.find({ printer: _id });
    res.json(updates);
  } catch (error) {
    next(error);
  }
};

const getAllUpdates = async (req, res, next) => {
  try {
    const updates = await Update.find();
    res.json(updates);
  } catch (error) {
    next(error);
  }
};

const printerController = {
  createPrinter,
  updateNewPrinterInfo,
  getPrinters,
  getOnePrinter,
  updatePrinterLog,
  updatePrinterInfo,
  downloadPrinterLog,
  deletePrinter,
  updatePrinter,
  getPrinterUpdates,
  getAllUpdates,
};

export default printerController;
