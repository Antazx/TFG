import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './modules/alert-module';
import { users } from './modules/users-module';
import { account } from './modules/account-module';
import { printers } from './modules/printers-module';
import { reservations } from './modules/reservations-module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alert,
    users,
    account,
    printers,
    reservations,
  },
});
