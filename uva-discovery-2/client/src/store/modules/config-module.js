import { config } from '../../config/config';
import { configService } from '../../services/configService';

const state = {
  loading: false,
  config: null,
};

const actions = {
  getConfig({ dispatch, commit }) {
    commit('startBasicRequest');
    configService
      .getConfig()
      .then((config) => {
        commit('getConfigSuccess', config);
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.GET_CONFIG_ERROR, { root: true });
      });
  },

  updateConfig({ dispatch, commit }, newConfig) {
    commit('startBasicRequest');
    configService
      .updateConfig(newConfig)
      .then((res) => {
        commit('getConfigSuccess', res);
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.UPDATE_CONFIG_ERROR, { root: true });
      });
  },
};

const mutations = {
  startBasicRequest(state) {
    state.loading = true;
  },

  endBasicRequest(state) {
    state.loading = false;
  },

  getConfigSuccess(state, config) {
    state.config = config;
    state.loading = false;
  },
};

export const configuration = {
  namespaced: true,
  state,
  actions,
  mutations,
};
