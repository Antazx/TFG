import ffi from 'ffi-napi';
import ref from 'ref-napi';
import xmljs from 'xml-js';

import log from '../utils/logger';
import logHandler from '../utils/logHandler';
import printerDiff from '../utils/printerDiff';

import Updates from '../models/updates';
import Printer from '../models/printer';
import Configuration from '../models/configuration';

import discoveryAdapter from '../HPDiscoveryV3.1/discoveryAdapter';
import config from '../config/config';
import Update from '../models/updates';

const logger = log.logger;
const FROM = { label: 'dicoveryController.js' };
const ADAPTER = { label: 'discoveryAdapter.js' };
const SOCKETS = { label: 'SocketConnection' };

let updateInterval = null;
let socketInstance = null;
let notifySocket = true;

const setSocket = (socket) => {
  socketInstance = socket;
};

const setUpdateInterval = (updateTimer) => {
  logger.info(`update interval every ${updateTimer}ms`, FROM);
  if (updateInterval !== null) clearInterval(updateInterval);
  updateInterval = setInterval(() => autoUpdateAllPrinters(), updateTimer);
};

const start = (updateTimer) => {
  let res = discoveryAdapter.initDiscovery();
  logger.info(`HPDiscoveryInit returns ${res}`, FROM);

  Promise.all([
    discoveryAdapter.suscribeLog(logCallback),
    discoveryAdapter.suscribeInformation(informationCallback),
    discoveryAdapter.suscribeDiscovery(subscriptionCallback),
  ])
    .then(() => {
      setUpdateInterval(updateTimer);
      if (socketInstance !== null) initSockets();
    })
    .catch((err) => {
      logger.error(`Error running suscriptions: ${err}`, FROM);
      process.exit(2);
    });
};

const end = () => {
  discoveryAdapter.terminateDiscovery().catch((err) => {
    logger.error(`Error running initDiscovery: ${err}`, ADAPTER);
  });
};

const getPrinterInformation = async (ip, hostName, modelName) => {
  notifySocket = true;
  await Printer.countDocuments({ hostname: hostName, fromdiscovery: true }, (err, count) => {
    if (err) {
      logger.error(`BD error: ${err}`, FROM);
      return 1;
    }
    if (count === 1)
      discoveryAdapter
        .getPrinterInformation(ip, hostName, modelName)
        .then((res) => {
          logger.info(`Updated printer info: ${ip}, ${hostName}, ${modelName} with code: ${res}`, FROM);
          return 0;
        })
        .catch((err) => {
          logger.error(`Error running getPrinterInformation: ${err}`, ADAPTER);
          return 1;
        });
  });
};

const getPrinterLog = async (ip, hostName, modelName) => {
  await Printer.countDocuments({ hostname: hostName, fromdiscovery: true })
    .then((count) => {
      if (count === 1) return discoveryAdapter.getPrinterLog(ip, hostName, modelName);
    })
    .then((res) => {
      logger.info(`Updated printer log: ${ip}, ${hostName}, ${modelName} with code: ${res}`, FROM);
      return 0;
    })
    .catch((err) => {
      logger.error(`Error running getPrinterLog: ${err}`, ADAPTER);
      return 1;
    });
};

const initSockets = () => {
  socketInstance.on('connection', (socket) => {
    logger.info(`Client connected to sockets`, SOCKETS);

    socket.on(config.SOCKETS.REQUEST_PRINTER_INFO, (printer) => {
      const { ip, hostname, modelname } = printer;
      notifySocket = true;
      getPrinterInformation(ip, hostname, modelname);
    });

    socket.on(config.SOCKETS.REQUEST_PRINTER_LOG, (printer) => {
      const { ip, hostname, modelname } = printer;
      getPrinterLog(ip, hostname, modelname);
    });
  });
};

const autoUpdateAllPrinters = () => {
  console.time('[discoveryController.js] info: autoUpdateAllPrinters took: ');
  notifySocket = false;
  Printer.find()
    .then(async (printerList) => {
      await deleteOldPrinters();
      return Promise.all(
        printerList.map((p) => {
          return discoveryAdapter.getPrinterInformation(p.ip, p.hostname, p.modelname);
        })
      );
    })
    .then(() => {
      console.timeEnd(`[discoveryController.js] info: autoUpdateAllPrinters took: `);
      socketInstance.emit(config.SOCKETS.ALL_PRINTERS_UPDATED);
    })
    .catch((err) => {
      logger.error(`Error running autoUpdateAllPrinters ${err}`, FROM);
    });
};

const cstringPtr = ref.refType('CString');
const voidPtr = ref.refType('void');

const xmlOptions = {
  compact: true,
  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreComment: true,
  ignoreCdata: true,
  ignoreDoctype: true,
};

/**
 * Callback function to execute by HPDiscoverySubscribe
 *
 * @param {*} userData void pointer to be used in case of working with objects.
 * @param {*} xmlPrinter
 * @param {*} xmlLenght
 */

