export const config = {
  API_URL: 'http://localhost:3000',
  ALERT_TIMEOUT: 5000,
  MESSAGE: {
    PRINTER_CREATED: `Printer has been created`,
    PRINTER_CREATE_ERROR: `Error while creating printer`,

    PRINTER_UPDATED: `Printer has been updated`,
    PRINTER_UPDATED_ERROR: `Error while updaing printer`,

    PRINTER_DELETED: `Printer has been deleted`,
    PRINTER_DELETED_ERROR: `Error while deleting printer`,

    PRINTER_GET: `Printer list updated`,
    PRINTER_GET_ERROR: `Error while retrieving printer list`,

    INFO_REQUESTED: 'Info has been requested',
    INFO_REQUESTED_ERROR: 'Error while retrieving printer info',

    LOG_REQUESTED: 'Log has been requested',
    LOG_REQUESTED_ERROR: 'Error while retrieving printer log',

    RESERVATION_CREATED: `Reservation has been created`,
    RESERVATION_UPDATED: `Reservation has been updated`,
    RESERVATION_DELETED: `Reservation has been deleted`,
  },
  DEFAULT_HOURS: 2,
  SOCKETS: {
    REQUEST_PRINTER_INFO: 'REQUEST_PRINTER_INFO',
    REQUEST_PRINTER_LOG: 'REQUEST_PRINTER_LOG',
  },
};
