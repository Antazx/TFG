export default {
  SOCKETS: {
    ONE_PRINTER_CREATED: 'ONE_PRINTER_CREATED',
    ONE_PRINTER_UPDATED: 'ONE_PRINTER_UPDATED',
    ONE_PRINTER_LOG_READY: 'ONE_PRINTER_LOG_READY',
    ALL_PRINTERS_UPDATED: 'ALL_PRINTERS_UPDATED',
    REQUEST_PRINTER_LOG: 'REQUEST_PRINTER_LOG',
    REQUEST_PRINTER_INFO: 'REQUEST_PRINTER_INFO',
  },
  MONGODB: {
    DB_URI: 'mongodb://localhost:27017/hpdiscovery',
    DB_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  DEFAULT_ADMIN: {
    name: 'Admin',
    email: 'admin@email.com',
    password: 'admin',
    role: 'admin',
  },
  DISCOVERY: {
    UPDATE_FRECUENCY: 60000,
    PRINTERS_DAY_EXPIRES: 1,
    MAX_PRINTER_LOGS: 5,
  },
  LDAP: {
    URL: 'ldap://ldap.forumsys.com:389',
    LDAP_ADMIN_USERNAME: 'cn=read-only-admin,dc=example,dc=com',
    LDAP_ADMIN_PASSWORD: 'password',
  },
  CLIENT: {
    COLORS: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    STATUS: [
      { text: 'Online', color: 'success' },
      { text: 'Awake', color: 'light-green accent-3' },
      { text: 'Sleep', color: 'blue-grey' },
      { text: 'Unreachable', color: 'error' },
      { text: 'Turn off', color: 'red lighten-1' },
      { text: 'With alerts', color: 'yellow lighten-2' },
      { text: 'Busy with activities', color: 'yellow accent-4' },
      { text: 'With system errors', color: 'deep-orange lighten-1' },
      { text: 'Not initialized', color: 'pink accent-3' },
      { text: 'Unknown', color: 'grey' },
    ],
    PRINTERTYPES: ['Printer LP1', 'Printer LP2', 'Printer PP1', 'Printer PP2', 'Virtual', 'Docker', 'PC-Target'],
    DEFAULT_HEADERS: [],
    ALERT_TIMEOUT: 5000,
    DEFAULT_HOURS: 2,
    CALENDAR_START_HOUR: 6,
    CALENDAR_END_HOUR: 22,
  },
};
