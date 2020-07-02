import { createLogger, format, transports } from "winston";
const { timestamp, printf, json } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}][${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: format.combine(timestamp(), json(), myFormat),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: "./logs/filelog-error.log",
      level: "error",
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: "./logs/filelog-combined.log",
      level: "info",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({ level: "debug" }));
}

export default { logger };
