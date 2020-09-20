import history from 'connect-history-api-fallback';
import SocketServer from 'socket.io';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import http from 'http';
import fs from 'fs';

import log from './utils/logger';
import checkJWT from './utils/checkJWT';
import errorHandler from './utils/errorHandler';
import dbConnection from './utils/dbConnection';
import userRoutes from './routes/user';
import configRoutes from './routes/config';
import printerRoutes from './routes/printer';
import updateRoutes from './routes/updates';
import reservationRoutes from './routes/reservation';

import discoveryController from './controllers/discoveryController';

const logger = log.logger;
const FROM = { label: 'index.js' };

dbConnection
  .startDB()
  .then((CONFIG) => {
    logger.info(`App config: ${CONFIG}`, FROM);

    if (process.env.NODE_ENV !== 'production') {
      dotenv.config({ path: path.join(__dirname, './.env') });
    }

    const app = express();
    app.set('port', process.env.PORT || 3000);
    app.set('updateFrequency', CONFIG.server.discovery.updateFrecuency || 60000);

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
    app.use('/api', updateRoutes);
    app.use('/config', configRoutes);

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
  })
  .catch((err) => {
    logger.error(err, FROM);
    process.exit(1);
  });

process.on('exit', (code) => {
  discoveryController.end();
  logger.info(`About to exit with code: ${code}`, FROM);
});
