const state = {
  type: null,
  message: null,
  show: false,
};

const actions = {
  success({ commit, rootState }, message) {
    commit('success', message);
    let timer = 5000;
    if (rootState.configuration.config) timer = rootState.configuration.config.client.alertTimeout;

    setTimeout(() => {
      commit('clear');
    }, timer);
  },
  error({ commit, rootState }, message) {
    commit('error', message);
    let timer = 5000;
    if (rootState.configuration.config) timer = rootState.configuration.config.client.alertTimeout;

    setTimeout(() => {
      commit('clear');
    }, timer);
  },
  info({ commit, rootState }, message) {
    commit('error', message);
    let timer = 5000;
    if (rootState.configuration.config) timer = rootState.configuration.config.client.alertTimeout;

    setTimeout(() => {
      commit('clear');
    }, timer);
  },
  warning({ commit, rootState }, message) {
    commit('error', message);
    let timer = 5000;
    if (rootState.configuration.config) timer = rootState.configuration.config.client.alertTimeout;

    setTimeout(() => {
      commit('clear');
    }, timer);
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
