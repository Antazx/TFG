import { printerService } from '../../services/printerService';
import { config } from '../../config/config';

const state = {
  loading: false,
  printerList: null,
  selectedPrinters: [],
};
const actions = {
  SOCKET_ALL_PRINTERS_UPDATED({ dispatch, rootState }) {
    if (!rootState.account.status.loggedIn) return;
    dispatch('getPrinters', true);
  },

  SOCKET_ONE_PRINTER_CREATED({ commit, rootState }, data) {
    if (!rootState.account.status.loggedIn) return;
    commit('createPrinterSuccess', data);
  },

  SOCKET_ONE_PRINTER_UPDATED({ commit, rootState }, data) {
    if (!rootState.account.status.loggedIn) return;
    commit('updatePrinterInfo', data);
  },

  SOCKET_ONE_PRINTER_LOG_READY({ commit, rootState }, data) {
    if (!rootState.account.status.loggedIn) return;
    commit('updatePrinterLog', data);
  },

  getPrinters({ dispatch, commit }, onlyInfo) {
    commit('startBasicRequest');
    printerService
      .getAllPrinters()
      .then((printers) => {
        if (onlyInfo) commit('getAllPrintersInfoSuccess', printers);
        else commit('getPrintersSuccess', printers);
        dispatch('alert/success', config.MESSAGE.PRINTER_GET, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('getPrintersFailed');
        dispatch('alert/error', config.MESSAGE.PRINTER_GET_ERROR, {
          root: true,
        });
      });
  },

  createPrinter({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .createPrinter(printer)
      .then((printer) => {
        commit('createPrinterSuccess', printer);
        dispatch('updates/getAllUpdates', null, { root: true });
        dispatch('alert/success', config.MESSAGE.PRINTER_CREATED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.PRINTER_CREATE_ERROR, { root: true });
      });
  },

  deletePrinter({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .deletePrinter(printer._id)
      .then((res) => {
        commit('deletePrinterSuccess', printer);
        dispatch('alert/success', config.MESSAGE.PRINTER_DELETED, { root: true });
        commit('reservations/deletePrinterReservations', printer._id, { root: true });
        dispatch('reservations/getReservations', null, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.PRINTER_DELETED_ERROR, {
          root: true,
        });
      });
  },

  updatePrinter({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .updatePrinter(printer)
      .then((res) => {
        commit('updatePrinterSuccess', res);
        dispatch('updates/getAllUpdates', null, { root: true });
        dispatch('alert/success', config.MESSAGE.PRINTER_UPDATED, {
          root: true,
        });
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.PRINTER_UPDATED_ERROR, {
          root: true,
        });
      });
  },

  getPrinterInfo({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .getPrinterInformation(printer)
      .then((res) => {
        commit('endBasicRequest');
        dispatch('alert/success', config.MESSAGE.INFO_REQUESTED, {
          root: true,
        });
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.INFO_REQUESTED_ERROR, {
          root: true,
        });
      });
  },

  getPrinterLog({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .getPrinterLog(printer)
      .then((res) => {
        commit('endBasicRequest');
        dispatch('alert/success', config.MESSAGE.LOG_REQUESTED, { root: true });
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.LOG_REQUESTED_ERROR, {
          root: true,
        });
      });
  },

  downloadPrinterLog({ dispatch, commit }, log) {
    commit('startBasicRequest');
    printerService
      .downloadPrinterLog(log)
      .then((res) => {
        commit('endBasicRequest');
      })
      .catch(() => {
        commit('downloadPrinterLogFailed', log);
        dispatch('alert/error', config.MESSAGE.LOG_REQUESTED_ERROR, {
          root: true,
        });
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

  getPrintersSuccess(state, printers) {
    state.printerList = printers;
    state.loading = false;
  },

  getAllPrintersInfoSuccess(state, printers) {
    state.printerList.forEach((p, index) => {
      printers.forEach((np) => {
        if (p._id === np._id) state.printerList[index].information = np.information;
      });
    });
    state.loading = false;
  },

  getPrintersFailed(state) {
    state.printerList = [];
    state.loading = false;
  },

  createPrinterSuccess(state, printer) {
    if (state.printerList.findIndex((p) => p._id === printer._id) !== -1) return;
    state.printerList.push(printer);
    state.loading = false;
  },

  deletePrinterSuccess(state, printer) {
    const index = state.printerList.indexOf(printer);
    state.printerList.splice(index, 1);

    const indexSelected = state.selectedPrinters.indexOf(printer);
    if (indexSelected !== -1) state.selectedPrinters.splice(indexSelected, 1);

    state.loading = false;
  },

  setSelectedPrinters(state, selectedPrinters) {
    state.selectedPrinters = selectedPrinters;
  },

  updatePrinterSuccess(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList[index].updates = { ...printerUpdated.updates };
    state.loading = false;
  },

  updatePrinterLog(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList[index].log = printerUpdated.log;
  },

  updatePrinterInfo(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList[index].information = printerUpdated.information;
  },

  downloadPrinterLogFailed(state, log) {
    const index = state.printerList.findIndex((p) => p._id === log.printer);
    const logIndex = state.printerList[index].log.findIndex((l) => l.filename === log.filename);
    state.printerList[index].log.splice(logIndex, 1);
  },

  clearSelectedPrinters(state) {
    state.selectedPrinters = [];
  },
};

const getters = {
  getPrinterById: (state) => {
    return (id) => state.printerList.find((p) => p._id === id);
  },

  countPrinterReservations: (state, getters, rootState) => {
    return (id) => {
      return rootState.reservations.reservationList.filter((r) => r.resourceid === id).length;
    };
  },

  getSelectedReservations(state, getters, rootState) {
    let selectedReservations = [];
    state.selectedPrinters.forEach((printer) => {
      rootState.reservations.reservationList.forEach((reservation) => {
        if (reservation.resourceid === printer._id) selectedReservations.push(reservation);
      });
    });
    return selectedReservations;
  },
};

export const printers = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
