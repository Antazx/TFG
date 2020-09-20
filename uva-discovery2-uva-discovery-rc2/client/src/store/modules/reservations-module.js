import { reservationService } from '../../services/reservationService';
import { config } from '../../config/config';

const state = {
  loading: false,
  reservationList: null,
  selectedReservation: null,
};

const actions = {
  getReservations({ commit }) {
    commit('getReservationsRequest');
    reservationService
      .getAllReservations()
      .then((reservations) => {
        commit('getReservationsSuccess', reservations);
      })
      .catch((err) => {
        console.error(err);
        commit('getReservationsFailed');
        dispatch('alert/error', config.MESSAGE.GET_RESERVATIONS_ERROR, { root: true });
      });
  },

  createReservation({ dispatch, commit }, reservation) {
    commit('startBasicRequest');
    reservationService
      .createReservation(reservation)
      .then((reservation) => {
        commit('createReservationSuccess', reservation);
        dispatch('alert/success', config.MESSAGE.RESERVATION_CREATED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', err, { root: true });
      });
  },

  updateReservation({ dispatch, commit }, reservation) {
    commit('startBasicRequest');
    reservationService
      .updateReservation(reservation)
      .then((res) => {
        commit('updateReservationSuccess', res);
        dispatch('alert/success', config.MESSAGE.RESERVATION_UPDATED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', err, { root: true });
      });
  },

  deleteReservation({ dispatch, commit }, reservationId) {
    commit('startBasicRequest');
    reservationService
      .deleteReservation(reservationId)
      .then(() => {
        commit('deleteReservationSuccess', reservationId);
        dispatch('alert/success', config.MESSAGE.RESERVATION_DELETED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.RESERVATION_DELETED_ERROR, { root: true });
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

  getReservationsRequest(state) {
    state.reservationList = [];
    state.loading = true;
  },

  getReservationsSuccess(state, reservations) {
    state.reservationList = reservations;
    state.loading = false;
  },

  getReservationsFailed(state) {
    state.reservationList = [];
    state.loading = false;
  },

  createReservationSuccess(state, reservation) {
    state.reservationList.push(reservation);
    state.loading = false;
  },

  deletePrinterReservations(state, printerId) {
    state.reservationList.forEach((reservation, index) => {
      if (reservation.resourceid === printerId) state.reservationList.splice(index, 1);
    });
    state.loading = false;
  },

  deleteReservationSuccess(state, reservation) {
    const index = state.reservationList.findIndex((r) => r._id === reservation);
    state.reservationList.splice(index, 1);
    state.loading = false;
  },

  updateReservationSuccess(state, reservation) {
    const index = state.reservationList.findIndex((r) => r._id === reservation._id);
    state.reservationList[index] = { ...reservation };
    state.loading = false;
  },

  setSelectedReservation(state, reservation) {
    state.selectedReservation = { ...reservation };
  },
};

const getters = {
  getPrinterReservations(state) {
    return (id) => {
      return state.reservationList.filter((r) => r.resourceid === id);
    };
  },
};

export const reservations = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
