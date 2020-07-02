import Printer from '../models/printer';
import Reservation from '../models/reservation';
import discoveryController from '../controllers/discoveryController';

const createPrinter = async (req, res, next) => {
  try {
    const { ip, hostname, modelname, information, metadata } = req.body;
    const newPrinter = new Printer({
      ip,
      hostname,
      modelname,
      fromdiscovery: true,
      information,
      metadata,
      created: Date.now(),
    });
    await newPrinter.save();
    res.json(newPrinter);
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
  //TODO Comprobar que no hay error y borrar sus reservas
  try {
    const _id = req.params.id;
    await Printer.findOneAndDelete({ _id });
    await Reservation.deleteMany({ resourceid: _id });
    res.json({ message: 'Resource has been deleted' });
  } catch (err) {
    next(err);
  }
};
const updatePrinter = async (req, res, next) => {
  //TODO Check request values
  try {
    const _id = req.params.id;
    const options = { new: true };
    const printer = await Printer.findByIdAndUpdate(_id, req.body, options);
    res.json(printer);
  } catch (err) {
    next(err);
  }
};

const downloadPrinterLog = (req, res, next) => {
  try {
    const { filename, path } = req.params;
    const file = `${path}/${filename}`;
    res.download(file);
  } catch (err) {
    next(err);
  }
};

const printerController = {
  createPrinter,
  getPrinters,
  getOnePrinter,
  updateNewPrinterInfo,
  updatePrinterInfo,
  updatePrinterLog,
  deletePrinter,
  updatePrinter,
  downloadPrinterLog,
};

export default printerController;
