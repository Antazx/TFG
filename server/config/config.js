export default {
  SOCKETS: {
    ONE_PRINTER_CREATED: 'ONE_PRINTER_CREATED',
    ONE_PRINTER_UPDATED: 'ONE_PRINTER_UPDATED',
    ONE_PRINTER_LOG_READY: 'ONE_PRINTER_LOG_READY',
    ALL_PRINTERS_UPDATED: 'ALL_PRINTERS_UPDATED',
    REQUEST_PRINTER_LOG: 'REQUEST_PRINTER_LOG',
    REQUEST_PRINTER_INFO: 'REQUEST_PRINTER_INFO',
  },
  MONGODB: {},
  SERVER: {},
  DISCOVERY: {
    UPDATE_FRECUENCY: 60000,
    PRINTERS_EXPIRES: '3d',
    MAX_PRINTER_LOGS: 5,
  },
  LDAP: {
    URL: 'ldap://ldap.forumsys.com:389',
  },
};
