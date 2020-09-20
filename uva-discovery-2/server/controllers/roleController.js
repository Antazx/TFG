import AccessControl from 'role-acl';

/**
 * Resources
 */
const CONFIGURATION = 'configuration';
const RESERVATIONS = 'reservations';
const PRINTERS = 'printers';
const USERS = 'users';

/**
 * Roles
 */
const BASIC = 'basic';
const ADMIN = 'admin';
const MAINTAINER = 'maintainer';

/**
 * Actions
 */

const CREATE = 'create';
const READ = 'read';
const UPDATE = 'update';
const DELETE = 'delete';

const createdByRequester = {
  Fn: 'EQUALS',
  args: {
    requester: '$.reservedby',
  },
};

const ac = new AccessControl();

/**
 * Basic role allowed operations
 */

ac.grant(BASIC).execute(READ).on(PRINTERS);
ac.grant(BASIC).execute(READ).on(RESERVATIONS);
ac.grant(BASIC).execute(CREATE).on(RESERVATIONS);
ac.grant(BASIC).condition(createdByRequester).execute(UPDATE).on(RESERVATIONS);
ac.grant(BASIC).condition(createdByRequester).execute(DELETE).on(RESERVATIONS);

/**
 * Maintainer role extends Basic and allowed operations
 */
ac.grant(MAINTAINER)
  .extend(BASIC)
  .execute(CREATE)
  .on(PRINTERS)
  .execute(UPDATE)
  .on(PRINTERS)
  .execute(DELETE)
  .on(PRINTERS)

  .execute(UPDATE)
  .on(RESERVATIONS)
  .execute(DELETE)
  .on(RESERVATIONS)

  /**
   * Admin role extends Maintainer and allowed operations
   */
  .grant(ADMIN)
  .extend(MAINTAINER)
  .execute(READ)
  .on(USERS)
  .execute(CREATE)
  .on(USERS)
  .execute(UPDATE)
  .on(USERS)
  .execute(DELETE)
  .on(USERS)
  .execute(UPDATE)
  .on(CONFIGURATION);

const roles = { BASIC, MAINTAINER, ADMIN };
const resources = { PRINTERS, RESERVATIONS, USERS, CONFIGURATION };
const actions = { READ, CREATE, UPDATE, DELETE };
const roleController = { ac, resources, roles, actions };

export default roleController;
