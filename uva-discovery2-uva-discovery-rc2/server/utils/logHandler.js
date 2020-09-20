import fs from 'fs';
import log from '../utils/logger';
import config from '../config/config';

const logger = log.logger;
const FROM = { label: 'logHandler.js' };

//Rename to printerLogHandler
const deleteOldLogFiles = async (printer) => {
  try {
    for (let i = printer.log.length - 1; i > config.DISCOVERY.MAX_PRINTER_LOGS - 1; i--) {
      const { path, filename } = printer.log.shift();
      fs.unlink(`${path}${filename}`, (err) => {
        if (err) logger.error(`Error while deleting printer log ${err}`, FROM);
      });
    }
    await printer.save();
  } catch (err) {
    logger.error(`Error while deleting printer log ${err}`, FROM);
  }
};

const deleteAllLogFiles = async (printer) => {
  try {
    printer.log.forEach((log) => {
      fs.unlink(`${log.path}${log.filename}`, (err) => {
        if (err) logger.error(`Error while deleting printer log ${err}`, FROM);
      });
    });
  } catch (err) {
    logger.error(`Error while deleting printer log ${err}`, FROM);
  }
};

const logHandler = { deleteOldLogFiles, deleteAllLogFiles };
export default logHandler;
