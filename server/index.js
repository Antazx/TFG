import SocketServer from 'socket.io';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import http from 'http';
import fs from 'fs';

import log from './utils/logger';
import config from './config/config';
import userRoutes from './routes/user';
import checkJWT from './utils/checkJWT';
import printerRoutes from './routes/printer';
import errorHandler from './utils/errorHandler';
import reservationRoutes from './routes/reservation';
import discoveryController from './controllers/discoveryController';

const logger = log.logger;
const FROM = { label: 'index.js' };

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, './.env') });
}

logger.info(`Server started: PORT = ${process.env.PORT}`, FROM);

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('updateFrequency', config.DISCOVERY.UPDATE_FRECUENCY || 60000);

const dbUri = 'mongodb://localhost:27017/hpdiscovery';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose
  .connect(dbUri, dbOptions)
  .then(
    () => {
      logger.info(`DB connected to: ${dbUri}`, FROM);
    },
    (error) => {
      logger.error(`DB error: ${error}`, FROM);
      process.exit(1);
    }
  )
  .then();

const accessLogStream = fs.createWriteStream(path.join('./logs/filelog-access.log'), {
  flags: 'a',
});
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkJWT);

app.use('/api', printerRoutes);
app.use('/api', reservationRoutes);
app.use('/api', userRoutes);

const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

const server = http.createServer(app).listen(app.get('port'), () => {
  logger.info(`Server listen on http://localhost:${app.get('port')}`, FROM);
});

const io = new SocketServer(server);
discoveryController.setSocket(io);
discoveryController.start(app.get('updateFrequency'));
logger.info(`Discovery started: UPDATE_FRECUENCY = ${app.get('updateFrequency')}`, FROM);

process.on('exit', (code) => {
  discoveryController.end();
  logger.info(`About to exit with code: ${code}`, FROM);
});
