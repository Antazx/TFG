export const config = {
  API_URL: 'http://localhost:3000',
  MESSAGE: {
    /* PRINTERS */
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

    /* Reservations */
    GET_RESERVATIONS_ERROR: 'Error while retrieving reservations list',

    RESERVATION_CREATED: `Reservation has been created`,
    RESERVATION_CREATED_ERROR: `Error while creating reservation`,

    RESERVATION_UPDATED: `Reservation has been updated`,
    RESERVATION_UPDATED_ERROR: `Error while updating reservation`,

    RESERVATION_DELETED: `Reservation has been deleted`,
    RESERVATION_DELETED_ERROR: `Error while deleting reservation`,

    /* Config */
    GET_CONFIG_ERROR: 'Error while retrieving config',
    UPDATE_CONFIG_ERROR: 'Configuration updated',

    /* User */
    USER_CREATED: 'User has been created',
    USER_CREATED_ERROR: 'Error while creating user',

    USER_DELETED: 'User has been deleted',
    USER_DELETED_ERROR: 'Error while deleting user',

    USER_GET: 'User list updated',
    USER_GET_ERROR: 'Error while retrieving user list',

    USER_UPDATED: 'User has been updated',
    USER_UDPATED_ERROR: 'Error while updating user',
  },
};
