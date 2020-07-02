import { printerService } from '../../services/printerService';
import { config } from '../../config/config';

const state = {
  loading: false,
  printerList: [],
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
        console.log(err);
        commit('getPrintersFailed');
        dispatch('alert/error', config.MESSAGE.PRINTER_GET_ERROR, { root: true });
      });
  },

  createPrinter({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .createPrinter(printer)
      .then((printer) => {
        commit('createPrinterSuccess', printer);
        dispatch('alert/success', config.MESSAGE.PRINTER_CREATED, { root: true });
      })
      .catch((err) => {
        console.log(err);
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
        dispatch('reservations/deletePrinterReservations', printer._id, { root: true });
      })
      .catch((err) => {
        console.log(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.PRINTER_DELETED_ERROR, { root: true });
      });
  },

  updatePrinter({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .updatePrinter(printer)
      .then((res) => {
        commit('endBasicRequest');
        dispatch('alert/success', config.MESSAGE.PRINTER_UPDATED, { root: true });
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.PRINTER_UPDATED_ERROR, { root: true });
      });
  },

  getPrinterInfo({ dispatch, commit }, printer) {
    commit('startBasicRequest');
    printerService
      .getPrinterInformation(printer)
      .then((res) => {
        commit('endBasicRequest');
        dispatch('alert/success', config.MESSAGE.INFO_REQUESTED, { root: true });
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.INFO_REQUESTED_ERROR, { root: true });
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
        dispatch('alert/error', config.MESSAGE.LOG_REQUESTED_ERROR, { root: true });
      });
  },

  downloadPrinterLog({ dispatch, commit }, log) {
    commit('startBasicRequest');
    printerService
      .downloadPrinterLog(log)
      .then((res) => {
        commit('endBasicRequest');
      })
      .catch((err) => {
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
    state.loading = false;
  },

  setSelectedPrinters(state, selectedPrinters) {
    state.selectedPrinters = selectedPrinters;
  },

  updatePrinter(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList.splice(index, 1, printerUpdated);
  },

  updatePrinterLog(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList[index].log = printerUpdated.log;
  },

  updatePrinterInfo(state, printerUpdated) {
    const index = state.printerList.findIndex((p) => p._id === printerUpdated._id);
    state.printerList[index].information = printerUpdated.information;
  },

  clearSelectedPrinters(state) {
    state.selectedPrinters = [];
  },
};
const getters = {
  getPrinterById: (state) => {
    return (id) => state.printerList.find((p) => p._id === id);
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
