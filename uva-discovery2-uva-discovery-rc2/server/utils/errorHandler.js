import log from '../utils/logger';

const logger = log.logger;

export default function errorHandler(err, req, res, next) {
  logger.error(`${JSON.stringify(err)}`, { label: 'ErrorHandler' });
  res.status(err.status || 500).send({ error: err.message });
}
