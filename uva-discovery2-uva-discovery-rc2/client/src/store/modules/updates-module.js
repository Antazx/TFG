import { updatesService } from '../../services/updatesService';
const state = {
  loading: false,
  updatesList: null,
};
const actions = {
  getAllUpdates({ commit }) {
    commit('startBasicRequest');
    updatesService
      .getAllUpdates()
      .then((updates) => {
        commit('getAllUpdatesSuccess', updates);
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
      });
  },
  getPrinterUpdates({ commit }, printer) {
    commit('startBasicRequest');
    updatesService
      .getUpdates(printer)
      .then((updates) => {
        commit('getUpdatesSuccess', updates);
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
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
  getAllUpdatesSuccess(state, updates) {
    state.updatesList = updates;
    state.loading = false;
  },

  getOnePrinterUpdatesSuccess(state, updates) {
    state.updatesList.find;
  },
};

const getters = {
  getPrinterUpdates: (state) => {
    return (id) => state.updatesList.filter((u) => u.printer === id);
  },
};

export const updates = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
