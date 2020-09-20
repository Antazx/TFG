import { userService } from '../../services/userService';
import { config } from '../../config/config';

const state = {
  loading: false,
  userList: [],
};

const actions = {
  getUsers({ commit, dispatch }) {
    commit('startBasicRequest');
    userService
      .getAllUsers()
      .then((users) => {
        commit('getUsersSuccess', users);
        dispatch('alert/success', config.MESSAGE.USER_GET, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('getUsersFailed');
        dispatch('alert/error', config.MESSAGE.USER_GET_ERROR, { root: true });
      });
  },

  deleteUser({ commit, dispatch }, user) {
    commit('startBasicRequest');
    userService
      .deleteUser(user)
      .then(() => {
        commit('deleteUsersSuccess', user);
        dispatch('alert/success', config.MESSAGE.USER_DELETED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.USER_DELETED_ERROR, { root: true });
      });
  },

  createUser({ commit, dispatch }, user) {
    commit('startBasicRequest');
    userService
      .createUser(user)
      .then((user) => {
        commit('createUserSuccess', user);
        dispatch('alert/success', config.MESSAGE.USER_CREATED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.USER_CREATED_ERROR, { root: true });
      });
  },

  updateUser({ commit, dispatch }, user) {
    commit('startBasicRequest');
    userService
      .updateUser(user)
      .then((user) => {
        commit('updateUserSuccess', user);
        dispatch('alert/success', config.MESSAGE.USER_UPDATED, { root: true });
      })
      .catch((err) => {
        console.error(err);
        commit('endBasicRequest');
        dispatch('alert/error', config.MESSAGE.USER_UPDATED_ERROR, { root: true });
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

  getUsersSuccess(state, users) {
    state.userList = users;
    state.loading = false;
  },

  getUsersFailed(state) {
    state.userList = [];
    state.loading = false;
  },

  createUserSuccess(state, user) {
    state.userList.push(user);
    state.loading = false;
  },

  deleteUsersSuccess(state, user) {
    const index = state.userList.indexOf(user);
    state.userList.splice(index, 1);
    state.loading = false;
  },

  updateUserSuccess(state, user) {
    const index = state.userList.indexOf(user);
    state.userList.splice(index, 1, user);
    state.loading = false;
  },
};

export const users = {
  namespaced: true,
  state,
  actions,
  mutations,
};
