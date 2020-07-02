import { reservationService } from '../../services/reservationService';

const state = {
  loading: false,
  reservationList: [],
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
        console.log(err);
        commit('getReservationsFailed');
        dispatch('alert/error', err, { root: true });
      });
  },

  createReservation({ dispatch, commit }, reservation) {
    commit('startBasicrequest');
    reservationService
      .createReservation(reservation)
      .then((reservation) => {
        commit('createReservationSuccess', reservation);
        dispatch('alert/success', `reservation created:  ${reservation.name}`, { root: true });
      })
      .catch((err) => {
        console.log(err);
        commit('endBasicRequest');
        dispatch('alert/error', err, { root: true });
      });
  },

  updateReservation({ dispatch, commit }, reservation) {
    commit('startBasicrequest');
    reservationService
      .updateReservation(reservation)
      .then((reservation) => {
        commit('updateReservationSuccess', reservation);
        dispatch('alert/success', `reservation updated:  ${reservation.name}`, { root: true });
      })
      .catch((err) => {
        console.log(err);
        commit('endBasicRequest');
        dispatch('alert/error', err, { root: true });
      });
  },

  deletePrinterReservations({ state, dispatch, commit }, printerId) {
    commit('startBasicrequest');
    state.reservationList.forEach((r) => {
      if (r.resourceid === printerId)
        reservationService
          .deleteReservation(r.resourceid)
          .then(() => {
            commit('deletePrinterReservationsSuccess', reservation);
            dispatch('alert/success', `reservation deleted:  ${reservation.name}`, { root: true });
          })
          .catch((err) => {
            console.log(err);
            dispatch('alert/error', err, { root: true });
          });
    });
    commit('endBasicRequest');
  },
};

const mutations = {
  startBasicrequest(state) {
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

  deletePrinterReservationsSuccess(state, reservation) {
    const index = state.reservationList.indexOf(reservation);
    state.printerList.splice(index, 1);
  },

  deleteReservationSuccess(state, reservation) {
    const index = state.reservationList.indexOf(reservation);
    state.printerList.splice(index, 1);
    state.loading = false;
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
