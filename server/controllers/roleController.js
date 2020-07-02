import AccessControl from 'role-acl';

/**
 * Resources
 */
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
    requester: '$.createdby',
  },
};

const ac = new AccessControl();

/**
 * Basic role allowed operations
 */

ac.grant(BASIC)
  .execute(READ).on(PRINTERS)
  .execute(READ).on(RESERVATIONS)
  .execute(CREATE).on(RESERVATIONS)
  .execute(UPDATE).on(RESERVATIONS).condition(createdByRequester)
  .execute(DELETE).on(RESERVATIONS).condition(createdByRequester)

/**
 * Maintainer role extends Basic and allowed operations
 */
.grant(MAINTAINER).extend(BASIC)
  .execute(CREATE).on(PRINTERS)
  .execute(UPDATE).on(PRINTERS)
  .execute(DELETE).on(PRINTERS)

  .execute(UPDATE).on(RESERVATIONS)
  .execute(DELETE).on(RESERVATIONS)

/**
 * Admin role extends Maintainer and allowed operations
 */
.grant(ADMIN).extend(MAINTAINER)
  .execute(READ).on(USERS)
  .execute(CREATE).on(USERS)
  .execute(UPDATE).on(USERS)
  .execute(DELETE).on(USERS);

const roles = {BASIC, MAINTAINER, ADMIN};
const resources = {PRINTERS, RESERVATIONS, USERS};
const actions = {READ, CREATE, UPDATE, DELETE};
const roleController = {ac, resources, roles, actions};

export default roleController;
