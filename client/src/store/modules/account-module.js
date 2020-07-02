import { accountService } from '../../services/accountService';
import router from '../../router/index';

const user = JSON.parse(localStorage.getItem('user'));
const state = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null };

const actions = {
  login({ dispatch, commit }, { email, password }) {
    commit('loginRequest', { email });

    accountService
      .login(email, password)
      .then((user) => {
        commit('logginSuccess', user);
        router.push('/list').catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
        commit('loginFailure');
        dispatch('alert/error', err, { root: true });
      });
  },

  logout({ commit }) {
    accountService.logout();
    commit('logout');
  },

  toLoginPage() {
    router.push('/login').catch((err) => {
      console.log(err);
    });
  },
};

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },

  logginSuccess(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },

  loginFailure(state) {
    state.status = {};
    state.user = null;
  },

  logout(state) {
    state.status = { loggedIn: false };
    state.user = null;
  },
};

export const account = {
  namespaced: true,
  state,
  actions,
  mutations,
};
