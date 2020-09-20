import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import log from '../utils/logger';
import User from '../models/users';
import config from '../config/config';
import Configuration from '../models/configuration';

const logger = log.logger;
const FROM = { label: 'dbConnection.js' };
const dbUri = config.MONGODB.DB_URI;
const dbOptions = config.MONGODB.DB_OPTIONS;

const startDB = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(dbUri, dbOptions)
      .then(() => {
        logger.info(`DB connected to: ${dbUri}`, FROM);
        return Configuration.countDocuments();
      })
      .then((count) => {
        if (count === 0) createDefaultConfig();
        return User.countDocuments();
      })
      .then((count) => {
        if (count === 0) createDefaultAdmin();
        return Configuration.findOne();
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        logger.error(`DB error: ${err}`, FROM);
        reject();
      });
  });
};

const createDefaultConfig = async () => {
  const defaultConfig = new Configuration({
    server: {
      discovery: {
        updateFrecuency: config.DISCOVERY.UPDATE_FRECUENCY,
        printerExpires: config.DISCOVERY.PRINTERS_DAY_EXPIRES,
        maxPrinterLogs: config.DISCOVERY.MAX_PRINTER_LOGS,
      },
      ldap: {
        url: config.LDAP.URL,
        adminUsername: config.LDAP.LDAP_ADMIN_USERNAME,
        adminPassword: config.LDAP.LDAP_ADMIN_PASSWORD,
      },
    },
    client: {
      colors: config.CLIENT.COLORS,
      status: config.CLIENT.STATUS,
      printerTypes: config.CLIENT.PRINTERTYPES,
      alertTimeout: config.CLIENT.ALERT_TIMEOUT,
      defaultHours: config.CLIENT.DEFAULT_HOURS,
      calendarStartHour: config.CLIENT.CALENDAR_START_HOUR,
      calendarEndHour: config.CLIENT.CALENDAR_END_HOUR,
    },
  });
  await defaultConfig.save();
};

const createDefaultAdmin = async () => {
  const defaultAdmin = new User(config.DEFAULT_ADMIN);
  defaultAdmin.password = await bcrypt.hash(config.DEFAULT_ADMIN.password, 10);
  await defaultAdmin.save();
};

const dbConnection = { startDB };

export default dbConnection;
