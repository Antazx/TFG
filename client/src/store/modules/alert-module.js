import { config } from '../../config/config';

const state = {
  type: null,
  message: null,
  show: false,
};

const actions = {
  success({ commit }, message) {
    commit('success', message);
    setTimeout(() => {
      commit('clear');
    }, config.ALERT_TIMEOUT);
  },
  error({ commit }, message) {
    commit('error', message);
    setTimeout(() => {
      commit('clear');
    }, config.ALERT_TIMEOUT);
  },
  info({ commit }, message) {
    commit('error', message);
    setTimeout(() => {
      commit('clear');
    }, config.ALERT_TIMEOUT);
  },
  warning({ commit }, message) {
    commit('error', message);
    setTimeout(() => {
      commit('clear');
    }, config.ALERT_TIMEOUT);
  },
  clear({ commit }) {
    commit('clear');
  },
};

const mutations = {
  success(state, message) {
    state.show = true;
    state.type = 'success';
    state.message = message;
  },
  error(state, message) {
    state.show = true;
    state.type = 'error';
    state.message = message;
  },
  info(state, message) {
    state.show = true;
    state.type = 'info';
    state.message = message;
  },
  warning(state, message) {
    state.show = true;
    state.type = 'warning';
    state.message = message;
  },
  clear(state) {
    state.show = false;
    state.type = null;
    state.message = null;
  },
};

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations,
};
