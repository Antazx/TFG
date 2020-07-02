import { userService } from '../../services/userService';

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
      })
      .catch((err) => {
        commit('getUsersFailed');
        dispatch('alert/error', err, { root: true });
      });
  },

  deleteUser({ commit, dispatch }, user) {
    commit('startBasicRequest');
    userService
      .deleteUser(user)
      .then(() => {
        commit('deleteUsersSuccess', user);
      })
      .catch((err) => {
        commit('endBasicRequest');
        dispatch('alert/error', err, { root: true });
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

  deleteUsersSuccess(state, user) {
    const index = state.userList.indexOf(user);
    state.userList.splice(index, 1);
    state.loading = false;
  },
};

export const users = {
  namespaced: true,
  state,
  actions,
  mutations,
};