const handleSuscription = async (userData, xmlPrinter, xmlLenght) => {
  try {
    let printerJS = xmljs.xml2js(xmlPrinter.readCString(), xmlOptions).Printer._attributes;
    let rndColor = await getRndColor();

    const filter = { hostname: printerJS.hostname };
    const count = await Printer.countDocuments(filter);
    if (count !== 0) return;

    const update = {
      ip: printerJS.ip,
      modelname: printerJS.modelname,
      created: Date.now(),
      color: rndColor,
      fromdiscovery: true,
    };
    const options = {
      new: true,
      upsert: true,
      runValidators: true,
      context: 'query',
    };

    const doc = await Printer.findOneAndUpdate(filter, update, options);
    socketInstance.emit(config.SOCKETS.ONE_PRINTER_CREATED, doc);

    const change = new Update({
      printer: doc._id,
      user: 'system',
      description: 'Printer created',
      timestamp: Date.now(),
    });

    await change.save();
  } catch (error) {
    logger.error('handleSuscription error: ' + error, FROM);
  }
};

/**
 * Callback function to execute by HPPrinterInformationSubscribe, parse XML to
 * JSON, check status atributte, alerts list and update document on BD
 *
 * @param {*} userData void pointer to be used in case of working with objects.
 * @param {*} xmlPrinterInfo
 * @param {*} xmlLenght
 */
const handleInformation = async (userData, xmlPrinterInfo, xmlLenght) => {
  try {
    let printerInfo = xmljs.xml2js(xmlPrinterInfo.readCString(), xmlOptions).PrinterInformation;
    let alerts =
      printerInfo.Alerts !== undefined && printerInfo.Alerts.Alert !== undefined
        ? getAlerts(printerInfo.Alerts.Alert)
        : [];
    let update =
      printerInfo.status._text === 'Unreachable'
        ? { information: { status: printerInfo.status._text } }
        : {
            updated: Date.now(),
            information: {
              status: printerInfo.status._text,
              firmwareversion: printerInfo.firmwareVersion._text,
              partnumber: printerInfo.partNumber._text,
              printertype: printerInfo.printerType._text,
              alerts: alerts,
            },
          };

    const filter = { hostname: printerInfo._attributes.hostname };
    const oldPrinter = await Printer.findOne(filter);
    const options = { new: true, upsert: false };
    const doc = await Printer.findOneAndUpdate(filter, update, options);

    const changes = printerDiff.getPrinterDiff(oldPrinter, doc);
    if (changes === null) return;
    const change = new Updates({ printer: doc._id, user: 'system', description: changes, timestamp: Date.now() });
    await change.save();
    if (notifySocket) socketInstance.emit(config.SOCKETS.ONE_PRINTER_UPDATED, doc);
  } catch (err) {
    logger.error('handleInformation error: ' + err, FROM);
  }
};

/**
 * Callback function to execute by HPPrinterLogFileSubscribe
 *
 * @param {*} userData void pointer to be used in case of working with objects.
 * @param {*} xmlPrinterLog
 * @param {*} xmlLenght
 */
const handleLog = async (userData, xmlPrinterLog, xmlLenght) => {
  try {
    let printerLog = xmljs.xml2js(xmlPrinterLog.readCString(), xmlOptions).PrinterLogFileInformation;

    if (printerLog.status._text === 'PRINTER_NOT_FOUND') {
      logger.error(`(handleLog) Printer not found`, FROM);
      return;
    }

    const filter = { hostname: printerLog._attributes.hostname };
    const update = {
      updated: Date.now(),
      $push: {
        log: {
          status: printerLog.status._text,
          path: printerLog.path._text,
          filename: printerLog.filename._text,
          timestamp: printerLog.timestamp._text,
        },
      },
    };
    const options = { new: true, upsert: false };

    const conf = await Configuration.findOne();
    const doc = await Printer.findOneAndUpdate(filter, update, options);
    if (doc.log.length > conf.server.discovery.maxPrinterLogs) logHandler.deleteOldLogFiles(doc);

    socketInstance.emit(config.SOCKETS.ONE_PRINTER_LOG_READY, doc);
  } catch (err) {
    logger.error('handleLog error: ' + err, FROM);
  }
};

const subscriptionCallback = ffi.Callback('void', [voidPtr, cstringPtr, 'int'], handleSuscription);
const informationCallback = ffi.Callback('void', [voidPtr, cstringPtr, 'int'], handleInformation);
const logCallback = ffi.Callback('void', [voidPtr, cstringPtr, 'int'], handleLog);

const getAlerts = (alertObject) => {
  let alertList = [];
  Array.isArray(alertObject)
    ? (alertList = alertObject.map((alert) => {
        return alert._text;
      }))
    : alertList.push(alertObject._text);
  return alertList;
};

const deleteOldPrinters = async () => {
  try {
    const conf = await Configuration.findOne();
    const expiresIn = conf.server.discovery.printerExpires;
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() - expiresIn);

    const filter = { updated: { $lte: expireTime } };
    await Printer.deleteMany(filter);
  } catch (err) {
    logger.error(`deleteOldPrinters failed ${err}`, FROM);
  }
};

const getRndColor = async () => {
  const config = await Configuration.findOne();
  const rndIndex = Math.floor(config.client.colors.length * Math.random());
  return config.client.colors[rndIndex];
};

export default { start, end, getPrinterInformation, getPrinterLog, setSocket, getRndColor, setUpdateInterval };
